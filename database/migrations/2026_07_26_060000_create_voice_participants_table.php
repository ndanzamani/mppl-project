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
        if (!Schema::hasTable('voice_participants')) {
            Schema::create('voice_participants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('channel_id')->constrained('channels')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->integer('seat_number')->default(1);
                $table->boolean('is_muted')->default(false);
                $table->boolean('is_deafened')->default(false);
                $table->timestamp('hand_raised_at')->nullable();
                $table->boolean('is_presenting')->default(false);
                $table->timestamps();

                $table->unique(['channel_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voice_participants');
    }
};
