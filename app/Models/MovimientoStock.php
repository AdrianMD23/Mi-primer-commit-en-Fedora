<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoStock extends Model
{
    use HasFactory;

    // Le decimos a Laravel el nombre exacto de la tabla y su llave primaria
    protected $table = 'movimientostock';
    protected $primaryKey = 'id_movimiento';
    
    // Desactivamos los timestamps si no creaste created_at y updated_at en tu tabla
    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'fecha',
        'cantidad',
        'motivo',
        'id_producto',
    ];

    // Relación: Un movimiento pertenece a un producto
    public function producto()
    {
        // Cambiamos el tercer parámetro a 'id'
        return $this->belongsTo(Producto::class, 'id_producto', 'id');
    }
}