<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class IncrementDaysEmployedCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:increment-days';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto-increment and sync days employed based on user joined_at timestamp';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Syncing days employed for all guild members...');

        $users = User::all();
        $updated = 0;

        foreach ($users as $user) {
            if (!$user->joined_at) {
                $user->joined_at = now()->subDays(30);
            }
            $days = Carbon::parse($user->joined_at)->diffInDays(now());
            $user->save();
            $updated++;
        }

        $this->info("Days employed synced for {$updated} users.");
        return Command::SUCCESS;
    }
}
