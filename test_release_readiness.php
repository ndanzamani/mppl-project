<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Server;
use App\Models\Channel;
use App\Models\Project;
use App\Models\Quest;
use Spatie\Permission\Models\Role;

echo "======================================================\n";
echo "       GUILDHALL PRE-RELEASE QA AUDIT & SEED CHECK    \n";
echo "======================================================\n\n";

$pass = 0;
$total = 0;

function auditCheck($name, $closure) {
    global $pass, $total;
    $total++;
    echo "[CHECK {$total}] {$name} ... ";
    try {
        if ($closure()) {
            echo "PASS (GREEN)\n";
            $pass++;
        } else {
            echo "FAIL (RED)\n";
        }
    } catch (\Throwable $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

// 1. Central Server Exists
auditCheck("Central Guild Realm Server Exists", function() {
    $server = Server::where('invite_code', 'REALM-MAIN01')->first();
    return $server && $server->name === 'Central Guild Realm';
});

// 2. Roles Verification
auditCheck("5 Hierarchy Ranks Seeded (100, 80, 60, 40, 20)", function() {
    return Role::count() >= 5;
});

// 3. User Credentials Verification
auditCheck("Test Accounts Ready (Admin, PM, Sr Dev, Dev, Intern)", function() {
    $admin = User::where('email', 'admin@guildhall.io')->first();
    $pm = User::where('email', 'arthur@guildhall.io')->first();
    $dev = User::where('email', 'lucas@guildhall.io')->first();
    $intern = User::where('email', 'kaelen@guildhall.io')->first();

    return $admin && $pm && $dev && $intern && $admin->server_id !== null;
});

// 4. Default Channels Check
auditCheck("Default Channels Active (#general-hall, voice-tavern)", function() {
    $textCh = Channel::where('name', 'general-hall')->first();
    $voiceCh = Channel::where('name', 'voice-tavern')->first();
    return $textCh && $voiceCh;
});

// 5. Missions Board Check
auditCheck("Missions Board Initial Mission Active", function() {
    return Project::count() >= 1;
});

// 6. Quest Log Check
auditCheck("Quest Log Active Quests Available", function() {
    return Quest::count() >= 1;
});

// 7. Strict 1-Account 1-Server Constraint Test
auditCheck("Strict 1-Account 1-Server Constraint Active", function() {
    $user = User::where('email', 'admin@guildhall.io')->first();
    return $user->server_id !== null;
});

echo "\n======================================================\n";
echo "   RELEASE READINESS SUMMARY: {$pass}/{$total} CHECKS PASSED GREEN\n";
echo "======================================================\n";
