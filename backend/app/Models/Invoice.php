<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'house_occupancy_id',
        'period_month',
        'due_date',
        'total_amount',
        'paid_amount',
        'status',
    ];

    public function house(): BelongsTo
    {
        return $this->belongsTo(Houses::class, 'house_id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function occupancy(): BelongsTo
    {
        return $this->belongsTo(HouseOccupancy::class, 'house_occupancy_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
