<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Venta;
use App\Models\Gasto;
use App\Models\CorteCaja;

class AutoCierreCajaCommand extends Command
{
    protected $signature = 'caja:auto-cierre';
    protected $description = 'Realiza el corte de caja automático al finalizar el día para resguardar las operaciones de la platería';

    public function handle()
    {
        $hoy = now()->format('Y-m-d');

        // Si el gerente o cajero ya hicieron el corte manualmente, el comando no hace nada
        if (CorteCaja::whereDate('fecha', $hoy)->exists()) {
            $this->info('El corte de caja ya fue registrado manualmente hoy.');
            return;
        }

        // Cálculos maestros automáticos (asumiendo un fondo base por defecto de $1,000)
        $fondoCajaBase = 1000.00; 
        $ventasEfectivo = Venta::whereDate('created_at', $hoy)->where('metodo_pago', 'Efectivo')->sum('total') ?? 0;
        $gastosHoy = Gasto::whereDate('created_at', $hoy)->sum('monto') ?? 0;
        
        $esperado = $fondoCajaBase + $ventasEfectivo - $gastosHoy;

        CorteCaja::create([
            'fecha' => $hoy,
            'total_ventas' => $ventasEfectivo,
            'total_gastos' => $gastosHoy,
            'total_esperado' => $esperado,
            'total_real' => $esperado, // Al ser automático, cuadra de manera exacta con el sistema
            'diferencia' => 0,
            'estado' => 'Cuadre Exacto',
            'observaciones' => 'Cierre automatizado por el sistema a la medianoche (Fondo base por defecto: $1,000).',
            'id_usuario' => 1, // ID de la cuenta del administrador o sistema
        ]);

        $this->info('Corte de caja automatizado generado con éxito.');
    }
}