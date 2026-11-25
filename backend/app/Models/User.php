<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Available user roles
    public const ROLE_OWNER = 'owner';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_MANAGER = 'manager';
    public const ROLE_SALES_REP = 'sales_rep';

    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Organization relationship
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    // Check user role
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // Check whether user is owner or admin
    public function isAdmin(): bool
    {
        return in_array($this->role, [
            self::ROLE_OWNER,
            self::ROLE_ADMIN,
        ], true);
    }

    // Check whether user can manage team
    public function canManageTeam(): bool
    {
        return in_array($this->role, [
            self::ROLE_OWNER,
            self::ROLE_ADMIN,
            self::ROLE_MANAGER,
        ], true);
    }

    public function assignedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'assigned_to');
    }

    public function assignedCustomers(): HasMany
    {
        return $this->hasMany(Customer::class, 'assigned_to');
    }

    public function assignedContacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'assigned_to');
    }
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'created_by');
    }
    public function createdActivities(): HasMany
    {
        return $this->hasMany(Activity::class, 'created_by');
    }
}
