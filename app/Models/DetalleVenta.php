<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DetalleVenta extends Model {
  use HasFactory;

    // Esta es la lista de permisos. Sin esto, Laravel bloquea los datos.
    protected $fillable = [
        'id_venta',
        'id_producto',
        'cantidad',
        'precio_unitario',
        'subtotal'
    ];    
    
    
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }
}