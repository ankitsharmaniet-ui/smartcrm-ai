<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'email',
        'phone',
        'website',
        'address',
        'status',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    // Get organization owner
    public function owner()
    {
        return $this->hasOne(User::class)
            ->where('role', User::ROLE_OWNER);
    }

    // Get organization admins
    public function admins(): HasMany
    {
        return $this->hasMany(User::class)
            ->where('role', User::ROLE_ADMIN);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }
    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
}
