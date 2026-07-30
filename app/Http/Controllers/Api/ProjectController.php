<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectVote;
use App\Models\ProjectComment;
use App\Models\ProjectAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Get projects list with submitter, assigned user, and attachments.
     */
    public function index(Request $request)
    {
        $query = Project::with([
            'submitter:id,name,email,avatar,level',
            'assignedUser:id,name,email,avatar,level',
            'attachments.uploader:id,name',
            'comments.user:id,name,avatar'
        ]);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $projects = $query->orderBy('updated_at', 'desc')->get()->map(function ($p) {
            // Auto decision timer check
            if ($p->status === 'in_review' && $p->timer_expires_at && now()->greaterThanOrEqualTo($p->timer_expires_at)) {
                if ($p->approval_mode === 'vote_based') {
                    $p->status = ($p->votes_for >= $p->votes_against) ? 'approved' : 'rejected';
                } else if ($p->approval_mode === 'timer_accept') {
                    $p->status = 'approved';
                }
                $p->save();
            }

            $totalVotes = $p->votes_for + $p->votes_against;
            $positiveRatio = $totalVotes > 0 ? round(($p->votes_for / $totalVotes) * 100) : 0;

            return [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'status' => $p->status,
                'approval_mode' => $p->approval_mode,
                'timer_expires_at' => $p->timer_expires_at ? $p->timer_expires_at->toIso8601String() : null,
                'submitted_by' => $p->submitted_by,
                'submitter_name' => $p->submitter->name ?? 'Administrator',
                'submitter_avatar' => $p->submitter->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $p->submitted_by,
                'assigned_to' => $p->assigned_to,
                'assigned_name' => $p->assignedUser->name ?? 'Unassigned',
                'assigned_avatar' => $p->assignedUser->avatar ?? null,
                'submission_notes' => $p->submission_notes,
                'deadline' => $p->deadline ? $p->deadline->toIso8601String() : null,
                'votes_for' => $p->votes_for,
                'votes_against' => $p->votes_against,
                'total_votes' => $totalVotes,
                'positive_ratio' => $positiveRatio,
                'live_url' => $p->live_url,
                'attachments' => $p->attachments->map(fn($att) => [
                    'id' => $att->id,
                    'file_name' => $att->file_name,
                    'file_path' => Storage::url($att->file_path),
                    'file_type' => $att->file_type,
                    'file_size' => $att->file_size,
                    'uploaded_by' => $att->uploader->name ?? 'User',
                    'created_at' => $att->created_at->toFormattedDateString(),
                ]),
                'comments_count' => $p->comments->count(),
                'created_at' => $p->created_at->toIso8601String(),
            ];
        });

        return response()->json($projects);
    }

    /**
     * Store new official project.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $userRole = $user->roles()->orderBy('hierarchy_level', 'desc')->first();
        $level = $userRole->hierarchy_level ?? 40;

        if ($level < 60) {
            return response()->json([
                'message' => 'Unauthorized. Official projects can only be created by Project Managers (Rank 60+) or CEOs/Guild Masters.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'nullable|exists:users,id',
            'live_url' => 'nullable|url',
            'status' => 'nullable|string|in:backlog,in_progress,in_review,approved,rejected',
            'deadline' => 'nullable|date',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'status' => $validated['status'] ?? 'backlog',
            'submitted_by' => $user->id,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'live_url' => $validated['live_url'] ?? 'https://guildhall.io/demo',
            'deadline' => $validated['deadline'] ?? now()->addDays(7),
            'votes_for' => 0,
            'votes_against' => 0,
        ]);

        return response()->json([
            'message' => 'Official project created and assigned successfully.',
            'project' => $project->load(['submitter:id,name,avatar', 'assignedUser:id,name,avatar']),
        ], 201);
    }

    /**
     * Verify and instantly approve/reject a project in review (Higher-ups: CEO/PM).
     */
    public function verify(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->roles()->orderBy('hierarchy_level', 'desc')->first();
        $level = $userRole->hierarchy_level ?? 40;

        if ($level < 60) {
            return response()->json([
                'message' => 'Unauthorized. Only Project Managers (Rank 60+) or CEOs can verify and approve projects.'
            ], 403);
        }

        $validated = $request->validate([
            'decision' => 'nullable|in:approved,rejected',
        ]);

        $project = Project::findOrFail($id);
        $project->status = $validated['decision'] ?? 'approved';
        $project->save();

        return response()->json([
            'message' => "Project verified and marked as {$project->status}!",
            'project' => $project->load(['submitter:id,name,avatar', 'assignedUser:id,name,avatar']),
        ]);
    }

    /**
     * CEO Multi-Option Approval Config: Set auto-timer or vote-based decision.
     */
    public function setApprovalMode(Request $request, $id)
    {
        $user = Auth::user();
        $userRole = $user->roles()->orderBy('hierarchy_level', 'desc')->first();
        $level = $userRole->hierarchy_level ?? 40;

        if ($level < 60) {
            return response()->json([
                'message' => 'Unauthorized. Only Project Managers (Rank 60+) or CEOs can set approval timers.'
            ], 403);
        }

        $validated = $request->validate([
            'approval_mode' => 'required|in:manual,timer_accept,vote_based',
            'timer_hours' => 'nullable|integer|min:1|max:168',
        ]);

        $project = Project::findOrFail($id);
        $project->approval_mode = $validated['approval_mode'];

        if ($validated['approval_mode'] !== 'manual' && !empty($validated['timer_hours'])) {
            $project->timer_expires_at = now()->addHours((int) $validated['timer_hours']);
        } else {
            $project->timer_expires_at = null;
        }

        $project->save();

        return response()->json([
            'message' => "Approval mode updated to {$project->approval_mode}",
            'project' => $project,
        ]);
    }

    /**
     * Upload File Attachment (PDF, Image, ZIP, Doc).
     */
    public function uploadAttachment(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $request->validate([
            'file' => 'required|file|max:20480', // Max 20MB
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getClientMimeType();
        $fileSize = $file->getSize();

        $path = $file->store('project_attachments', 'public');

        $attachment = ProjectAttachment::create([
            'project_id' => $project->id,
            'file_name' => $fileName,
            'file_path' => $path,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'uploaded_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Attachment uploaded successfully!',
            'attachment' => [
                'id' => $attachment->id,
                'file_name' => $attachment->file_name,
                'file_path' => Storage::url($attachment->file_path),
                'file_type' => $attachment->file_type,
                'file_size' => $attachment->file_size,
                'uploaded_by' => Auth::user()->name,
                'created_at' => $attachment->created_at->toFormattedDateString(),
            ]
        ], 201);
    }

    /**
     * Submit work for review (Assigned worker).
     */
    public function submitWork(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'submission_notes' => 'required|string',
            'live_url' => 'nullable|url',
        ]);

        $project->submission_notes = $validated['submission_notes'];
        if (!empty($validated['live_url'])) {
            $project->live_url = $validated['live_url'];
        }
        $project->status = 'in_review';
        $project->save();

        return response()->json([
            'message' => 'Work submitted for executive verification!',
            'project' => $project->load(['submitter:id,name,avatar', 'assignedUser:id,name,avatar']),
        ]);
    }

    /**
     * Update project status via drag-and-drop.
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:backlog,in_progress,in_review,approved,rejected',
        ]);

        $project = Project::findOrFail($id);
        $project->status = $validated['status'];
        $project->save();

        return response()->json([
            'message' => "Project status updated to {$validated['status']}",
            'project' => $project,
        ]);
    }

    /**
     * Vote upvote/downvote on project proposal.
     */
    public function vote(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'required|in:up,down',
        ]);

        $project = Project::findOrFail($id);
        $user = Auth::user();
        $voteValue = $validated['type'] === 'up' ? 1 : -1;

        $existing = ProjectVote::where('project_id', $id)->where('user_id', $user->id)->first();

        if ($existing) {
            if ($existing->vote === 1) $project->votes_for = max(0, $project->votes_for - 1);
            if ($existing->vote === -1) $project->votes_against = max(0, $project->votes_against - 1);
            $existing->vote = $voteValue;
            $existing->save();
        } else {
            ProjectVote::create([
                'project_id' => $id,
                'user_id' => $user->id,
                'vote' => $voteValue,
            ]);
        }

        if ($voteValue === 1) $project->votes_for++;
        if ($voteValue === -1) $project->votes_against++;
        $project->save();

        return response()->json([
            'message' => 'Vote recorded',
            'votes_for' => $project->votes_for,
            'votes_against' => $project->votes_against,
        ]);
    }

    /**
     * Get project comments.
     */
    public function getComments($id)
    {
        $comments = ProjectComment::where('project_id', $id)
            ->with('user:id,name,avatar,level')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Post a comment to project.
     */
    public function postComment(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        $comment = ProjectComment::create([
            'project_id' => $id,
            'user_id' => $user->id,
            'content' => $validated['content'],
        ]);

        return response()->json([
            'message' => 'Comment posted successfully',
            'comment' => $comment->load('user:id,name,avatar,level'),
        ], 201);
    }
}
