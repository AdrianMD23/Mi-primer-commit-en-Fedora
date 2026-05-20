<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorteCaja extends Model
{
    use HasFactory;

    protected $table = 'cortes_caja';
    protected $primaryKey = 'id_corte';

    protected $fillable = [
        'fecha', 'total_ventas', 'total_gastos', 'total_esperado', 
        'total_real', 'diferencia', 'estado', 'observaciones', 'id_usuario'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }
}