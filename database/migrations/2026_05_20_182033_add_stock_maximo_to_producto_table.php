<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Agregamos la "s" a productos
        Schema::table('productos', function (Blueprint $table) {
            $table->integer('stock_maximo')->default(0)->after('stock_minimo');
        });
    }

    public function down()
    {
        // Agregamos la "s" a productos
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn('stock_maximo');
        });
    }
};