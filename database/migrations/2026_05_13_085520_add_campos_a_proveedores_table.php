<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('proveedores', function (Blueprint $table) {
            // Le decimos a Laravel que agregue estas columnas si no existen
            if (!Schema::hasColumn('proveedores', 'contacto')) {
                $table->string('contacto')->nullable();
            }
            if (!Schema::hasColumn('proveedores', 'telefono')) {
                $table->string('telefono')->nullable();
            }
            if (!Schema::hasColumn('proveedores', 'email')) {
                $table->string('email')->nullable();
            }
            if (!Schema::hasColumn('proveedores', 'direccion')) {
                $table->text('direccion')->nullable();
            }
            if (!Schema::hasColumn('proveedores', 'tipo_mercancia')) {
                $table->string('tipo_mercancia')->nullable();
            }
            if (!Schema::hasColumn('proveedores', 'notas')) {
                $table->text('notas')->nullable();
            }
        });
    }

    public function down(): void
    {
        // No necesitamos nada aquí por ahora
    }
};