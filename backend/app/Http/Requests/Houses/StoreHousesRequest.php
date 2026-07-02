<?php

namespace App\Http\Requests\Houses;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreHousesRequest extends FormRequest
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
        return [
            'house_number' => ['required', 'string', 'max:255', 'unique:houses,house_number'],
            'address' => ['nullable', 'string'],
            'house_status' => ['required', 'in:vacant,occupied'],
        ];
    }
}
