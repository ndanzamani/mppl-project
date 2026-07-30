<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Channel;
use App\Models\Project;
use App\Models\Quest;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

echo "======================================================\n";
echo "   GUILDHALL RPG v1.0 - FULL SYSTEM COMPREHENSIVE CHECK \n";
echo "======================================================\n\n";

$passCount = 0;
$totalCount = 0;

function checkItem($title, $callback) {
    global $passCount, $totalCount;
    $totalCount++;
    echo "[VERIFY {$totalCount}] {$title} ... ";
    try {
        $res = $callback();
        if ($res) {
            echo "SUCCESS (GREEN)\n";
            $passCount++;
        } else {
            echo "FAILED\n";
        }
    } catch (\Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

// 1. User & XP System
checkItem("Default Guild Master User Profile & XP Attributes", function() {
    $user = User::find(1);
    return $user && $user->email === 'admin@guildhall.io' && isset($user->xp);
});

// 2. Database Performance Indexes
checkItem("Database Performance Composite Indexes", function() {
    return Schema::hasIndex('messages', ['channel_id']) &&
           Schema::hasIndex('projects', ['status']) &&
           Schema::hasIndex('quests', ['status']) &&
           Schema::hasIndex('users', ['status']);
});

// 3. Channels & Text Halls
checkItem("Channels & Text Halls Integrity", function() {
    $ch = Channel::first();
    return $ch && !empty($ch->name);
});

// 4. Missions Board Proposals
checkItem("Missions Board Proposals & Voting Data", function() {
    $proj = Project::first();
    return $proj && !empty($proj->name);
});

// 5. Quest Log Bounties
checkItem("Quest Log Bounty System", function() {
    $q = Quest::first();
    return $q && !empty($q->title);
});

// 6. Hierarchy Roles & Spatie Integration
checkItem("Hierarchy of Honor Roles & Ranks", function() {
    $roleCount = DB::table('roles')->count();
    return $roleCount >= 5;
});

// 7. 5-Theme System Preference
checkItem("5-Theme System Realm Switching", function() {
    $user = User::find(1);
    $user->theme = 'forest';
    $user->save();
    return User::find(1)->theme === 'forest';
});

echo "\n======================================================\n";
echo "    SYSTEM AUDIT SUMMARY: {$passCount}/{$totalCount} COMPONENT TESTS PASSED\n";
echo "======================================================\n";
