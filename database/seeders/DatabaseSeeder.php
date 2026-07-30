<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Server;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Spatie Permissions
        $permissions = [
            'create_channels',
            'delete_channels',
            'kick_members',
            'promote_members',
            'manage_quests',
            'approve_projects',
        ];

        foreach ($permissions as $permName) {
            Permission::firstOrCreate([
                'name' => $permName,
                'guard_name' => 'web',
            ]);
        }

        // 2. Clear existing table data cleanly
        $isSqlite = DB::getDriverName() === 'sqlite';
        DB::statement($isSqlite ? 'PRAGMA foreign_keys = OFF;' : 'SET FOREIGN_KEY_CHECKS=0;');
        DB::table('role_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('role_user')->truncate();
        DB::table('messages')->truncate();
        DB::table('channels')->truncate();
        DB::table('projects')->truncate();
        DB::table('quests')->truncate();
        DB::table('servers')->truncate();
        DB::table('roles')->truncate();
        DB::table('users')->truncate();
        DB::statement($isSqlite ? 'PRAGMA foreign_keys = ON;' : 'SET FOREIGN_KEY_CHECKS=1;');

        // 3. Define 5 Default Roles
        $rolesData = [
            [
                'name' => 'Guild Master',
                'guard_name' => 'web',
                'color' => '#EAB308', // Gold
                'hierarchy_level' => 100,
                'icon' => 'Crown',
                'permissions' => ['create_channels', 'delete_channels', 'kick_members', 'promote_members', 'manage_quests', 'approve_projects'],
            ],
            [
                'name' => 'Project Manager',
                'guard_name' => 'web',
                'color' => '#8B5CF6', // Purple
                'hierarchy_level' => 80,
                'icon' => 'ShieldCheck',
                'permissions' => ['approve_projects', 'manage_quests', 'create_channels', 'promote_members'],
            ],
            [
                'name' => 'Senior Developer',
                'guard_name' => 'web',
                'color' => '#3B82F6', // Blue
                'hierarchy_level' => 60,
                'icon' => 'Code2',
                'permissions' => ['create_channels', 'manage_quests', 'promote_members'],
            ],
            [
                'name' => 'Developer',
                'guard_name' => 'web',
                'color' => '#10B981', // Emerald
                'hierarchy_level' => 40,
                'icon' => 'Terminal',
                'permissions' => ['create_channels'],
            ],
            [
                'name' => 'Intern',
                'guard_name' => 'web',
                'color' => '#6B7280', // Gray
                'hierarchy_level' => 20,
                'icon' => 'Feather',
                'permissions' => [],
            ],
        ];

        $roleModels = [];
        foreach ($rolesData as $r) {
            $role = Role::create([
                'name' => $r['name'],
                'guard_name' => $r['guard_name'],
                'color' => $r['color'],
                'hierarchy_level' => $r['hierarchy_level'],
                'icon' => $r['icon'],
            ]);

            if (!empty($r['permissions'])) {
                $role->syncPermissions($r['permissions']);
            }
            $roleModels[$r['name']] = $role;
        }

        // 4. Create Initial Guild Master User first so server owner foreign key is satisfied
        $gmUser = User::create([
            'name' => 'Guild Master User',
            'email' => 'admin@guildhall.io',
            'password' => Hash::make('password'),
            'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=GuildMaster',
            'status' => 'online',
            'xp' => 3500,
            'level' => 10,
        ]);
        $gmUser->assignRole($roleModels['Guild Master']);

        // 5. Create Initial Server "Central Guild Realm" (owner = Guild Master User)
        $server = Server::create([
            'name' => 'Central Guild Realm',
            'slug' => 'central-guild-realm',
            'icon' => 'https://api.dicebear.com/7.x/bottts/svg?seed=CentralGuild',
            'description' => 'Official GuildHall Central Headquarters Realm',
            'owner_id' => $gmUser->id,
            'invite_code' => 'REALM-MAIN01',
        ]);

        $gmUser->server_id = $server->id;
        $gmUser->save();

        // 6. Create 11 Additional Test Users across all role tiers
        $usersData = [
            [
                'name' => 'Arthur Vance',
                'email' => 'arthur@guildhall.io',
                'role' => 'Project Manager',
                'status' => 'online',
                'xp' => 2400,
                'level' => 7,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Arthur',
            ],
            [
                'name' => 'Elena Rostova',
                'email' => 'elena@guildhall.io',
                'role' => 'Project Manager',
                'status' => 'busy',
                'xp' => 2100,
                'level' => 6,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
            ],
            [
                'name' => 'Cedric Storm',
                'email' => 'cedric@guildhall.io',
                'role' => 'Senior Developer',
                'status' => 'online',
                'xp' => 1800,
                'level' => 5,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Cedric',
            ],
            [
                'name' => 'Morgana Pendelton',
                'email' => 'morgana@guildhall.io',
                'role' => 'Senior Developer',
                'status' => 'dungeon',
                'xp' => 1650,
                'level' => 5,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Morgana',
            ],
            [
                'name' => 'Lucas Finch',
                'email' => 'lucas@guildhall.io',
                'role' => 'Developer',
                'status' => 'online',
                'xp' => 1200,
                'level' => 4,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas',
            ],
            [
                'name' => 'Sora Takahashi',
                'email' => 'sora@guildhall.io',
                'role' => 'Developer',
                'status' => 'online',
                'xp' => 950,
                'level' => 3,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Sora',
            ],
            [
                'name' => 'Nadia Rayne',
                'email' => 'nadia@guildhall.io',
                'role' => 'Developer',
                'status' => 'offline',
                'xp' => 800,
                'level' => 3,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadia',
            ],
            [
                'name' => 'Kaelen Voss',
                'email' => 'kaelen@guildhall.io',
                'role' => 'Intern',
                'status' => 'online',
                'xp' => 300,
                'level' => 1,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Kaelen',
            ],
            [
                'name' => 'Lyra Nightingale',
                'email' => 'lyra@guildhall.io',
                'role' => 'Intern',
                'status' => 'online',
                'xp' => 150,
                'level' => 1,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Lyra',
            ],
            [
                'name' => 'Bram Thorne',
                'email' => 'bram@guildhall.io',
                'role' => 'Intern',
                'status' => 'online',
                'xp' => 120,
                'level' => 1,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Bram',
            ],
            [
                'name' => 'Freya Lind',
                'email' => 'freya@guildhall.io',
                'role' => 'Intern',
                'status' => 'busy',
                'xp' => 100,
                'level' => 1,
                'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=Freya',
            ],
        ];

        foreach ($usersData as $uData) {
            $user = User::create([
                'server_id' => $server->id,
                'name' => $uData['name'],
                'email' => $uData['email'],
                'password' => Hash::make('password'),
                'avatar' => $uData['avatar'],
                'status' => $uData['status'],
                'xp' => $uData['xp'],
                'level' => $uData['level'],
            ]);

            $roleModel = $roleModels[$uData['role']];
            $user->assignRole($roleModel);

            DB::table('role_user')->insert([
                'role_id' => $roleModel->id,
                'user_id' => $user->id,
                'metadata' => json_encode(['assigned_at' => now()->toDateTimeString()]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 7. Seed Channels & Messages & Projects & Quests
        $general = DB::table('channels')->insertGetId([
            'server_id' => $server->id,
            'name' => 'general-hall',
            'type' => 'text',
            'owner_id' => $gmUser->id,
            'settings' => json_encode(['topic' => 'Main guild lounge for general discussion']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('channels')->insert([
            'server_id' => $server->id,
            'name' => 'voice-tavern',
            'type' => 'voice',
            'owner_id' => $gmUser->id,
            'settings' => json_encode(['bitrate' => 64000]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('messages')->insert([
            'channel_id' => $general,
            'user_id' => $gmUser->id,
            'content' => 'Welcome to GuildHall! Prepare your equipment and claim your quests.',
            'type' => 'text',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('projects')->insert([
            'server_id' => $server->id,
            'name' => 'GuildHall Core v1.0',
            'description' => 'Build employee management system with Discord, Trello, and RPG features.',
            'status' => 'in_progress',
            'submitted_by' => $gmUser->id,
            'deadline' => now()->addDays(14),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('quests')->insert([
            'server_id' => $server->id,
            'title' => 'Refactor Authentication Sanctum Realm',
            'description' => 'Ensure Sanctum tokens and Inertia state sync flawlessly across the realm.',
            'reward_xp' => 350,
            'expires_at' => now()->addDays(7),
            'posted_by' => $gmUser->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
