<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = config('cors.allowed_origins', []);

        $origin = $request->headers->get('Origin');
        $allowedOrigin = in_array($origin, $allowedOrigins, true)
            ? $origin
            : ($allowedOrigins[0] ?? '*');

        if ($request->isMethod('OPTIONS')) {
            return response('', 204)->withHeaders($this->headers($allowedOrigin));
        }

        $response = $next($request);

        foreach ($this->headers($allowedOrigin) as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }

    private function headers(string $origin): array
    {
        return [
            'Access-Control-Allow-Origin' => $origin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, Accept',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age' => '86400',
            'Vary' => 'Origin',
        ];
    }
}
