<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoiceParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel_id',
        'user_id',
        'seat_number',
        'is_muted',
        'is_deafened',
        'hand_raised_at',
        'is_presenting',
    ];

    protected $casts = [
        'is_muted' => 'boolean',
        'is_deafened' => 'boolean',
        'is_presenting' => 'boolean',
        'hand_raised_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class);
    }
}
