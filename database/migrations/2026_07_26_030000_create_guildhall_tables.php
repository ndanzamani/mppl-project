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
        // 1. Channels table
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['text', 'voice', 'tavern'])->default('text');
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // 2. Channel Permissions table
        Schema::create('channel_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('channel_id')->constrained('channels')->cascadeOnDelete();
            $table->json('permissions')->nullable();
            $table->timestamps();
        });

        // 3. Messages table
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->constrained('channels')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->string('type')->default('text');
            $table->timestamps();
        });

        // 4. Projects table
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('backlog'); // backlog, todo, in_progress, review, done
            $table->foreignId('submitted_by')->constrained('users')->cascadeOnDelete();
            $table->dateTime('deadline')->nullable();
            $table->timestamps();
        });

        // 5. Project Votes table
        Schema::create('project_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->smallInteger('vote')->default(1); // 1 = upvote, -1 = downvote
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // 6. Quests table
        Schema::create('quests', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('reward_xp')->default(100);
            $table->dateTime('expires_at')->nullable();
            $table->foreignId('posted_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('accepted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 7. Employee Statuses table
        Schema::create('employee_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('available'); // available, busy, in_meeting, gaming, offline
            $table->timestamp('updated_at')->useCurrent();
        });

        // 8. Presentations table
        Schema::create('presentations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->nullable()->constrained('channels')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->json('content')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentations');
        Schema::dropIfExists('employee_statuses');
        Schema::dropIfExists('quests');
        Schema::dropIfExists('project_votes');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('channel_permissions');
        Schema::dropIfExists('channels');
    }
};
