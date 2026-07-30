<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Server;
use Illuminate\Support\Facades\Auth;

echo "======================================================\n";
echo "   STRICT 1-ACCOUNT 1-SERVER & RESIGNATION RULES TEST \n";
echo "======================================================\n\n";

$passCount = 0;
$totalCount = 0;

function testRule($title, $callback) {
    global $passCount, $totalCount;
    $totalCount++;
    echo "[RULE {$totalCount}] {$title} ... ";
    try {
        $res = $callback();
        if ($res) {
            echo "PASS (GREEN)\n";
            $passCount++;
        } else {
            echo "FAIL\n";
        }
    } catch (\Exception $e) {
        echo "ERROR: " . $e->getMessage() . "\n";
    }
}

// Rule 1: Default Guild Master is in initial Central Guild Realm
testRule("Initial Server Association Check", function() {
    $user = User::find(1);
    return $user && $user->server_id !== null;
});

// Rule 2: Server Invite Code Format
testRule("Server HR Invite Code Format (REALM-XXXXX)", function() {
    $server = Server::first();
    return $server && str_starts_with($server->invite_code, 'REALM-');
});

// Rule 3: Resignation Sets server_id = null
testRule("Resignation Flow Sets user.server_id = null", function() {
    // Create temporary test user
    $testUser = User::create([
        'name' => 'Test Resigned Adventurer',
        'email' => 'resign_test_' . time() . '@guildhall.io',
        'password' => bcrypt('password'),
        'server_id' => 1,
    ]);

    Auth::login($testUser);
    $controller = new \App\Http\Controllers\Api\ServerController();
    $res = $controller->resign(request());

    $reloaded = User::find($testUser->id);
    $testUser->delete();

    return $reloaded->server_id === null;
});

// Rule 4: Joining via Valid HR Invite Code
testRule("Join Server via HR Invitation Code", function() {
    $server = Server::first();

    $testUser = User::create([
        'name' => 'Test Join Adventurer',
        'email' => 'join_test_' . time() . '@guildhall.io',
        'password' => bcrypt('password'),
        'server_id' => null, // Unemployed
    ]);

    Auth::login($testUser);
    $request = request();
    $request->merge(['invite_code' => $server->invite_code]);

    $controller = new \App\Http\Controllers\Api\ServerController();
    $res = $controller->join($request);

    $reloaded = User::find($testUser->id);
    $testUser->delete();

    return $reloaded->server_id === $server->id;
});

// Rule 5: 1-Worker 1-Company Constraint Prevents Dual Joining
testRule("1-Account 1-Server Constraint Rejects Dual Join", function() {
    $server = Server::first();

    $testUser = User::create([
        'name' => 'Test Employed Adventurer',
        'email' => 'employed_test_' . time() . '@guildhall.io',
        'password' => bcrypt('password'),
        'server_id' => 1, // Already employed!
    ]);

    Auth::login($testUser);
    $request = request();
    $request->merge(['invite_code' => $server->invite_code]);

    $controller = new \App\Http\Controllers\Api\ServerController();
    $res = $controller->join($request);

    $testUser->delete();
    return $res->getStatusCode() === 400;
});

echo "\n======================================================\n";
echo "    RULES AUDIT SUMMARY: {$passCount}/{$totalCount} RULES PASSED GREEN\n";
echo "======================================================\n";
