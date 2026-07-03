<?php

use App\Http\Responses\JSendResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return JSendResponse::success([
        'message' => 'Admin Iuran RT API is running.',
        'service' => 'admin-iuran-rt-api',
        'version' => '1.0.0',
    ]);
});
