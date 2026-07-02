<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Houses extends Model
{
    protected $table = 'houses';

    protected $fillable = [
        'house_number',
        'address',
        'house_status',
    ];

    public function occupancies(): HasMany
    {
        return $this->hasMany(HouseOccupancy::class, 'house_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'house_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'house_id');
    }
}
