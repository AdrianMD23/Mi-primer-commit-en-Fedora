<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Venta;
use App\Models\DetalleVenta;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    // 1. Muestra la pantalla de la caja registradora
    public function create()
    {
        return Inertia::render('Ventas/NuevaVenta');
    }
    
    // 2. Procesa la venta y la guarda en la base de datos
    public function store(Request $request)
    {
        // Iniciamos una transacción: o se guarda todo o nada (Seguridad de datos)
        DB::transaction(function () use ($request) {
            $venta = Venta::create([
                'user_id' => auth()->id(),
                'total' => $request->total,
                'status' => 'pendiente', // Pendiente para que el Gerente la cierre
            ]);

            foreach ($request->items as $item) {
                $venta->detalles()->create([
                    'clave' => $item['clave'],
                    'nombre' => $item['nombre'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio'],
                    'subtotal' => $item['precio'] * $item['cantidad'],
                ]);
            }
        });

        return redirect()->route('dashboard')->with('message', 'Nota enviada a corte correctamente');
    }

    // 3. Muestra la pantalla del historial (Mis Ventas)
    public function historial()
    {
        // Datos simulados (Por ahora, para maquetar la tabla de Marco)
        $ventasSimuladas = [
            ['id' => 1, 'folio' => 'TKT-0001', 'fecha' => '2026-03-26 10:30 AM', 'cliente' => 'Público General', 'total' => 850.00, 'articulos' => 1],
            ['id' => 2, 'folio' => 'TKT-0002', 'fecha' => '2026-03-26 12:15 PM', 'cliente' => 'Doña Rosa', 'total' => 2400.00, 'articulos' => 2],
            ['id' => 3, 'folio' => 'TKT-0003', 'fecha' => '2026-03-26 01:45 PM', 'cliente' => 'Público General', 'total' => 600.00, 'articulos' => 1],
        ];

        return Inertia::render('Ventas/Historial', [
            'ventas' => $ventasSimuladas
        ]);
    }
}