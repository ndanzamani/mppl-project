<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect user to Google OAuth consent screen.
     */
    public function redirect()
    {
        // Fallback for development if Socialite keys not configured
        if (!config('services.google.client_id')) {
            // Demo Google user simulation for testing
            $demoUser = User::firstOrCreate(
                ['email' => 'google_adventurer@gmail.com'],
                [
                    'name' => 'Google Adventurer',
                    'password' => bcrypt(Str::random(16)),
                    'google_id' => '1234567890',
                    'avatar' => 'https://api.dicebear.com/7.x/bottts/svg?seed=GoogleAdventurer',
                    'status' => 'working',
                    'xp' => 100,
                    'level' => 1,
                ]
            );

            Auth::login($demoUser);
            return redirect()->intended('/dashboard');
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Google Adventurer',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar() ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=' . Str::random(8),
                    'password' => bcrypt(Str::random(16)),
                    'status' => 'working',
                    'xp' => 100,
                    'level' => 1,
                ]);
            } else if (!$user->google_id) {
                $user->google_id = $googleUser->getId();
                $user->save();
            }

            Auth::login($user);
            return redirect()->intended('/dashboard');
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['email' => 'Google Sign-In failed: ' . $e->getMessage()]);
        }
    }
}
