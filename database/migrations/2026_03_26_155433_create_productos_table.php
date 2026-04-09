<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('productos', function (Blueprint $table) {
        $table->id(); // Tu id_producto
        $table->string('clave', 50)->unique(); // Único para que el lector de código de barras no falle
        $table->string('nombre', 150);
        $table->text('descripcion')->nullable();
        $table->decimal('precio_venta', 10, 2);
        $table->decimal('precio_inv', 10, 2); // Precio de costo para calcular ganancias
        $table->integer('stock')->default(0);
        $table->integer('stock_minimo')->default(5);
        
        // Llaves Foráneas (Relaciones)
        $table->foreignId('categoria_id')->constrained('categorias')->onDelete('restrict');
        $table->foreignId('proveedor_id')->nullable()->constrained('proveedores')->onDelete('set null');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
