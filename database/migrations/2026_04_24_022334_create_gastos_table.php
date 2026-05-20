<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gastos', function (Blueprint $table) {
            $table->id('id_gasto');
            $table->string('concepto'); // Ej. "Agua purificada", "Bolsas de regalo"
            $table->decimal('monto', 10, 2);
            $table->date('fecha');
            $table->unsignedBigInteger('id_usuario'); // Para saber qué gerente lo registró
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos');
    }
};