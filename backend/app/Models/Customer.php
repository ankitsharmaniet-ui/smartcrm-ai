<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    
    protected $fillable = [
        'organization_id',
        'assigned_to',
        'first_name',
        'last_name',
        'company',
        'email',
        'phone',
        'website',
        'address',
        'status',
        'notes',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . ($this->last_name ?? ''));
    }
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
    
}
