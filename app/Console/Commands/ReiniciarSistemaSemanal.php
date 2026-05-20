<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReiniciarSistemaSemanal extends Command
{
    // Este es el nombre del comando que usaremos en la terminal
    protected $signature = 'sistema:reiniciar-semanal';

    // Una breve descripción de lo que hace
    protected $description = 'Vacía los registros de caja, ventas, gastos y auditoría de la semana';

    public function handle()
    {
        // 1. Apagamos la revisión de llaves foráneas temporalmente
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

       // 2. TRUNCATE vacía la tabla por completo y reinicia los IDs a 1
        DB::table('gastos')->truncate();
        DB::table('cortes_caja')->truncate(); // Corregido con el nombre de tu imagen
        DB::table('movimientostock')->truncate(); // Corregido con el nombre de tu imagen
        DB::table('detalle_ventas')->truncate();
        DB::table('ventas')->truncate();

        // 3. Volvemos a prender la seguridad de la base de datos
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Mensaje de éxito en la terminal
        $this->info('¡Limpieza semanal completada con éxito! La caja está en ceros.');
    }
}