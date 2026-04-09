<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    // Le decimos el nombre exacto de la tabla para que no se confunda
    protected $table = 'proveedores';

    protected $fillable = ['nombre', 'contacto', 'telefono'];

    // Relación: Un proveedor surte muchos productos (1 a N)
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}