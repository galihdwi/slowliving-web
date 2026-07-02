<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\StoreResidentRequest;
use App\Http\Requests\Resident\UpdateResidentRequest;
use App\Http\Resources\ResidentResource;
use App\Http\Responses\JSendResponse;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');
        $status = $request->query('status', '');

        $query = Resident::query();

        if ($search) {
            $query->where('full_name', 'like', "%{$search}%");
            $query->orWhere('phone_number', 'like', "%{$search}%");
        }

        if ($status) {
            $query->where('resident_status', $status);
        }

        $residents = $query->latest()->paginate($perPage);

        return JSendResponse::success([
            'items' => $residents->items(),
            'pagination' => [
                'current_page' => $residents->currentPage(),
                'per_page' => $residents->perPage(),
                'total' => $residents->total(),
                'last_page' => $residents->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResidentRequest $request)
    {
        $validatedData = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            $validatedData['ktp_photo_path'] = $request
                ->file('ktp_photo')
                ->store('ktp_photos', 'public');
        }

        unset($validatedData['ktp_photo']);

        $resident = Resident::create($validatedData);

        return JSendResponse::success([
            'resident' => new ResidentResource($resident),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $resident = Resident::findOrFail($id);

        return JSendResponse::success([
            'resident' => new ResidentResource($resident),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResidentRequest $request, string $id)
    {
        $resident = Resident::findOrFail($id);
        $validatedData = $request->validated();

        if ($request->hasFile('ktp_photo')) {
            // Delete the old photo if it exists
            if ($resident->ktp_photo_path) {
                Storage::disk('public')->delete($resident->ktp_photo_path);
            }

            $validatedData['ktp_photo_path'] = $request
                ->file('ktp_photo')
                ->store('ktp_photos', 'public');
        }

        unset($validatedData['ktp_photo']);

        $resident->update($validatedData);

        return JSendResponse::success([
            'resident' => new ResidentResource($resident),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
