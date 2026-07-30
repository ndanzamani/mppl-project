<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            if (!Schema::hasColumn('quests', 'reward_xp')) {
                $table->integer('reward_xp')->default(100);
            }
            if (!Schema::hasColumn('quests', 'posted_by')) {
                $table->foreignId('posted_by')->nullable()->constrained('users')->onDelete('cascade');
            }
            if (!Schema::hasColumn('quests', 'accepted_by')) {
                $table->foreignId('accepted_by')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('quests', 'status')) {
                $table->string('status')->default('open');
            }
            if (!Schema::hasColumn('quests', 'expires_at')) {
                $table->timestamp('expires_at')->nullable();
            }
            if (!Schema::hasColumn('quests', 'estimated_duration')) {
                $table->string('estimated_duration')->default('1-2 hours');
            }
            if (!Schema::hasColumn('quests', 'completed_at')) {
                $table->timestamp('completed_at')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
