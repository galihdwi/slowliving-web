<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\JSendResponse;
use App\Models\Expense;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function monthlySummary(Request $request)
    {
        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        $year = (int) ($validated['year'] ?? now()->year);
        $items = [];
        $runningBalance = 0;

        for ($month = 1; $month <= 12; $month++) {
            $income = (float) Payment::query()
                ->whereYear('payment_date', $year)
                ->whereMonth('payment_date', $month)
                ->sum('amount');

            $expense = (float) Expense::query()
                ->whereYear('expense_date', $year)
                ->whereMonth('expense_date', $month)
                ->sum('amount');

            $balance = $income - $expense;
            $runningBalance += $balance;

            $items[] = [
                'month' => Carbon::create($year, $month)->format('Y-m'),
                'income' => $income,
                'expense' => $expense,
                'balance' => $balance,
                'running_balance' => $runningBalance,
            ];
        }

        return JSendResponse::success([
            'year' => $year,
            'items' => $items,
            'ending_balance' => $runningBalance,
        ]);
    }

    public function monthlyDetail(Request $request)
    {
        $validated = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ]);

        $month = Carbon::createFromFormat('Y-m', $validated['month']);

        $payments = Payment::query()
            ->with(['house', 'resident'])
            ->whereYear('payment_date', $month->year)
            ->whereMonth('payment_date', $month->month)
            ->latest()
            ->get();

        $expenses = Expense::query()
            ->with('category')
            ->whereYear('expense_date', $month->year)
            ->whereMonth('expense_date', $month->month)
            ->latest()
            ->get();

        $incomeTotal = (float) $payments->sum('amount');
        $expenseTotal = (float) $expenses->sum('amount');

        return JSendResponse::success([
            'month' => $validated['month'],
            'income_total' => $incomeTotal,
            'expense_total' => $expenseTotal,
            'balance' => $incomeTotal - $expenseTotal,
            'payments' => $payments,
            'expenses' => $expenses,
        ]);
    }
}
