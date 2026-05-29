<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Venta; // <-- IMPORTANTE: Agregar el modelo Venta
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // 1. Alertas de Stock (esto ya lo tenías)
        $stockAlerts = [];
        if ($user->role === 'Administrador' || $user->role === 'Gerente') {
            $stockAlerts = Producto::whereColumn('stock', '<=', 'stock_minimo')
                                   ->get(['id', 'clave', 'nombre', 'stock']);
        }

        // 2. NUEVO: Datos para la gráfica (Solo para jefes)
        $graficaVentas = [];
        if ($user->role === 'Gerente') {
            // Buscamos las ventas de los últimos 7 días, agrupadas por día
            $graficaVentas = Venta::select(
                DB::raw('DATE(created_at) as fecha'),
                DB::raw('SUM(total) as ingresos')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('fecha')
            ->orderBy('fecha', 'asc')
            ->get();
        }

        return Inertia::render('Dashboard', [
            'stockAlerts' => $stockAlerts,
            'graficaVentas' => $graficaVentas // <-- Enviamos los datos a React
        ]);
    }
}