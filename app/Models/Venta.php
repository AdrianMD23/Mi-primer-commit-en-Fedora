<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model {
    // Los nombres deben ser EXACTAMENTE iguales a los de tu base de datos y controlador
    protected $fillable = ['id_usuario', 'total', 'metodo_pago'];

    public function detalles() {
        return $this->hasMany(DetalleVenta::class, 'id_venta');
    }

    public function usuario() {
        return $this->belongsTo(User::class, 'id_usuario');
    }
}