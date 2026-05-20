<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Consultamos productos donde el stock es menor o igual al mínimo
        // Cambiamos 'id_producto' por 'id'
        $alertasStock = Producto::whereColumn('stock', '<=', 'stock_minimo')
            ->orderBy('stock', 'asc')
            ->get(['id', 'clave', 'nombre', 'stock', 'stock_minimo']);

        return Inertia::render('Dashboard', [
            'stockAlerts' => $alertasStock
        ]);
    }
}