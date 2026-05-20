<?php

namespace App\Http\Controllers;

use App\Models\MovimientoStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovimientoController extends Controller
{
    public function index(Request $request)
    {
        // Traemos los movimientos junto con la información del producto afectado
        // Los ordenamos por fecha (los más nuevos primero)
        $movimientos = MovimientoStock::with('producto')
            ->orderBy('fecha', 'desc')
            ->paginate(20);

        return Inertia::render('Gerencia/Movimientos/Index', [
            'movimientos' => $movimientos
        ]);
    }
}