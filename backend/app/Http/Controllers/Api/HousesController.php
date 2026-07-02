<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Houses\StoreHousesRequest;
use App\Http\Requests\Houses\UpdateHousesRequest;
use App\Http\Resources\HousesResource;
use App\Http\Responses\JSendResponse;
use App\Models\HouseOccupancy;
use App\Models\Houses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HousesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');
        $status = $request->query('status', '');

        $query = Houses::query();

        if ($search) {
            $query->where('house_number', 'like', "%{$search}%");
            $query->orWhere('address', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('house_status', $status);
        }

        $houses = $query->latest()->paginate($perPage);

        return JSendResponse::success([
            'items' => $houses->items(),
            'pagination' => [
                'current_page' => $houses->currentPage(),
                'per_page' => $houses->perPage(),
                'total' => $houses->total(),
                'last_page' => $houses->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHousesRequest $request)
    {
        $validatedData = $request->validated();

        $house = Houses::create($validatedData);

        return JSendResponse::success([
            'houses' => new HousesResource($house),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $house = Houses::query()
            ->with(['occupancies.resident', 'invoices.items', 'invoices.resident'])
            ->findOrFail($id);

        return JSendResponse::success([
            'houses' => new HousesResource($house),
            'occupancy_history' => $house->occupancies,
            'payment_history' => $house->invoices,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHousesRequest $request, string $id)
    {
        $updateHouse = Houses::findOrFail($id);
        $validatedData = $request->validated();

        $updateHouse->update($validatedData);

        return JSendResponse::success([
            'houses' => new HousesResource($updateHouse),
        ]);
    }

    public function storeOccupancy(Request $request, string $id)
    {
        $validated = $request->validate([
            'resident_id' => ['required', 'exists:residents,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'notes' => ['nullable', 'string'],
        ]);

        $house = Houses::findOrFail($id);

        $occupancy = DB::transaction(function () use ($house, $validated) {
            HouseOccupancy::query()
                ->where('house_id', $house->id)
                ->whereNull('end_date')
                ->update(['end_date' => $validated['start_date']]);

            $occupancy = $house->occupancies()->create($validated);
            $house->update(['house_status' => 'occupied']);

            return $occupancy->load(['house', 'resident']);
        });

        return JSendResponse::success([
            'occupancy' => $occupancy,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
