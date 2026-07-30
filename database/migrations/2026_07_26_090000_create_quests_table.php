<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('quests')) {
            Schema::create('quests', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description');
                $table->integer('reward_xp')->default(100);
                $table->foreignId('posted_by')->constrained('users')->onDelete('cascade');
                $table->foreignId('accepted_by')->nullable()->constrained('users')->onDelete('set null');
                $table->enum('status', ['open', 'claimed', 'in_progress', 'completed', 'expired'])->default('open');
                $table->timestamp('expires_at')->nullable();
                $table->string('estimated_duration')->default('1-2 hours');
                $table->timestamp('completed_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
