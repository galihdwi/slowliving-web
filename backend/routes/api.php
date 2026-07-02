<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\HousesController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ResidentController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->post('/auth/login', [AuthController::class, 'login']);

Route::middleware(['auth.api', 'throttle:api'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Resident Routes
    Route::get('/residents', [ResidentController::class, 'index']);
    Route::post('/residents', [ResidentController::class, 'store']);
    Route::get('/residents/{resident}', [ResidentController::class, 'show']);
    Route::put('/residents/{resident}', [ResidentController::class, 'update']);

    // House Routes
    Route::get('/houses', [HousesController::class, 'index']);
    Route::post('/houses', [HousesController::class, 'store']);
    Route::get('/houses/{house}', [HousesController::class, 'show']);
    Route::put('/houses/{house}', [HousesController::class, 'update']);
    Route::post('/houses/{house}/occupancies', [HousesController::class, 'storeOccupancy']);

    // Invoice Routes
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices/generate-monthly', [InvoiceController::class, 'generateMonthly']);
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);

    // Payment Routes
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // Expense Routes
    Route::get('/expenses', [ExpenseController::class, 'index']);
    Route::post('/expenses', [ExpenseController::class, 'store']);
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update']);

    // Report Routes
    Route::get('/reports/monthly-summary', [ReportController::class, 'monthlySummary']);
    Route::get('/reports/monthly-detail', [ReportController::class, 'monthlyDetail']);
});
