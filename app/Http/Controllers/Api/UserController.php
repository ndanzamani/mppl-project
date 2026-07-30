<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Helper to compute level from XP using formula: floor(sqrt(xp / 100)) + 1
     */
    private function calculateLevel($xp)
    {
        return (int) floor(sqrt(max(0, $xp) / 100)) + 1;
    }

    /**
     * Helper to compute next level XP threshold: level^2 * 100
     */
    private function calculateNextLevelXp($level)
    {
        return pow($level, 2) * 100;
    }

    /**
     * List all team members with status, role, level, and XP stats.
     */
    public function index()
    {
        $users = User::with('roles')->get()->map(function ($u) {
            $joinedAt = $u->joined_at ? Carbon::parse($u->joined_at) : now()->subDays(rand(10, 365));
            $daysEmployed = max(0, (int) abs($joinedAt->diffInDays(now())));
            $role = $u->roles->first();

            $level = $this->calculateLevel($u->xp ?? 100);
            $nextXp = $this->calculateNextLevelXp($level);
            $prevXp = pow($level - 1, 2) * 100;
            $xpRange = max(1, $nextXp - $prevXp);
            $currentProgress = max(0, ($u->xp ?? 100) - $prevXp);
            $progressPercent = min(100, round(($currentProgress / $xpRange) * 100));

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'avatar' => $u->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $u->id,
                'status' => $u->status ?? 'working',
                'role_name' => $role->name ?? 'Developer',
                'role_color' => $role->color ?? '#3B82F6',
                'role_icon' => $role->icon ?? 'Code2',
                'hierarchy_level' => $role->hierarchy_level ?? 40,
                'xp' => $u->xp ?? 100,
                'level' => $level,
                'next_level_xp' => $nextXp,
                'progress_percent' => $progressPercent,
                'joined_at' => $joinedAt->toFormattedDateString(),
                'days_employed' => $daysEmployed,
                'ui_mode' => $u->ui_mode ?? 'rpg',
            ];
        });

        return response()->json($users);
    }

    /**
     * Get single employee profile data.
     */
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);

        $joinedAt = $user->joined_at ? Carbon::parse($user->joined_at) : now()->subDays(45);
        $daysEmployed = max(0, (int) abs($joinedAt->diffInDays(now())));
        $role = $user->roles->first();

        $level = $this->calculateLevel($user->xp ?? 100);
        $nextXp = $this->calculateNextLevelXp($level);
        $prevXp = pow($level - 1, 2) * 100;
        $xpRange = max(1, $nextXp - $prevXp);
        $currentProgress = max(0, ($user->xp ?? 100) - $prevXp);
        $progressPercent = min(100, round(($currentProgress / $xpRange) * 100));

        $achievements = [
            ['id' => 'first_quest', 'title' => 'First Quest Completed', 'icon' => 'Swords', 'unlocked' => true],
            ['id' => 'team_player', 'title' => 'Guild Team Player', 'icon' => 'Users', 'unlocked' => true],
            ['id' => 'level_5_master', 'title' => 'Level 5 Veteran', 'icon' => 'Crown', 'unlocked' => $level >= 5],
            ['id' => 'level_10_legend', 'title' => 'Level 10 Legend', 'icon' => 'Sparkles', 'unlocked' => $level >= 10],
        ];

        $rewards = [
            'level_5' => '+1 Vacation Day & Silver Crown Badge',
            'level_10' => 'Salary Bonus Tier 1 & Guild Master Badge',
        ];

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . $user->id,
            'status' => $user->status ?? 'working',
            'role_name' => $role->name ?? 'Developer',
            'role_color' => $role->color ?? '#3B82F6',
            'role_icon' => $role->icon ?? 'Code2',
            'hierarchy_level' => $role->hierarchy_level ?? 40,
            'xp' => $user->xp ?? 100,
            'level' => $level,
            'next_level_xp' => $nextXp,
            'progress_percent' => $progressPercent,
            'joined_at' => $joinedAt->toFormattedDateString(),
            'days_employed' => $daysEmployed,
            'achievements' => $achievements,
            'rewards' => $rewards,
            'ui_mode' => $user->ui_mode ?? 'rpg',
        ]);
    }

    /**
     * Update employee status enum: working, free, on_vacation, sick, away, do_not_disturb
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:working,free,on_vacation,sick,away,do_not_disturb',
        ]);

        $user = User::findOrFail($id);
        $user->status = $validated['status'];
        $user->save();

        return response()->json([
            'message' => "Employee status updated to {$validated['status']}",
            'status' => $user->status,
        ]);
    }

    /**
     * Update user theme preference: light, dark, midnight, forest, sunset
     */
    public function updateTheme(Request $request, $id)
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,midnight,forest,sunset',
        ]);

        $user = User::findOrFail($id);
        $user->theme = $validated['theme'];
        $user->save();

        return response()->json([
            'message' => "Theme preference updated to {$user->theme}",
            'theme' => $user->theme,
        ]);
    }

    /**
     * Update user UI mode preference: rpg vs corporate
     */
    public function updateUiMode(Request $request, $id)
    {
        $validated = $request->validate([
            'ui_mode' => 'required|in:rpg,corporate',
        ]);

        $user = User::findOrFail($id);
        $user->ui_mode = $validated['ui_mode'];
        $user->save();

        return response()->json([
            'message' => "UI mode updated to {$user->ui_mode}",
            'ui_mode' => $user->ui_mode,
        ]);
    }

    /**
     * Award XP and trigger level-up check.
     */
    public function awardXp(Request $request, $id)
    {
        $validated = $request->validate([
            'xp_amount' => 'required|integer|min:1',
        ]);

        $user = User::findOrFail($id);

        $oldXp = $user->xp ?? 100;
        $oldLevel = $this->calculateLevel($oldXp);

        $newXp = $oldXp + $validated['xp_amount'];
        $newLevel = $this->calculateLevel($newXp);

        $user->xp = $newXp;
        $user->level = $newLevel;
        $user->save();

        $leveledUp = $newLevel > $oldLevel;

        return response()->json([
            'message' => "+{$validated['xp_amount']} XP awarded!",
            'xp' => $newXp,
            'level' => $newLevel,
            'leveled_up' => $leveledUp,
            'old_level' => $oldLevel,
        ]);
    }
}
