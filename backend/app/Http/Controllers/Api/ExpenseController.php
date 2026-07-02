<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\JSendResponse;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $month = $request->query('month');
        $categoryId = $request->query('expense_category_id');

        $expenses = Expense::query()
            ->with('category')
            ->when($month, fn ($query) => $query->whereYear('expense_date', substr($month, 0, 4))->whereMonth('expense_date', substr($month, 5, 2)))
            ->when($categoryId, fn ($query) => $query->where('expense_category_id', $categoryId))
            ->latest()
            ->paginate($perPage);

        return JSendResponse::success([
            'items' => $expenses->items(),
            'pagination' => [
                'current_page' => $expenses->currentPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
                'last_page' => $expenses->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateExpense($request);
        $expense = Expense::create($validated);

        return JSendResponse::success([
            'expense' => $expense->load('category'),
        ], 201);
    }

    public function update(Request $request, string $expense)
    {
        $expense = Expense::query()->findOrFail($expense);
        $validated = $this->validateExpense($request, $expense);

        if (($validated['proof_path'] ?? null) && $expense->proof_path) {
            Storage::disk('public')->delete($expense->proof_path);
        }

        $expense->update($validated);

        return JSendResponse::success([
            'expense' => $expense->load('category'),
        ]);
    }

    private function validateExpense(Request $request, ?Expense $expense = null): array
    {
        $validated = $request->validate([
            'expense_category_id' => ['nullable', 'exists:expense_categories,id'],
            'expense_category_name' => ['nullable', 'string', 'max:255'],
            'expense_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:1'],
            'description' => ['required', 'string'],
            'proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ]);

        if (! empty($validated['expense_category_name'])) {
            $category = ExpenseCategory::firstOrCreate([
                'name' => $validated['expense_category_name'],
            ]);
            $validated['expense_category_id'] = $category->id;
        }

        if ($request->hasFile('proof')) {
            $validated['proof_path'] = $request->file('proof')->store('expense-proofs', 'public');
        }

        unset($validated['expense_category_name'], $validated['proof']);

        return $validated;
    }
}
