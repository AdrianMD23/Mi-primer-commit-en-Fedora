<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    // Campos que permitimos guardar masivamente
    protected $fillable = ['nombre'];

    // Relación: Una categoría tiene muchos productos (1 a N)
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}