<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientostock', function (Blueprint $table) {
            // Llave primaria tal como en tu diagrama
            $table->id('id_movimiento');
            
            // Tipo de movimiento: Entrada, Salida, Ajuste
            $table->string('tipo', 50);
            
            // Fecha y hora del movimiento
            $table->dateTime('fecha');
            
            // Cuántas piezas entraron o salieron
            $table->integer('cantidad');
            
            // Por qué se movió (ej. "Compra a proveedor", "Pieza dañada")
            $table->string('motivo', 255)->nullable();
            
            // Llave foránea (El producto al que se le hizo el movimiento)
            $table->unsignedBigInteger('id_producto');
            
            // Opcional: Le decimos a MySQL que id_producto está enlazado a la tabla productos
            // $table->foreign('id_producto')->references('id')->on('productos');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientostock');
    }
};