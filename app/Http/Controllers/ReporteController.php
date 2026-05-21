<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Gasto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReporteController extends Controller
{
    public function descargarPDF()
{
    // 1. Obtenemos el inicio y fin de la semana actual
    $inicio = now()->startOfWeek();
    $fin = now()->endOfWeek();

    // 2. Traemos la información de la base de datos
    // Usamos 'with' para que el PDF sepa quién hizo la venta
    $ventas = \App\Models\Venta::with('usuario')
        ->whereBetween('created_at', [$inicio, $fin])
        ->get();

    $gastos = \App\Models\Gasto::whereBetween('created_at', [$inicio, $fin])->get();

    // 3. Cargamos la vista que creamos en el paso 2.a y le pasamos los datos
    $pdf = Pdf::loadView('reportes.pdf_semanal', [
        'ventas' => $ventas,
        'gastos' => $gastos
    ]);

    // 4. Le pedimos al navegador que descargue el archivo con un nombre claro
    return $pdf->download('Reporte_Semanal_' . now()->format('d-m-Y') . '.pdf');
}
public function index()
    {
        $mesActual = Carbon::now()->month;
        $anioActual = Carbon::now()->year;

        // 1. Cálculos Financieros del Mes
        $totalVentas = Venta::whereMonth('created_at', $mesActual)
                            ->whereYear('created_at', $anioActual)
                            ->sum('total') ?? 0;

        $totalGastos = Gasto::whereMonth('fecha', $mesActual)
                            ->whereYear('fecha', $anioActual)
                            ->sum('monto') ?? 0;

        $gananciaNeta = $totalVentas - $totalGastos;

        // 2. Datos extra para rellenar el reporte
        $totalProductos = Producto::count();
        $valorInventario = Producto::sum(\DB::raw('stock * precio_inv')); // Cuánto dinero tienes invertido en piezas

        return Inertia::render('Gerencia/Reportes/Index', [
            'financiero' => [
                'ventas' => $totalVentas,
                'gastos' => $totalGastos,
                'neta' => $gananciaNeta,
            ],
            'inventario' => [
                'totalPiezas' => $totalProductos,
                'valorInvertido' => $valorInventario,
            ],
            'mesActual' => Carbon::now()->translatedFormat('F Y') // Ej: "abril 2026"
        ]);
    }
    public function descargarSemanal()
{
    // 1. Recolectamos toda la info de la última semana
    $fechaInicio = now()->startOfWeek(); 
    $fechaFin = now()->endOfWeek();

    $ventas = \App\Models\Venta::whereBetween('created_at', [$fechaInicio, $fechaFin])->get();
    $gastos = \App\Models\Gasto::whereBetween('created_at', [$fechaInicio, $fechaFin])->get();
    $movimientos = \App\Models\MovimientoStock::whereBetween('created_at', [$fechaInicio, $fechaFin])->get();
    $cortes = \App\Models\CorteCaja::whereBetween('created_at', [$fechaInicio, $fechaFin])->get();

    // 2. Cargamos una "vista" de Blade que servirá como plantilla del PDF
    $pdf = Pdf::loadView('reportes.pdf_semanal', compact('ventas', 'gastos', 'movimientos', 'cortes', 'fechaInicio', 'fechaFin'));

    // 3. Descargamos el archivo
    return $pdf->download('Reporte_Semanal_Plateria.pdf');
}
public function descargarVentasHoyPDF()
    {
        $hoy = now()->format('Y-m-d');
        
        // Obtenemos todas las ventas del día ordenadas por folio
        // Usamos 'with' para traer los productos vendidos y el usuario que vendió
        $ventas = Venta::whereDate('created_at', $hoy)
            ->with(['detalles.producto', 'usuario'])
            ->orderBy('id', 'asc')
            ->get();

        $totalDia = $ventas->sum('total');
        $efectivo = $ventas->where('metodo_pago', 'Efectivo')->sum('total');
        $tarjeta = $ventas->where('metodo_pago', 'Tarjeta')->sum('total');
        $transferencia = $ventas->where('metodo_pago', 'Transferencia')->sum('total');

        $data = [
            'ventas' => $ventas,
            'fecha' => now()->translatedFormat('l d \d\e F \d\e Y'),
            'total_general' => $totalDia,
            'efectivo' => $efectivo,
            'tarjeta' => $tarjeta,
            'transferencia' => $transferencia
        ];

        // Cargamos la vista HTML (que crearemos en el paso 4)
        $pdf = Pdf::loadView('pdf.ventas_diarias', $data);
        
        return $pdf->download("reporte_ventas_{$hoy}.pdf");
    }
}