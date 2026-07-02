<?php

namespace App\Http\Requests\Houses;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHousesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $houseId = $this->route('house') ?? $this->route('id');

        return [
            'house_number' => ['required', 'string', 'max:255', Rule::unique('houses', 'house_number')->ignore($houseId)],
            'address' => ['nullable', 'string'],
            'house_status' => ['required', 'in:vacant,occupied'],
        ];
    }
}
