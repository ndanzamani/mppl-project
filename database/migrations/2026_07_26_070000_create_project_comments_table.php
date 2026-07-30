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
        // 1. Add extra tracking columns to projects table
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'votes_for')) {
                $table->integer('votes_for')->default(0);
            }
            if (!Schema::hasColumn('projects', 'votes_against')) {
                $table->integer('votes_against')->default(0);
            }
            if (!Schema::hasColumn('projects', 'auto_decide_at')) {
                $table->timestamp('auto_decide_at')->nullable();
            }
            if (!Schema::hasColumn('projects', 'live_url')) {
                $table->string('live_url')->nullable();
            }
        });

        // 2. Project Comments table
        if (!Schema::hasTable('project_comments')) {
            Schema::create('project_comments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->text('content');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_comments');
    }
};
