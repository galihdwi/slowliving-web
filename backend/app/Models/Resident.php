<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'full_name',
        'ktp_photo_path',
        'resident_status',
        'phone_number',
        'marital_status',
    ];
}
