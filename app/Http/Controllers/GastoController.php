<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GastoController extends Controller
{
    public function index()
    {
        // Traemos los gastos con el nombre de quien lo registró
        $gastos = Gasto::with('usuario')->orderBy('fecha', 'desc')->orderBy('created_at', 'desc')->paginate(15);
        
        // Calculamos cuánto se ha gastado en el mes actual
        $totalMes = Gasto::whereMonth('fecha', date('m'))
                         ->whereYear('fecha', date('Y'))
                         ->sum('monto');

        return Inertia::render('Gerencia/Gastos/Index', [
            'gastos' => $gastos,
            'totalMes' => $totalMes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'concepto' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0.1',
            'fecha' => 'required|date',
        ]);

        Gasto::create([
            'concepto' => $request->concepto,
            'monto' => $request->monto,
            'fecha' => $request->fecha,
            // Guardamos automáticamente el ID del usuario que está conectado
            'id_usuario' => auth()->id(), 
        ]);

        return back()->with('success', 'Gasto registrado correctamente en el sistema.');
    }
}