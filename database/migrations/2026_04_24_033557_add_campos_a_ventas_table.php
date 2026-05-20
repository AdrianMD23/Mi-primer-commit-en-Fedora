<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            // Agregamos el total, método de pago y quién hizo la venta
            $table->decimal('total', 10, 2)->default(0)->after('id');
            $table->string('metodo_pago', 50)->default('Efectivo')->after('total');
            $table->unsignedBigInteger('id_usuario')->nullable()->after('metodo_pago');
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['total', 'metodo_pago', 'id_usuario']);
        });
    }
};