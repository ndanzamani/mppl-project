<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status', // backlog, in_progress, in_review, approved, rejected
        'approval_mode', // manual, timer_accept, vote_based
        'timer_expires_at',
        'submitted_by',
        'assigned_to',
        'submission_notes',
        'deadline',
        'votes_for',
        'votes_against',
        'auto_decide_at',
        'live_url',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'timer_expires_at' => 'datetime',
        'auto_decide_at' => 'datetime',
        'votes_for' => 'integer',
        'votes_against' => 'integer',
    ];

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function votes()
    {
        return $this->hasMany(ProjectVote::class);
    }

    public function comments()
    {
        return $this->hasMany(ProjectComment::class);
    }

    public function attachments()
    {
        return $this->hasMany(ProjectAttachment::class);
    }
}
