<?php

namespace App\Http\Requests\Resident;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateResidentRequest extends FormRequest
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
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'ktp_photo' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'resident_status' => ['sometimes', 'required', 'in:permanent,contract'],
            'phone_number' => ['sometimes', 'required', 'string', 'max:30'],
            'marital_status' => ['sometimes', 'required', 'in:single,married'],
        ];
    }
}
