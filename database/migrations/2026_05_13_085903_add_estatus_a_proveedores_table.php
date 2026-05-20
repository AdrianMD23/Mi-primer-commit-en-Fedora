<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('proveedores', function (Blueprint $table) {
            if (!Schema::hasColumn('proveedores', 'activo')) {
                // Por defecto, todos los nuevos proveedores nacen "Activos" (true)
                $table->boolean('activo')->default(true);
            }
        });
    }

    public function down(): void
    {
    }
};