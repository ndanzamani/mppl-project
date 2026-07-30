<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Project;
use App\Models\User;

class AutoDecideProjectsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'projects:auto-decide';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically evaluate pending project submissions past auto_decide_at based on community votes ratio';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Evaluating pending project submission votes...');

        $projects = Project::whereIn('status', ['submitted', 'in_review', 'backlog', 'in_progress'])
            ->whereNotNull('auto_decide_at')
            ->where('auto_decide_at', '<', now())
            ->get();

        $processedCount = 0;

        foreach ($projects as $project) {
            $totalVotes = $project->votes_for + $project->votes_against;

            if ($totalVotes > 0) {
                $forRatio = $project->votes_for / $totalVotes;
                $againstRatio = $project->votes_against / $totalVotes;

                if ($forRatio >= 0.70) {
                    $project->status = 'approved';
                    $project->save();

                    // Award submitter +150 XP on approval
                    $submitter = User::find($project->submitted_by);
                    if ($submitter) {
                        $submitter->xp = ($submitter->xp ?? 0) + 150;
                        $submitter->save();
                    }

                    $this->info("Project #{$project->id} '{$project->name}' AUTO-APPROVED! (+150 XP awarded to {$submitter->name})");
                    $processedCount++;
                } elseif ($againstRatio >= 0.50) {
                    $project->status = 'rejected';
                    $project->save();

                    $this->info("Project #{$project->id} '{$project->name}' AUTO-REJECTED due to negative vote ratio.");
                    $processedCount++;
                }
            }
        }

        $this->info("Auto-decision evaluation completed. Total updated: {$processedCount}");
        return Command::SUCCESS;
    }
}
