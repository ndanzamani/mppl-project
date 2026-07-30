<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use App\Models\User;
use App\Models\GuildNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuestController extends Controller
{
    /**
     * List all quests with status/owner filtering and sorting
     */
    public function index(Request $request)
    {
        $query = Quest::with(['poster.roles', 'claimer.roles']);

        // Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'mine') {
                $query->where(function ($q) {
                    $q->where('posted_by', Auth::id())
                      ->orWhere('accepted_by', Auth::id());
                });
            } else {
                $query->where('status', $request->status);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        if ($sort === 'expiring_soon') {
            $query->orderBy('expires_at', 'asc');
        } elseif ($sort === 'reward') {
            $query->orderBy('reward_xp', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $quests = $query->get()->map(function ($q) {
            $posterRole = $q->poster ? $q->poster->roles->first() : null;
            $claimerRole = $q->claimer ? $q->claimer->roles->first() : null;

            return [
                'id' => $q->id,
                'title' => $q->title,
                'description' => $q->description,
                'reward_xp' => $q->reward_xp,
                'status' => $q->status,
                'estimated_duration' => $q->estimated_duration,
                'expires_at' => $q->expires_at ? $q->expires_at->toIso8601String() : null,
                'expires_in_hours' => $q->expires_at ? max(0, round(now()->diffInHours($q->expires_at, false), 1)) : 24,
                'created_at' => $q->created_at ? $q->created_at->diffForHumans() : 'Just now',
                'posted_by' => $q->posted_by,
                'poster' => $q->poster ? [
                    'id' => $q->poster->id,
                    'name' => $q->poster->name,
                    'avatar' => $q->poster->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $q->poster->id,
                    'role_name' => $posterRole->name ?? 'Developer',
                ] : null,
                'accepted_by' => $q->accepted_by,
                'claimer' => $q->claimer ? [
                    'id' => $q->claimer->id,
                    'name' => $q->claimer->name,
                    'avatar' => $q->claimer->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $q->claimer->id,
                    'role_name' => $claimerRole->name ?? 'Developer',
                ] : null,
            ];
        });

        return response()->json($quests);
    }

    /**
     * Post a new quest (Posting awards 0 XP; XP is strictly reserved for the worker who claims & completes it)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'reward_xp' => 'nullable|integer|min:10|max:5000',
            'expires_hours' => 'nullable|integer|min:1|max:720',
            'estimated_duration' => 'nullable|string|max:100',
        ]);

        $user = Auth::user();
        $userRole = $user->roles->first();
        $hierarchyLevel = $userRole->hierarchy_level ?? 40;

        $rewardXp = 100;
        if ($hierarchyLevel >= 60 && !empty($validated['reward_xp'])) {
            $rewardXp = (int) $validated['reward_xp'];
        }

        $expiresHours = $validated['expires_hours'] ?? 48;

        $quest = Quest::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'reward_xp' => $rewardXp,
            'posted_by' => $user->id,
            'status' => 'open',
            'expires_at' => now()->addHours($expiresHours),
            'estimated_duration' => $validated['estimated_duration'] ?? '1-2 hours',
        ]);

        return response()->json([
            'message' => 'Help request quest posted successfully!',
            'quest' => $quest->load('poster'),
        ], 201);
    }

    /**
     * Claim/Accept an open quest
     */
    public function claim(Request $request, $id)
    {
        $quest = Quest::findOrFail($id);

        if ($quest->status !== 'open') {
            return response()->json(['message' => 'Quest is no longer open for claiming.'], 422);
        }

        $user = Auth::user();

        $quest->accepted_by = $user->id;
        $quest->status = 'claimed';
        $quest->save();

        GuildNotification::create([
            'user_id' => $quest->posted_by,
            'type' => 'quest_claimed',
            'title' => '⚔️ Quest Claimed!',
            'message' => "{$user->name} has claimed your quest: '{$quest->title}'",
            'data' => ['quest_id' => $quest->id, 'claimer_id' => $user->id],
        ]);

        return response()->json([
            'message' => "You have claimed the quest: '{$quest->title}'!",
            'quest' => $quest->load(['poster', 'claimer']),
        ]);
    }

    /**
     * Mark quest completed & auto-distribute XP reward to claimer
     */
    public function complete(Request $request, $id)
    {
        $quest = Quest::findOrFail($id);

        if (!in_array($quest->status, ['claimed', 'in_progress'])) {
            return response()->json(['message' => 'Quest cannot be completed in its current state.'], 422);
        }

        if (!$quest->accepted_by) {
            return response()->json(['message' => 'Quest has no claimer.'], 422);
        }

        $quest->status = 'completed';
        $quest->completed_at = now();
        $quest->save();

        // Auto-distribute reward XP strictly to claimer
        $claimer = User::findOrFail($quest->accepted_by);
        $oldLevel = (int) floor(sqrt(($claimer->xp ?? 100) / 100)) + 1;
        $newXp = ($claimer->xp ?? 100) + $quest->reward_xp;
        $newLevel = (int) floor(sqrt($newXp / 100)) + 1;

        $claimer->xp = $newXp;
        $claimer->level = $newLevel;
        $claimer->save();

        $leveledUp = $newLevel > $oldLevel;

        GuildNotification::create([
            'user_id' => $quest->posted_by,
            'type' => 'quest_completed',
            'title' => '🎉 Quest Completed!',
            'message' => "'{$quest->title}' was completed by {$claimer->name}! +{$quest->reward_xp} XP awarded.",
            'data' => ['quest_id' => $quest->id, 'claimer_id' => $claimer->id],
        ]);

        return response()->json([
            'message' => "Quest completed! +{$quest->reward_xp} XP awarded to {$claimer->name}!",
            'quest' => $quest->load(['poster', 'claimer']),
            'reward_xp' => $quest->reward_xp,
            'claimer_new_xp' => $newXp,
            'claimer_new_level' => $newLevel,
            'leveled_up' => $leveledUp,
        ]);
    }

    /**
     * Cancel / delete a quest
     */
    public function destroy($id)
    {
        $quest = Quest::findOrFail($id);
        $quest->delete();

        return response()->json(['message' => 'Quest deleted cleanly.']);
    }
}
