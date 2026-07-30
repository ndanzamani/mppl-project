<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'reward_xp',
        'posted_by',
        'accepted_by',
        'status',
        'expires_at',
        'estimated_duration',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'completed_at' => 'datetime',
            'reward_xp' => 'integer',
        ];
    }

    public function poster()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    public function claimer()
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }
}
