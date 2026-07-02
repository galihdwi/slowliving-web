<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use App\Http\Middleware\AuthenticateApiToken;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__ . '/../routes/api.php',
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'auth.api' => AuthenticateApiToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (\Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'status' => 'fail',
                    'data' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof AuthenticationException) {
                return response()->json([
                    'status' => 'fail',
                    'data' => [
                        'message' => 'Unauthenticated.',
                    ],
                ], 401);
            }

            if ($exception instanceof ModelNotFoundException) {
                return response()->json([
                    'status' => 'fail',
                    'data' => [
                        'message' => 'Resource not found.',
                    ],
                ], 404);
            }

            if ($exception instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'status' => 'fail',
                    'data' => [
                        'message' => 'HTTP method is not supported for this route.',
                        'allowed_methods' => $exception->getHeaders()['Allow'] ?? null,
                    ],
                ], 405);
            }

            if ($exception instanceof HttpExceptionInterface) {
                $statusCode = $exception->getStatusCode();
                $message = $exception->getMessage() ?: 'Request failed.';

                if ($statusCode >= 500) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $message,
                    ], $statusCode);
                }

                return response()->json([
                    'status' => 'fail',
                    'data' => [
                        'message' => $message,
                    ],
                ], $statusCode);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error.',
            ], 500);
        });
    })->create();
