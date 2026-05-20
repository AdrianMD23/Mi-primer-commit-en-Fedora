<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MovimientoStock;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class GenerarReporteSemanal extends Command
{
    // El nombre con el que llamarás al comando manualmente si quieres
    protected $signature = 'reporte:semanal';
    protected $description = 'Genera un PDF de movimientos y limpia la tabla';

    public function handle()
    {
        $movimientos = MovimientoStock::with('producto')->get();

        if ($movimientos->isEmpty()) {
            $this->info('No hay movimientos para reportar.');
            return;
        }

        // 1. Generamos el PDF usando una vista (la crearemos en el paso 3)
        $pdf = Pdf::loadView('pdf.movimientos', compact('movimientos'));
        
        // 2. Nombre del archivo con la fecha
        $nombreArchivo = 'reporte_movimientos_' . now()->format('Y_m_d') . '.pdf';
        
        // 3. Lo guardamos en storage/app/public/reportes
        Storage::disk('public')->put('reportes/' . $nombreArchivo, $pdf->output());

        // 4. ¡LIMPIEZA! Borramos todo el historial de la tabla
        MovimientoStock::truncate();

        $this->info("Reporte $nombreArchivo generado y tabla limpiada.");
    }
}