<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->unsignedBigInteger('id_venta')->after('id');
            $table->unsignedBigInteger('id_producto')->after('id_venta');
            $table->integer('cantidad')->after('id_producto');
            $table->decimal('precio_unitario', 10, 2)->after('cantidad');
            $table->decimal('subtotal', 10, 2)->after('precio_unitario');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_ventas', function (Blueprint $table) {
            $table->dropColumn(['id_venta', 'id_producto', 'cantidad', 'precio_unitario', 'subtotal']);
        });
    }
};