<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseOccupancy extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'start_date',
        'end_date',
        'notes',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(Houses::class, 'house_id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }
}
