<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Server extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'owner_id',
        'invite_code',
    ];

    /**
     * Generate unique 8-character HR invitation code (e.g., REALM-8X92K).
     */
    public static function generateInviteCode(): string
    {
        do {
            $code = 'REALM-' . strtoupper(Str::random(6));
        } while (static::where('invite_code', $code)->exists());

        return $code;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members()
    {
        return $this->hasMany(User::class, 'server_id');
    }

    public function channels()
    {
        return $this->hasMany(Channel::class, 'server_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'server_id');
    }

    public function quests()
    {
        return $this->hasMany(Quest::class, 'server_id');
    }
}
