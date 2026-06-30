<?php

use App\Http\Controllers\Api\ResidentController;
use Illuminate\Support\Facades\Route;


Route::middleware('throttle:api')->group(function () {
    Route::get('/residents', [ResidentController::class, 'index']);
    Route::post('/residents', [ResidentController::class, 'store']);
});
