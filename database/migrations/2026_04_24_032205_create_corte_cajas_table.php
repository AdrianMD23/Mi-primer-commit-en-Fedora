<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cortes_caja', function (Blueprint $table) {
            $table->id('id_corte');
            $table->date('fecha')->unique(); // Solo un corte por día
            $table->decimal('total_ventas', 10, 2)->default(0);
            $table->decimal('total_gastos', 10, 2)->default(0);
            $table->decimal('total_esperado', 10, 2)->default(0); // Lo que el sistema dice
            $table->decimal('total_real', 10, 2); // Lo que el gerente contó físicamente
            $table->decimal('diferencia', 10, 2); // Sobrante o Faltante
            $table->string('estado'); // "Cuadre Exacto", "Sobrante", "Faltante"
            $table->text('observaciones')->nullable();
            $table->unsignedBigInteger('id_usuario'); // Quién hizo el corte
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cortes_caja');
    }
};