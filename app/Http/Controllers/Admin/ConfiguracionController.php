<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Configuracion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index()
    {
        // Tomamos el primer (y único) registro de configuración
        $configuracion = Configuracion::first();

        return Inertia::render('Admin/Configuracion', [
            'configuracion' => $configuracion
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'nombre_tienda' => 'required|string|max:255',
            'rfc'           => 'nullable|string|max:20',
            'direccion'     => 'nullable|string|max:500',
            'telefono'      => 'nullable|string|max:20',
            'mensaje_ticket'=> 'nullable|string|max:1000',
        ]);

        $configuracion = Configuracion::first();
        $configuracion->update($data);

        return back()->with('success', 'La configuración del sistema ha sido actualizada con éxito.');
    }
}