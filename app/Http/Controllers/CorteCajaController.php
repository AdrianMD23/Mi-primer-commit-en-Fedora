<?php

namespace App\Http\Controllers;

use App\Models\CorteCaja;
use App\Models\Gasto;
use App\Models\Venta; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorteCajaController extends Controller
{
    public function index()
    {
        $hoy = now()->format('Y-m-d');

        // Separamos el efectivo de las tarjetas/transferencias
        $ingresosEfectivo = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Efectivo')->sum('total') ?? 0;
        $ingresosOtros = Venta::whereDate('created_at', $hoy)->where('metodo_pago', '!=', 'Efectivo')->sum('total') ?? 0;
        
        $gastosHoy = Gasto::whereDate('created_at', $hoy)->sum('monto') ?? 0;
        $cortes = CorteCaja::orderBy('fecha', 'desc')->get();

        return Inertia::render('Gerencia/Cortes/Index', [
            'totales' => [
                'ingresos_efectivo' => $ingresosEfectivo,
                'ingresos_otros' => $ingresosOtros,
                'gastos' => $gastosHoy,
                'fecha' => now()->translatedFormat('d \d\e F')
            ],
            'cortes' => $cortes,
            'corteHoy' => CorteCaja::whereDate('fecha', $hoy)->exists()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fondo_caja' => 'required|numeric|min:0',
            'total_real' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string'
        ]);

        $hoy = date('Y-m-d');
        
        // Evitamos que hagan dos cortes el mismo día
        if (CorteCaja::whereDate('fecha', $hoy)->exists()) {
            return back()->withErrors(['error' => 'Ya existe un corte registrado para el día de hoy.']);
        }

        // Volvemos a calcular el efectivo para asegurar precisión en el momento del guardado
        $ventasEfectivo = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Efectivo')->sum('total') ?? 0;
        $gastosHoy = Gasto::whereDate('created_at', $hoy)->sum('monto') ?? 0;
        
        // LA FÓRMULA MAESTRA DE CAJA:
        $esperado = $request->fondo_caja + $ventasEfectivo - $gastosHoy;
        $real = $request->total_real;
        $diferencia = $real - $esperado;

        if ($diferencia == 0) {
            $estado = 'Cuadre Exacto';
        } elseif ($diferencia > 0) {
            $estado = 'Sobrante';
        } else {
            $estado = 'Faltante';
        }

        // Guardamos el fondo inicial en las observaciones de forma automática
        $obsFinal = "Fondo Inicial: $" . number_format($request->fondo_caja, 2) . ". " . ($request->observaciones ?? '');

        CorteCaja::create([
            'fecha' => $hoy,
            'total_ventas' => $ventasEfectivo, // Guardamos SOLO el efectivo para que el corte sea lógico
            'total_gastos' => $gastosHoy,
            'total_esperado' => $esperado,
            'total_real' => $real,
            'diferencia' => $diferencia,
            'estado' => $estado,
            'observaciones' => trim($obsFinal),
            'id_usuario' => auth()->id(),
        ]);

        return back()->with('success', 'Corte de caja cerrado exitosamente.');
    }
}