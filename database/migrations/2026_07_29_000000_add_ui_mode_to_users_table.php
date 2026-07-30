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
        if (!Schema::hasColumn('users', 'ui_mode')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('ui_mode', ['rpg', 'corporate'])->default('rpg')->after('theme');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'ui_mode')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('ui_mode');
            });
        }
    }
};
