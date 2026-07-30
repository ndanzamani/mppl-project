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
        if (!Schema::hasTable('project_attachments')) {
            Schema::create('project_attachments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
                $table->string('file_name');
                $table->string('file_path');
                $table->string('file_type');
                $table->integer('file_size')->default(0);
                $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (!Schema::hasColumn('projects', 'approval_mode')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->enum('approval_mode', ['manual', 'timer_accept', 'vote_based'])->default('manual')->after('status');
                $table->timestamp('timer_expires_at')->nullable()->after('approval_mode');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_attachments');

        if (Schema::hasColumn('projects', 'approval_mode')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropColumn(['approval_mode', 'timer_expires_at']);
            });
        }
    }
};
