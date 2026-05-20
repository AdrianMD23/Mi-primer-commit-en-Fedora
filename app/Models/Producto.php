<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'clave', 'nombre', 'imagen', 'descripcion', 'precio_inv', 
        'precio_venta', 'stock', 'stock_minimo', 'talla', 'peso_gramos', 
        'categoria_id', 'proveedor_id'
    ];

    // Relaciones (Asegúrate de tenerlas)
   // Relaciones
    public function categoria()
    {
        // Asegúrate de que 'categoria_id' sea el nombre exacto de tu columna
        return $this->belongsTo(Categoria::class, 'categoria_id', 'id');
    }

    // Relación: Un Producto pertenece a un Proveedor (por si lo ocupamos después)
    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'proveedor_id', 'id');
    }
}