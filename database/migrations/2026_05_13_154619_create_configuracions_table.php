<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('configuracions', function (Blueprint $table) {
        $table->id();
        $table->string('nombre_tienda')->default('Platería Adrián Matos');
        $table->string('rfc')->nullable();
        $table->string('direccion')->nullable();
        $table->string('telefono')->nullable();
        $table->text('mensaje_ticket')->nullable();
        $table->timestamps();
    });

    // Insertamos un registro inicial para que el formulario siempre tenga algo que editar
    DB::table('configuracions')->insert([
        'nombre_tienda' => 'Platería Adrián Matos',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}
};
