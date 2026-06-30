<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class JSendResponse extends JsonResponse
{
    public static function success(mixed $data = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ], $code);
    }

    public static function fail(mixed $data = null, int $code = 400): JsonResponse
    {
        return response()->json([
            'status' => 'fail',
            'data' => $data,
        ], $code);
    }

    public static function error(string $message, mixed $data = null, int $code = 500): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
}
