<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categorias = Categoria::when($search, function($query, $search) {
            $query->where('nombre', 'like', "%{$search}%");
        })
        ->orderBy('activo', 'desc') // Las activas primero
        ->orderBy('nombre', 'asc')  // Luego en orden alfabético
        ->get();

        return Inertia::render('Admin/Categorias/Index', [
            'categorias' => $categorias,
            'filters' => ['search' => $search]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string|max:100|unique:categorias']);
        Categoria::create($request->all());
        return back()->with('success', 'Categoría creada exitosamente.');
    }

    public function update(Request $request, Categoria $categoria)
    {
        $request->validate(['nombre' => 'required|string|max:100']);
        $categoria->update($request->all());
        return back()->with('success', 'Categoría actualizada.');
    }

    // NUEVA FUNCIÓN: Interruptor Activo/Inactivo
    public function toggle(Categoria $categoria)
    {
        $categoria->activo = !$categoria->activo;
        $categoria->save();

        $mensaje = $categoria->activo 
            ? 'Categoría HABILITADA nuevamente.' 
            : 'Categoría INHABILITADA. Ya no aparecerá al crear piezas.';

        return back()->with('success', $mensaje);
    }
}