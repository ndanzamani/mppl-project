<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Illuminate\Support\Facades\Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard/join-realm', function () {
    return Inertia::render('Auth/JoinRealm');
})->middleware(['auth', 'verified'])->name('servers.onboarding');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'channels' => \DB::table('channels')->get(),
        'projects' => \DB::table('projects')
            ->leftJoin('users', 'projects.submitted_by', '=', 'users.id')
            ->select('projects.*', 'users.name as author_name')
            ->get(),
        'quests' => \DB::table('quests')
            ->leftJoin('users', 'quests.posted_by', '=', 'users.id')
            ->select('quests.*', 'users.name as author_name')
            ->get(),
        'messages' => \DB::table('messages')
            ->join('users', 'messages.user_id', '=', 'users.id')
            ->join('channels', 'messages.channel_id', '=', 'channels.id')
            ->select('messages.*', 'users.name as user_name', 'users.avatar as user_avatar', 'channels.name as channel_name')
            ->orderBy('messages.created_at', 'desc')
            ->limit(20)
            ->get(),
        'members' => \DB::table('users')
            ->select('id', 'name', 'email', 'avatar', 'status', 'xp', 'level')
            ->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/settings', function () {
    return Inertia::render('Settings');
})->middleware(['auth', 'verified'])->name('settings');

Route::get('/dashboard/hierarchy', function () {
    $roles = \App\Models\Role::orderBy('hierarchy_level', 'desc')->get()->map(function ($role) {
        $members = \App\Models\User::role($role->name)->select('id', 'name', 'email', 'avatar', 'status', 'xp', 'level')->get();
        return [
            'id' => $role->id,
            'name' => $role->name,
            'guard_name' => $role->guard_name,
            'color' => $role->color ?? '#6366F1',
            'hierarchy_level' => (int) $role->hierarchy_level,
            'icon' => $role->icon ?? 'Shield',
            'permissions' => $role->permissions()->pluck('name')->toArray(),
            'members_count' => $members->count(),
            'members' => $members,
        ];
    });

    $allUsers = \App\Models\User::select('id', 'name', 'email', 'avatar', 'status', 'xp', 'level')->get();

    return Inertia::render('Hierarchy', [
        'initialRoles' => $roles,
        'allUsers' => $allUsers,
    ]);
})->middleware(['auth', 'verified'])->name('hierarchy');

Route::get('/dashboard/channels', function () {
    $channels = \App\Models\Channel::with(['voiceParticipants.user:id,name,avatar,status,level'])->get()->map(function ($ch) {
        return [
            'id' => $ch->id,
            'name' => $ch->name,
            'type' => $ch->type,
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

    return Inertia::render('Channels', [
        'initialChannels' => $channels,
    ]);
})->middleware(['auth', 'verified'])->name('channels');

Route::get('/dashboard/board', function () {
    return Inertia::render('ProjectsBoard');
})->middleware(['auth', 'verified'])->name('board');

Route::get('/dashboard/profile/{id?}', function ($id = null) {
    return Inertia::render('Profile', [
        'profileUserId' => $id ? (int) $id : Auth::id(),
    ]);
})->middleware(['auth', 'verified'])->name('profile.show');

Route::get('/dashboard/team', function () {
    return Inertia::render('Team');
})->middleware(['auth', 'verified'])->name('team');

Route::get('/dashboard/quests', function () {
    return Inertia::render('Quests');
})->middleware(['auth', 'verified'])->name('quests');

// Server & Workspace Management API Endpoints
Route::middleware('auth')->group(function () {
    Route::get('/api/database/export', function() {
        $path = base_path('database/guildhall_database_dump.sql');
        if (!file_exists($path)) {
            exec('php ' . base_path('export_database.php'));
        }
        return response()->download($path, 'guildhall_database_backup_' . date('Y_m_d') . '.sql', [
            'Content-Type' => 'application/sql',
        ]);
    });

    Route::get('/api/servers/current', [\App\Http\Controllers\Api\ServerController::class, 'current']);
    Route::post('/api/servers', [\App\Http\Controllers\Api\ServerController::class, 'store']);
    Route::post('/api/servers/join', [\App\Http\Controllers\Api\ServerController::class, 'join']);
    Route::post('/api/servers/resign', [\App\Http\Controllers\Api\ServerController::class, 'resign']);
    Route::post('/api/servers/{id}/invite-code/regenerate', [\App\Http\Controllers\Api\ServerController::class, 'regenerateInviteCode']);

    // Role API
    Route::get('/api/roles', [\App\Http\Controllers\Api\RoleController::class, 'index']);
    Route::post('/api/roles', [\App\Http\Controllers\Api\RoleController::class, 'store']);
    Route::patch('/api/roles/{id}', [\App\Http\Controllers\Api\RoleController::class, 'update']);
    Route::delete('/api/roles/{id}', [\App\Http\Controllers\Api\RoleController::class, 'destroy']);
    Route::post('/api/users/{id}/assign-role', [\App\Http\Controllers\Api\RoleController::class, 'assignRole']);

    // Quest API
    Route::get('/api/quests', [\App\Http\Controllers\Api\QuestController::class, 'index']);
    Route::post('/api/quests', [\App\Http\Controllers\Api\QuestController::class, 'store']);
    Route::post('/api/quests/{id}/claim', [\App\Http\Controllers\Api\QuestController::class, 'claim']);
    Route::post('/api/quests/{id}/complete', [\App\Http\Controllers\Api\QuestController::class, 'complete']);
    Route::delete('/api/quests/{id}', [\App\Http\Controllers\Api\QuestController::class, 'destroy']);

    // User Profile API
    Route::get('/api/users', [\App\Http\Controllers\Api\UserController::class, 'index']);
    Route::get('/api/users/{id}', [\App\Http\Controllers\Api\UserController::class, 'show']);
    Route::patch('/api/users/{id}/status', [\App\Http\Controllers\Api\UserController::class, 'updateStatus']);
    Route::patch('/api/users/{id}/theme', [\App\Http\Controllers\Api\UserController::class, 'updateTheme']);
    Route::patch('/api/users/{id}/ui-mode', [\App\Http\Controllers\Api\UserController::class, 'updateUiMode']);
    Route::post('/api/users/{id}/award-xp', [\App\Http\Controllers\Api\UserController::class, 'awardXp']);

    // Channel API
    Route::get('/api/channels', [\App\Http\Controllers\Api\ChannelController::class, 'index']);
    Route::post('/api/channels', [\App\Http\Controllers\Api\ChannelController::class, 'store']);
    Route::delete('/api/channels/{id}', [\App\Http\Controllers\Api\ChannelController::class, 'destroy']);
    Route::post('/api/channels/{id}/join', [\App\Http\Controllers\Api\ChannelController::class, 'joinVoice']);
    Route::post('/api/channels/{id}/leave', [\App\Http\Controllers\Api\ChannelController::class, 'leaveVoice']);
    Route::get('/api/channels/{id}/messages', [\App\Http\Controllers\Api\ChannelController::class, 'getMessages']);
    Route::post('/api/channels/{id}/messages', [\App\Http\Controllers\Api\ChannelController::class, 'postMessage']);
    Route::post('/api/channels/{id}/signal', [\App\Http\Controllers\Api\ChannelController::class, 'signal']);
    Route::post('/api/channels/{id}/presentation/raise-hand', [\App\Http\Controllers\Api\ChannelController::class, 'raiseHand']);
    Route::post('/api/channels/{id}/presentation/start', [\App\Http\Controllers\Api\ChannelController::class, 'startPresentation']);

    // Project Submission Board API
    Route::get('/api/projects', [\App\Http\Controllers\Api\ProjectController::class, 'index']);
    Route::post('/api/projects', [\App\Http\Controllers\Api\ProjectController::class, 'store']);
    Route::post('/api/projects/{id}/vote', [\App\Http\Controllers\Api\ProjectController::class, 'vote']);
    Route::post('/api/projects/{id}/verify', [\App\Http\Controllers\Api\ProjectController::class, 'verify']);
    Route::post('/api/projects/{id}/approval-mode', [\App\Http\Controllers\Api\ProjectController::class, 'setApprovalMode']);
    Route::post('/api/projects/{id}/submit-work', [\App\Http\Controllers\Api\ProjectController::class, 'submitWork']);
    Route::post('/api/projects/{id}/attachments', [\App\Http\Controllers\Api\ProjectController::class, 'uploadAttachment']);
    Route::patch('/api/projects/{id}/status', [\App\Http\Controllers\Api\ProjectController::class, 'updateStatus']);
    Route::get('/api/projects/{id}/comments', [\App\Http\Controllers\Api\ProjectController::class, 'getComments']);
    Route::post('/api/projects/{id}/comments', [\App\Http\Controllers\Api\ProjectController::class, 'postComment']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
