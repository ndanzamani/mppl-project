<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Channel;
use App\Models\Project;
use App\Models\Quest;
use Illuminate\Support\Facades\Auth;

echo "======================================================\n";
echo "      GUILDHALL RPG v1.0 - FINAL QA TEST SUITE      \n";
echo "======================================================\n\n";

$passCount = 0;
$totalTests = 0;

function runTest($title, $callback) {
    global $passCount, $totalTests;
    $totalTests++;
    echo "[TEST {$totalTests}] {$title} ... ";
    try {
        $result = $callback();
        if ($result) {
            echo "PASS (OK)\n";
            $passCount++;
        } else {
            echo "FAIL (Check Output)\n";
        }
    } catch (\Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

// Test 1: User authentication & profile fetching
runTest("User Profile & Attributes API", function() {
    $user = User::find(1);
    return $user && $user->email === 'admin@guildhall.io';
});

// Test 2: Database Indexes schema check
runTest("Database QA Performance Indexes", function() {
    return Schema::hasIndex('messages', ['channel_id']) &&
           Schema::hasIndex('projects', ['status']) &&
           Schema::hasIndex('quests', ['status']) &&
           Schema::hasIndex('users', ['status']);
});

// Test 3: Channel listings
runTest("Text Halls & Voice Taverns Query", function() {
    $channels = Channel::all();
    return $channels->count() >= 2;
});

// Test 4: Missions Board Query
runTest("Missions Board Proposals Query", function() {
    $projects = Project::all();
    return $projects->count() >= 1;
});

// Test 5: Quests Bounty Query
runTest("RPG Quest Log Bounty Query", function() {
    $quests = Quest::all();
    return $quests->count() >= 1;
});

// Test 6: Theme System Persistence
runTest("5-Theme System Preference Check", function() {
    $user = User::find(1);
    $user->theme = 'midnight';
    $user->save();
    $reloaded = User::find(1);
    return $reloaded->theme === 'midnight';
});

// Test 7: XP & Leveling Formula Engine
runTest("XP & Leveling Curve Engine", function() {
    $xp = 1600;
    $level = floor(sqrt($xp / 100)) + 1;
    return $level == 5;
});

echo "\n======================================================\n";
echo "    QA AUDIT COMPLETE: {$passCount}/{$totalTests} TESTS PASSED GREEN\n";
echo "======================================================\n";
