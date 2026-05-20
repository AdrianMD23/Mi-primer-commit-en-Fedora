<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function create()
    {
        // Mandamos a React solo los productos que SÍ tienen stock
        $productos = Producto::where('stock', '>', 0)
            ->select('id', 'clave', 'nombre', 'precio_venta', 'stock', 'talla', 'peso_gramos')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Ventas/Nueva', [
            'productos' => $productos
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validación estricta
        $request->validate([
            'carrito' => 'required|array|min:1',
            'metodo_pago' => 'required|string',
            'total' => 'required|numeric|min:0.1'
        ]);

        try {
            DB::transaction(function () use ($request) {
                // 2. Crear la venta (Asegúrate que id_usuario y metodo_pago existan en tu tabla SQL)
                $venta = Venta::create([
                    'total' => $request->total,
                    'metodo_pago' => $request->metodo_pago,
                    'id_usuario' => auth()->id(),
                ]);

                // 3. Registrar productos y descontar stock
                foreach ($request->carrito as $item) {
                    DB::table('detalle_ventas')->insert([
                        'id_venta' => $venta->id,
                        'id_producto' => $item['id'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_venta'],
                        'subtotal' => $item['cantidad'] * $item['precio_venta'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    Producto::where('id', $item['id'])->decrement('stock', $item['cantidad']);
                }
            });

            return redirect()->route('ventas.historial')->with('success', '¡Venta registrada con éxito!');

        } catch (\Exception $e) {
            // Si algo falla, regresamos con el error para que sepas qué pasó
            return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
        }
    
        // Redirigimos al catálogo con mensaje de éxito (o al historial de ventas)
        return redirect()->route('catalogo.index')->with('success', '¡Venta registrada exitosamente!');
    }
    
    // Historial de ventas del usuario actual
    public function historial()
    {
        // Traemos las ventas de este vendedor junto con los detalles y los productos
        $ventas = Venta::with('detalles.producto')
            ->where('id_usuario', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Ventas/Historial', [
            'ventas' => $ventas
        ]);
    }

    // Resumen del turno actual para el vendedor
    public function miTurno()
    {
        $hoy = now()->format('Y-m-d');
        
        // Buscamos solo las ventas de hoy de este vendedor
        $ventasHoy = Venta::where('id_usuario', auth()->id())
            ->whereDate('created_at', $hoy)
            ->get();

        // Calculamos cuánto cobró con cada método
        $totalEfectivo = $ventasHoy->where('metodo_pago', 'Efectivo')->sum('total');
        $totalTarjeta = $ventasHoy->where('metodo_pago', 'Tarjeta de Crédito')->sum('total');
        $totalTransferencia = $ventasHoy->where('metodo_pago', 'Transferencia')->sum('total');

        return Inertia::render('Ventas/MiTurno', [
            'resumen' => [
                'efectivo' => $totalEfectivo,
                'tarjeta' => $totalTarjeta,
                'transferencia' => $totalTransferencia,
                'total' => $ventasHoy->sum('total'),
                'cantidad_ventas' => $ventasHoy->count()
            ],
            'fecha' => now()->translatedFormat('d \d\e F \d\e Y')
        ]);
    }
}