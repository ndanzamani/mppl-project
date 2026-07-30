<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of all roles with members and permission details.
     */
    public function index()
    {
        $roles = Role::orderBy('hierarchy_level', 'desc')->get()->map(function ($role) {
            $members = User::role($role->name)->select('id', 'name', 'email', 'avatar', 'status', 'xp', 'level')->get();
            $permissionNames = $role->permissions()->pluck('name')->toArray();

            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'color' => $role->color ?? '#6366F1',
                'hierarchy_level' => (int) $role->hierarchy_level,
                'icon' => $role->icon ?? 'Shield',
                'permissions' => $permissionNames,
                'members_count' => $members->count(),
                'members' => $members,
            ];
        });

        return response()->json($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'color' => 'required|string|max:20',
            'hierarchy_level' => 'required|integer|min:0|max:100',
            'icon' => 'required|string|max:50',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
            'color' => $validated['color'],
            'hierarchy_level' => $validated['hierarchy_level'],
            'icon' => $validated['icon'],
        ]);

        if (!empty($validated['permissions'])) {
            foreach ($validated['permissions'] as $permName) {
                Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
            }
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Role created successfully',
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'color' => $role->color,
                'hierarchy_level' => (int) $role->hierarchy_level,
                'icon' => $role->icon,
                'permissions' => $role->permissions()->pluck('name')->toArray(),
                'members_count' => 0,
                'members' => [],
            ],
        ], 201);
    }

    /**
     * Update specified role permissions and metadata.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:roles,name,' . $id,
            'color' => 'sometimes|string|max:20',
            'hierarchy_level' => 'sometimes|integer|min:0|max:100',
            'icon' => 'sometimes|string|max:50',
            'permissions' => 'sometimes|array',
        ]);

        if (isset($validated['name'])) $role->name = $validated['name'];
        if (isset($validated['color'])) $role->color = $validated['color'];
        if (isset($validated['hierarchy_level'])) $role->hierarchy_level = $validated['hierarchy_level'];
        if (isset($validated['icon'])) $role->icon = $validated['icon'];

        $role->save();

        if (isset($validated['permissions'])) {
            foreach ($validated['permissions'] as $permName) {
                Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
            }
            $role->syncPermissions($validated['permissions']);
        }

        $members = User::role($role->name)->select('id', 'name', 'email', 'avatar', 'status', 'xp', 'level')->get();

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'color' => $role->color,
                'hierarchy_level' => (int) $role->hierarchy_level,
                'icon' => $role->icon,
                'permissions' => $role->permissions()->pluck('name')->toArray(),
                'members_count' => $members->count(),
                'members' => $members,
            ],
        ]);
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'Guild Master') {
            return response()->json(['error' => 'Cannot delete the Guild Master owner role.'], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        // Sync role via Spatie
        $user->syncRoles([$role->name]);

        return response()->json([
            'message' => "Assigned role {$role->name} to user {$user->name}",
            'user' => $user->load('roles'),
        ]);
    }
}
