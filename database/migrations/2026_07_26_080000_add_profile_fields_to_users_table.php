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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('working'); // working, free, on_vacation, sick, away, do_not_disturb
            }
            if (!Schema::hasColumn('users', 'xp')) {
                $table->integer('xp')->default(100);
            }
            if (!Schema::hasColumn('users', 'level')) {
                $table->integer('level')->default(1);
            }
            if (!Schema::hasColumn('users', 'joined_at')) {
                $table->timestamp('joined_at')->nullable();
            }
            if (!Schema::hasColumn('users', 'rewards')) {
                $table->json('rewards')->nullable();
            }
            if (!Schema::hasColumn('users', 'achievements')) {
                $table->json('achievements')->nullable();
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
