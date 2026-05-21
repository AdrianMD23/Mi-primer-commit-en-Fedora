<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Gasto;
use App\Models\Producto; // <-- Importante para buscar el stock
use App\Models\DetalleVenta; // <-- Importante para guardar los tickets
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <-- Para transacciones seguras
use Inertia\Inertia;

class VentaController extends Controller
{
    // ==========================================
    // 1. CARGA LA PANTALLA DEL PUNTO DE VENTA
    // ==========================================
    public function create()
    {
        // Le quitamos el where('stock', '>', 0) para que React conozca los agotados
        $productos = Producto::orderBy('nombre', 'asc')->get();

        return Inertia::render('Ventas/Nueva', [
            'productos' => $productos
        ]);
    }

 // ==========================================
    // 2. PROCESA EL COBRO Y DESCUENTA STOCK
    // ==========================================
    public function store(Request $request)
    {
        // 1. Validamos usando el nombre correcto: "carrito"
        $request->validate([
            'total' => 'required|numeric|min:0.1',
            'metodo_pago' => 'required|string',
            'carrito' => 'required|array', // <--- CORRECCIÓN AQUÍ
        ]);

        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            $venta = Venta::create([
                'id_usuario' => auth()->id(),
                'total' => $request->total,
                'metodo_pago' => $request->metodo_pago,
            ]);

            // 2. Recorremos el "carrito" en lugar de "articulos"
            foreach ($request->carrito as $item) { // <--- CORRECCIÓN AQUÍ
                $producto = Producto::find($item['id']);
                
                // --- EL CANDADO MAESTRO ---
                if ($item['cantidad'] > $producto->stock) {
                    \Illuminate\Support\Facades\DB::rollBack();
                    return back()->withErrors(['error' => 'No hay suficiente stock para la pieza: ' . $producto->nombre]);
                }
                // ---------------------------

                DetalleVenta::create([
                    'id_venta' => $venta->id,
                    'id_producto' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $producto->precio_venta,
                    'subtotal' => $producto->precio_venta * $item['cantidad'],
                ]);

                $producto->decrement('stock', $item['cantidad']);
            }

            \Illuminate\Support\Facades\DB::commit();
            return redirect()->route('ventas.historial')->with('success', 'Venta registrada y stock actualizado.');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            // Le decimos que nos mande el error exacto que arroja la base de datos
            return back()->withErrors(['error' => 'Error en BD: ' . $e->getMessage()]);
        }
    }

    // ==========================================
    // 3. CARGA EL HISTORIAL (Solo ventas de hoy)
    // ==========================================
    public function historial()
    {
        $hoy = now()->format('Y-m-d');

        $ventas = Venta::whereDate('created_at', $hoy)
            ->with('detalles.producto')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Ventas/Historial', [
            'ventas' => $ventas
        ]);
    }

    // ==========================================
    // 4. CARGA "MI TURNO" (Caja Actual del Día)
    // ==========================================
    public function miTurno()
    {
        $hoy = now()->format('Y-m-d');

        $efectivo = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Efectivo')->sum('total') ?? 0;
        $tarjeta = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Tarjeta')->sum('total') ?? 0;
        $transferencia = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Transferencia')->sum('total') ?? 0;
        
        $gastos = Gasto::whereDate('created_at', $hoy)->sum('monto') ?? 0;
        $cantidadVentas = Venta::whereDate('created_at', $hoy)->count();

        $efectivoEnCajon = $efectivo - $gastos;

        return Inertia::render('Ventas/MiTurno', [
            'resumen' => [
                'efectivo' => $efectivoEnCajon > 0 ? $efectivoEnCajon : 0,
                'tarjeta' => $tarjeta,
                'transferencia' => $transferencia,
                'cantidad_ventas' => $cantidadVentas,
                'total' => $efectivo + $tarjeta + $transferencia
            ],
            'fecha' => now()->translatedFormat('d \d\e F, Y')
        ]);
    }
}