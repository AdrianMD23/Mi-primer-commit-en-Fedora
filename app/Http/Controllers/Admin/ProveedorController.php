<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {
        $query = Proveedor::query();

        // Si el usuario escribió algo en el buscador
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('tipo_mercancia', 'LIKE', "%{$search}%")
                  ->orWhere('contacto', 'LIKE', "%{$search}%");
        }

        // Traemos los resultados (10 por página)
        $proveedores = $query->orderBy('nombre')->paginate(10)->withQueryString();

        return Inertia::render('Admin/Proveedores/Index', [
            'proveedores' => $proveedores,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'contacto' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string',
            'tipo_mercancia' => 'nullable|string|max:255',
            'notas' => 'nullable|string'
        ]);

        Proveedor::create($request->all());

        return back()->with('success', 'Proveedor registrado exitosamente.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'contacto' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'direccion' => 'nullable|string',
            'tipo_mercancia' => 'nullable|string|max:255',
            'notas' => 'nullable|string'
        ]);

        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update($request->all());

        return back()->with('success', 'Proveedor actualizado correctamente.');
    }

   public function toggle($id)
    {
        $proveedor = Proveedor::findOrFail($id);
        
        // Invertimos el estatus (si era true, pasa a false, y viceversa)
        $proveedor->activo = !$proveedor->activo;
        $proveedor->save();

        $mensaje = $proveedor->activo 
            ? 'Proveedor HABILITADO nuevamente.' 
            : 'Proveedor INHABILITADO. Ya no será visible para los demás.';

        return back()->with('success', $mensaje);
    }
}