<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use App\Models\VoiceParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChannelController extends Controller
{
    /**
     * Get accessible channels list grouped by category.
     */
    public function index()
    {
        $channels = Channel::with(['voiceParticipants.user:id,name,avatar,status,level'])->get()->map(function ($ch) {
            return [
                'id' => $ch->id,
                'name' => $ch->name,
                'type' => $ch->type, // text, voice, tavern
                'owner_id' => $ch->owner_id,
                'settings' => is_string($ch->settings) ? json_decode($ch->settings, true) : ($ch->settings ?? []),
                'participants' => $ch->voiceParticipants->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'user_id' => $p->user_id,
                        'user_name' => $p->user->name ?? 'Adventurer',
                        'avatar' => $p->user->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $p->user_id,
                        'seat_number' => $p->seat_number,
                        'is_muted' => $p->is_muted,
                        'is_deafened' => $p->is_deafened,
                        'hand_raised_at' => $p->hand_raised_at,
                        'is_presenting' => $p->is_presenting,
                    ];
                }),
                'active_participants_count' => $ch->voiceParticipants->count(),
            ];
        });

        return response()->json($channels);
    }

    /**
     * Create a new text, voice, or tavern channel.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:text,voice,tavern',
            'topic' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        $channel = Channel::create([
            'name' => strtolower(str_replace(' ', '-', $validated['name'])),
            'type' => $validated['type'],
            'owner_id' => $user->id,
            'settings' => json_encode([
                'topic' => $validated['topic'] ?? ($validated['type'] === 'tavern' ? 'RPG Tavern Lounge & Potion Bar' : 'General channel discussion'),
                'bitrate' => 64000,
            ]),
        ]);

        return response()->json([
            'message' => 'Channel created successfully',
            'channel' => $channel,
        ], 201);
    }

    /**
     * Delete a channel.
     */
    public function destroy($id)
    {
        $channel = Channel::findOrFail($id);
        $channel->delete();

        return response()->json(['message' => 'Channel deleted successfully']);
    }

    /**
     * Join voice / tavern channel and assign 3D seat (1-12).
     */
    public function joinVoice(Request $request, $id)
    {
        $channel = Channel::findOrFail($id);
        $user = Auth::user();

        // Check assigned seats
        $occupiedSeats = VoiceParticipant::where('channel_id', $id)->pluck('seat_number')->toArray();
        $assignedSeat = 1;
        for ($s = 1; $s <= 12; $s++) {
            if (!in_array($s, $occupiedSeats)) {
                $assignedSeat = $s;
                break;
            }
        }

        $participant = VoiceParticipant::updateOrCreate(
            ['channel_id' => $id, 'user_id' => $user->id],
            [
                'seat_number' => $assignedSeat,
                'is_muted' => false,
                'is_deafened' => false,
            ]
        );

        return response()->json([
            'message' => 'Joined voice channel',
            'seat_number' => $assignedSeat,
            'participant' => $participant->load('user:id,name,avatar,status,level'),
        ]);
    }

    /**
     * Leave voice channel.
     */
    public function leaveVoice(Request $request, $id)
    {
        $user = Auth::user();
        VoiceParticipant::where('channel_id', $id)->where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Left voice channel']);
    }

    /**
     * Get paginated channel messages.
     */
    public function getMessages($id)
    {
        $messages = DB::table('messages')
            ->where('channel_id', $id)
            ->join('users', 'messages.user_id', '=', 'users.id')
            ->select(
                'messages.id',
                'messages.channel_id',
                'messages.user_id',
                'messages.content',
                'messages.type',
                'messages.created_at',
                'users.name as user_name',
                'users.avatar as user_avatar'
            )
            ->orderBy('messages.created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($messages);
    }

    /**
     * Post a new message to channel.
     */
    public function postMessage(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'type' => 'nullable|string|in:text,image,file',
        ]);

        $user = Auth::user();

        $messageId = DB::table('messages')->insertGetId([
            'channel_id' => $id,
            'user_id' => $user->id,
            'content' => $validated['content'],
            'type' => $validated['type'] ?? 'text',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $msg = [
            'id' => $messageId,
            'channel_id' => (int) $id,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_avatar' => $user->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $user->id,
            'content' => $validated['content'],
            'type' => $validated['type'] ?? 'text',
            'created_at' => now()->toDateTimeString(),
        ];

        return response()->json($msg, 201);
    }

    /**
     * WebRTC peer signaling endpoint.
     */
    public function signal(Request $request, $id)
    {
        $validated = $request->validate([
            'target_user_id' => 'required|integer',
            'type' => 'required|string|in:offer,answer,candidate',
            'data' => 'required',
        ]);

        return response()->json([
            'message' => 'Signaling payload dispatched',
            'sender_id' => Auth::id(),
            'target_user_id' => $validated['target_user_id'],
            'type' => $validated['type'],
            'data' => $validated['data'],
        ]);
    }

    /**
     * Raise or lower hand in presentation queue.
     */
    public function raiseHand(Request $request, $id)
    {
        $user = Auth::user();
        
        // Find or auto-create participant seat
        $participant = VoiceParticipant::firstOrCreate(
            ['channel_id' => $id, 'user_id' => $user->id],
            ['seat_number' => 1, 'is_muted' => false, 'is_deafened' => false]
        );

        $participant->hand_raised_at = $participant->hand_raised_at ? null : now();
        $participant->save();

        $handQueue = VoiceParticipant::where('channel_id', $id)
            ->whereNotNull('hand_raised_at')
            ->orderBy('hand_raised_at', 'asc')
            ->with('user:id,name,avatar')
            ->get();

        return response()->json([
            'message' => $participant->hand_raised_at ? 'Hand raised' : 'Hand lowered',
            'queue' => $handQueue,
        ]);
    }

    /**
     * Start/Set active presentation on 3D screen.
     */
    public function startPresentation(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $user = Auth::user();

        // Update active presenter
        VoiceParticipant::where('channel_id', $id)->update(['is_presenting' => false]);
        VoiceParticipant::where('channel_id', $id)->where('user_id', $user->id)->update(['is_presenting' => true]);

        return response()->json([
            'message' => 'Presentation slide updated on 3D board',
            'presenter' => $user->name,
            'presentation' => [
                'title' => $validated['title'],
                'content' => $validated['content'],
                'presenter_name' => $user->name,
            ],
        ]);
    }
}
