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
        Schema::table('messages', function (Blueprint $table) {
            $table->index('channel_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('quests', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['channel_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('quests', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
