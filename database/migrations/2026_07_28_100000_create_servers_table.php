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
        if (!Schema::hasTable('servers')) {
            Schema::create('servers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('icon')->nullable();
                $table->text('description')->nullable();
                $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
                $table->string('invite_code', 16)->unique();
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('users', 'server_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('server_id')->nullable()->after('id')->constrained('servers')->onDelete('set null');
            });
        }

        if (!Schema::hasColumn('channels', 'server_id')) {
            Schema::table('channels', function (Blueprint $table) {
                $table->foreignId('server_id')->nullable()->after('id')->constrained('servers')->onDelete('cascade');
            });
        }

        if (!Schema::hasColumn('projects', 'server_id')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->foreignId('server_id')->nullable()->after('id')->constrained('servers')->onDelete('cascade');
            });
        }

        if (!Schema::hasColumn('quests', 'server_id')) {
            Schema::table('quests', function (Blueprint $table) {
                $table->foreignId('server_id')->nullable()->after('id')->constrained('servers')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quests', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropColumn('server_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropColumn('server_id');
        });

        Schema::table('channels', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropColumn('server_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropColumn('server_id');
        });

        Schema::dropIfExists('servers');
    }
};
