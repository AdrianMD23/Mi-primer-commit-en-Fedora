<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Si el usuario no está logueado o su rol no coincide con lo permitido
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            // Lo mandamos de regreso al dashboard
            return redirect('/dashboard');
        }

        return $next($request);
    }
}