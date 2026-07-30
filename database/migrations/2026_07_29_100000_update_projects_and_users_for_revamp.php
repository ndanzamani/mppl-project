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
        if (!Schema::hasColumn('users', 'google_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('google_id')->nullable()->after('email');
            });
        }

        if (!Schema::hasColumn('projects', 'assigned_to')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->foreignId('assigned_to')->nullable()->after('submitted_by')->constrained('users')->nullOnDelete();
                $table->text('submission_notes')->nullable()->after('description');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('users', 'google_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('google_id');
            });
        }

        if (Schema::hasColumn('projects', 'assigned_to')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropForeign(['assigned_to']);
                $table->dropColumn(['assigned_to', 'submission_notes']);
            });
        }
    }
};
