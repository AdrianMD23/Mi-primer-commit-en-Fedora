<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    use HasFactory;

    // Aseguramos que busque la llave primaria correcta
    protected $primaryKey = 'id_gasto';
    
    // AQUÍ ESTÁ LA MAGIA: Le damos permiso a Laravel de llenar estas columnas
    protected $fillable = [
        'concepto',
        'monto',
        'fecha',
        'id_usuario',
    ];

    // Relación para saber quién registró el gasto
    public function usuario()
    {
        return $this->belongsTo(User::class, 'id_usuario', 'id');
    }
}