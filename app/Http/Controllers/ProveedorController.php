<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $proveedores = Proveedor::when($search, function($query, $search) {
            $query->where('nombre', 'like', "%{$search}%")
                  ->orWhere('contacto', 'like', "%{$search}%");
        })->latest()->get();

        return Inertia::render('Admin/Proveedores/Index', [
            'proveedores' => $proveedores,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'contacto' => 'nullable|string|max:100',
            'telefono' => 'nullable|string|max:20',
        ]);
        Proveedor::create($request->all());
        return back()->with('success', 'Proveedor registrado.');
    }
}