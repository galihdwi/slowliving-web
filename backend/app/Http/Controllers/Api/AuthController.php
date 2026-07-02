<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\JSendResponse;
use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return JSendResponse::fail([
                'message' => 'Email atau password salah.',
            ], 401);
        }

        $plainToken = Str::random(60);

        ApiToken::create([
            'user_id' => $user->id,
            'name' => 'api-token',
            'token' => hash('sha256', $plainToken),
        ]);

        return JSendResponse::success([
            'token_type' => 'Bearer',
            'access_token' => $plainToken,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->attributes->get('api_token');

        if ($token) {
            $token->delete();
        }

        return JSendResponse::success([
            'message' => 'Logout berhasil.',
        ]);
    }

    public function me(Request $request)
    {
        return JSendResponse::success([
            'user' => $request->user(),
        ]);
    }
}
