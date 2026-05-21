<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Programa nuestro robot para ejecutarse todos los domingos (día 0) a las 00:00 hrs.
Schedule::command('sistema:reiniciar-semanal')->weeklyOn(0, '00:00');
Schedule::command('caja:auto-cierre')->dailyAt('23:59');
Schedule::command('reporte:semanal')->weeklyOn(0, '23:59');
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
