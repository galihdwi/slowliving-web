<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\JSendResponse;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $month = $request->query('month');
        $houseId = $request->query('house_id');
        $residentId = $request->query('resident_id');

        $payments = Payment::query()
            ->with(['house', 'resident', 'allocations.invoiceItem'])
            ->when($month, fn ($query) => $query->whereYear('payment_date', substr($month, 0, 4))->whereMonth('payment_date', substr($month, 5, 2)))
            ->when($houseId, fn ($query) => $query->where('house_id', $houseId))
            ->when($residentId, fn ($query) => $query->where('resident_id', $residentId))
            ->latest()
            ->paginate($perPage);

        return JSendResponse::success([
            'items' => $payments->items(),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
                'last_page' => $payments->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => ['required', 'exists:residents,id'],
            'house_id' => ['required', 'exists:houses,id'],
            'payment_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'allocations' => ['nullable', 'array'],
            'allocations.*.invoice_item_id' => ['required_with:allocations', 'exists:invoice_items,id'],
            'allocations.*.amount' => ['required_with:allocations', 'numeric', 'min:1'],
        ]);

        $payment = DB::transaction(function () use ($validated) {
            $allocations = $validated['allocations'] ?? [];
            unset($validated['allocations']);

            $payment = Payment::create($validated);

            foreach ($allocations as $allocation) {
                $payment->allocations()->create($allocation);
                $this->refreshInvoiceStatusByItem($allocation['invoice_item_id']);
            }

            return $payment->load(['house', 'resident', 'allocations.invoiceItem']);
        });

        return JSendResponse::success([
            'payment' => $payment,
        ], 201);
    }

    private function refreshInvoiceStatusByItem(int $invoiceItemId): void
    {
        $item = InvoiceItem::query()->find($invoiceItemId);

        if (! $item) {
            return;
        }

        $invoice = Invoice::query()->with('items.allocations')->find($item->invoice_id);
        $paidAmount = $invoice->items->flatMap->allocations->sum('amount');
        $status = 'unpaid';

        if ($paidAmount >= $invoice->total_amount) {
            $status = 'paid';
        } elseif ($paidAmount > 0) {
            $status = 'partial';
        }

        $invoice->update([
            'paid_amount' => $paidAmount,
            'status' => $status,
        ]);
    }
}
