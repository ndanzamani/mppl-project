<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\Channel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ServerController extends Controller
{
    /**
     * Get user's current company server details.
     */
    public function current()
    {
        $user = Auth::user();

        if (!$user->server_id) {
            return response()->json([
                'has_server' => false,
                'server' => null,
            ]);
        }

        $server = Server::with(['owner:id,name,email,avatar', 'members:id,name,avatar,status,level,server_id'])
            ->withCount('members')
            ->find($user->server_id);

        if (!$server) {
            return response()->json([
                'has_server' => false,
                'server' => null,
            ]);
        }

        return response()->json([
            'has_server' => true,
            'server' => [
                'id' => $server->id,
                'name' => $server->name,
                'slug' => $server->slug,
                'icon' => $server->icon,
                'description' => $server->description,
                'owner_id' => $server->owner_id,
                'is_owner' => $server->owner_id === $user->id,
                'invite_code' => $server->invite_code,
                'members_count' => $server->members_count,
                'members' => $server->members,
            ],
        ]);
    }

    /**
     * Found a new company server (Requires user to be currently unemployed / server_id == null).
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // 1-Worker 1-Company Constraint Check
        if ($user->server_id !== null) {
            return response()->json([
                'message' => 'Unauthorized. You are currently employed in a company! You must resign from your active company before founding a new one.'
            ], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|url',
        ]);

        $inviteCode = Server::generateInviteCode();

        $server = Server::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
            'icon' => $validated['icon'] ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . urlencode($validated['name']),
            'description' => $validated['description'] ?? 'Private Guild Company Workspace',
            'owner_id' => $user->id,
            'invite_code' => $inviteCode,
        ]);

        // Assign user as CEO/Guild Master of new server
        $user->server_id = $server->id;
        $user->save();

        // Seed default channels for new server
        Channel::create([
            'server_id' => $server->id,
            'name' => 'general-hall',
            'type' => 'text',
            'owner_id' => $user->id,
            'settings' => json_encode(['topic' => 'General company chat & discussion']),
        ]);

        Channel::create([
            'server_id' => $server->id,
            'name' => 'voice-tavern',
            'type' => 'tavern',
            'owner_id' => $user->id,
            'settings' => json_encode(['topic' => 'Live 3D Company Voice Tavern']),
        ]);

        return response()->json([
            'message' => 'New Company Server founded successfully!',
            'server' => $server,
            'invite_code' => $inviteCode,
        ], 201);
    }

    /**
     * Join a company server via HR Invitation Code (Requires user.server_id == null).
     */
    public function join(Request $request)
    {
        $user = Auth::user();

        // 1-Worker 1-Company Constraint Check
        if ($user->server_id !== null) {
            return response()->json([
                'message' => 'Unauthorized. You are already employed in a company server! You must resign before joining another company.'
            ], 400);
        }

        $validated = $request->validate([
            'invite_code' => 'required|string|max:20',
        ]);

        $code = strtoupper(trim($validated['invite_code']));

        $server = Server::where('invite_code', $code)->first();

        if (!$server) {
            return response()->json([
                'message' => 'Invalid HR Invitation Code. Please check the 8-character code and try again.'
            ], 404);
        }

        // Join user to company server
        $user->server_id = $server->id;
        $user->save();

        return response()->json([
            'message' => "Welcome to {$server->name}! You have successfully joined the company.",
            'server' => $server,
        ]);
    }

    /**
     * Resign from current active company server.
     */
    public function resign(Request $request)
    {
        $user = Auth::user();

        if (!$user->server_id) {
            return response()->json([
                'message' => 'You are not currently part of any company server.'
            ], 400);
        }

        $server = Server::find($user->server_id);
        $serverName = $server->name ?? 'Company';

        // Resign user from company
        $user->server_id = null;
        $user->save();

        return response()->json([
            'message' => "You have resigned from {$serverName}. You are now a free adventurer looking for a new company!",
        ]);
    }

    /**
     * Regenerate HR Invitation Code (CEO / Guild Master only).
     */
    public function regenerateInviteCode($id)
    {
        $user = Auth::user();
        $server = Server::findOrFail($id);

        if ($server->owner_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized. Only the CEO / Guild Master can regenerate the HR invitation code.'
            ], 403);
        }

        $server->invite_code = Server::generateInviteCode();
        $server->save();

        return response()->json([
            'message' => 'HR Invitation code regenerated successfully',
            'invite_code' => $server->invite_code,
        ]);
    }
}
