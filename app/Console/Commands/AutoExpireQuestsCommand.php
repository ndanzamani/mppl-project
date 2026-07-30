<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Quest;

class AutoExpireQuestsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'quests:auto-expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto-expire quests where expires_at < now() and status is open';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Evaluating expired quests...');

        $expiredCount = Quest::where('status', 'open')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);

        $this->info("Updated {$expiredCount} quests to expired.");

        return Command::SUCCESS;
    }
}
