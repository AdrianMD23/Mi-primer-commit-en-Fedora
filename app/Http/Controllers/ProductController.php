<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Traemos los productos incluyendo los datos de su categoría
        // El latest() los ordena del más nuevo al más viejo
        $productos = Producto::with(['categoria'])->latest()->get();
        
        // También mandamos categorías y proveedores para cuando hagamos el formulario de "Crear"
        $categorias = Categoria::all();
        $proveedores = Proveedor::all();

        // Enviamos todo esto a una vista de React llamada 'Inventario/Index'
        return Inertia::render('Inventario/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'proveedores' => $proveedores
        ]);
    }
}