<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . urlencode($user->name),
                    'status' => $user->status ?? 'online',
                    'xp' => $user->xp ?? 0,
                    'level' => $user->level ?? 1,
                ] : null,
            ],
            'guild' => [
                'name' => 'GuildHall Sanctum',
                'channels' => \Schema::hasTable('channels') ? \DB::table('channels')->select('id', 'name', 'type', 'settings')->get() : [],
                'roles' => \Schema::hasTable('roles') ? \DB::table('roles')->select('id', 'name', 'color', 'hierarchy_level')->get() : [],
            ],
        ];
    }
}
