<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $fillable = [
        'nombre_tienda',
        'rfc',
        'direccion',
        'telefono',
        'mensaje_ticket'
    ];
}