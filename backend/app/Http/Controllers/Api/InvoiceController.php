<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\JSendResponse;
use App\Models\FeeType;
use App\Models\HouseOccupancy;
use App\Models\Houses;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->integer('per_page', 10);
        $status = $request->query('status');
        $month = $request->query('month');
        $houseId = $request->query('house_id');
        $residentId = $request->query('resident_id');

        $invoices = Invoice::query()
            ->with(['house', 'resident', 'items.feeType'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($month, fn ($query) => $query->whereDate('period_month', Carbon::parse($month)->startOfMonth()))
            ->when($houseId, fn ($query) => $query->where('house_id', $houseId))
            ->when($residentId, fn ($query) => $query->where('resident_id', $residentId))
            ->latest()
            ->paginate($perPage);

        return JSendResponse::success([
            'items' => $invoices->items(),
            'pagination' => [
                'current_page' => $invoices->currentPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
                'last_page' => $invoices->lastPage(),
            ],
        ]);
    }

    public function generateMonthly(Request $request)
    {
        $validated = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'due_date' => ['nullable', 'date'],
        ]);

        $periodMonth = Carbon::createFromFormat('Y-m', $validated['month'] ?? now()->format('Y-m'))->startOfMonth();
        $dueDate = $validated['due_date'] ?? $periodMonth->copy()->endOfMonth()->toDateString();

        $feeTypes = FeeType::query()
            ->where('is_active', true)
            ->get();

        if ($feeTypes->isEmpty()) {
            $feeTypes = collect([
                FeeType::create(['name' => 'Satpam', 'code' => 'security', 'amount' => 100000, 'is_active' => true]),
                FeeType::create(['name' => 'Kebersihan', 'code' => 'cleaning', 'amount' => 15000, 'is_active' => true]),
            ]);
        }

        $created = [];

        DB::transaction(function () use ($periodMonth, $dueDate, $feeTypes, &$created) {
            $houses = Houses::query()
                ->where('house_status', 'occupied')
                ->with(['occupancies' => fn ($query) => $query->whereNull('end_date')->latest()])
                ->get();

            foreach ($houses as $house) {
                $occupancy = $house->occupancies->first();

                if (! $occupancy) {
                    continue;
                }

                $invoice = Invoice::firstOrCreate(
                    [
                        'house_id' => $house->id,
                        'resident_id' => $occupancy->resident_id,
                        'period_month' => $periodMonth->toDateString(),
                    ],
                    [
                        'house_occupancy_id' => $occupancy->id,
                        'due_date' => $dueDate,
                        'total_amount' => 0,
                        'paid_amount' => 0,
                        'status' => 'unpaid',
                    ],
                );

                if ($invoice->items()->exists()) {
                    continue;
                }

                foreach ($feeTypes as $feeType) {
                    $invoice->items()->create([
                        'fee_type_id' => $feeType->id,
                        'description' => $feeType->name . ' ' . $periodMonth->format('Y-m'),
                        'amount' => $feeType->amount,
                    ]);
                }

                $invoice->update([
                    'total_amount' => $invoice->items()->sum('amount'),
                ]);

                $created[] = $invoice->load(['house', 'resident', 'items.feeType']);
            }
        });

        return JSendResponse::success([
            'created_count' => count($created),
            'items' => $created,
        ], 201);
    }

    public function show(string $invoice)
    {
        $invoice = Invoice::query()
            ->with(['house', 'resident', 'occupancy', 'items.feeType'])
            ->findOrFail($invoice);

        return JSendResponse::success([
            'invoice' => $invoice,
        ]);
    }
}
