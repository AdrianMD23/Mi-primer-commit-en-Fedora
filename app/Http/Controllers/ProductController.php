<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MovimientoStock;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // 1. Recibimos lo que el usuario escribe o selecciona
        $search = $request->input('search');
        $categoria_id = $request->input('categoria_id');

        // 2. Filtramos la base de datos mágicamente
        $productos = Producto::with(['categoria', 'proveedor'])
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                      ->orWhere('clave', 'like', "%{$search}%");
            })
            ->when($categoria_id, function ($query, $categoria_id) {
                $query->where('categoria_id', $categoria_id);
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString(); // Mantiene la búsqueda al cambiar de página

        $categorias = \App\Models\Categoria::where('activo', true)->orderBy('nombre', 'asc')->get();

        return Inertia::render('Inventario/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria_id'])
        ]);
    }

   public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $request->validate([
            // CORRECCIÓN: Buscamos en la tabla 'productos' y la llave a ignorar es el 'id'
            'clave' => 'required|string|max:50|unique:productos,clave,'.$id,
            'nombre' => 'required|string|max:255',
            'precio_inv' => 'required|numeric',
            'precio_venta' => 'required|numeric',
            'categoria_id' => 'required',
            'stock_minimo' => 'required|integer|min:0',
            'stock_maximo' => 'required|integer|min:0|gte:stock_minimo', 
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
        ]);

        $datos = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            $ruta = $request->file('imagen')->store('productos', 'public');
            $datos['imagen'] = $ruta;
        }

        $producto->update($datos);

        return back()->with('success', 'Producto y límites de stock actualizados correctamente.');
    }

    // 1. Mostrar el formulario de Nueva Pieza
    public function create()
    {
        return Inertia::render('Inventario/Create', [
            // LE AGREGAMOS EL FILTRO A LAS CATEGORÍAS AQUÍ:
            'categorias' => Categoria::where('activo', true)->orderBy('nombre', 'asc')->get(),
            'proveedores' => Proveedor::where('activo', true)->orderBy('nombre', 'asc')->get()
        ]);
    }

    // 2. Guardar la Nueva Pieza en la Base de Datos
    public function store(Request $request)
    {
        // Validamos que los datos sean correctos
       $validated = $request->validate([
            'clave' => 'required|string|max:50|unique:productos,clave',
            'nombre' => 'required|string|max:150',
            'talla' => 'nullable|string|max:50',
            'peso_gramos' => 'nullable|numeric|min:0',
            'precio_inv' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id', 
            'proveedor_id' => 'required|exists:proveedores,id', 
            'descripcion' => 'nullable|string',
        ]);
        
        // Si no mandan talla, le ponemos 'Unitalla' por defecto
        if (empty($validated['talla'])) {
            $validated['talla'] = 'Unitalla';
        }
        if ($request->hasFile('imagen')) {
        $ruta = $request->file('imagen')->store('productos', 'public');
        $validated['imagen'] = $ruta;
    }
        // Creamos el producto
        Producto::create($validated);

        // Redirigimos al catálogo con un mensaje de éxito
        return redirect()->route('inventario.index')->with('success', 'Pieza registrada correctamente.');
    }

    // Función para Ajustar Stock y registrar el movimiento
    public function ajustarStock(Request $request, Producto $producto)
    {
        $request->validate([
            'tipo' => 'required|in:Entrada,Salida,Ajuste',
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'required|string|max:255',
        ]);

        $cantidad = $request->cantidad;

        // 1. Modificamos el stock del producto según el tipo de movimiento
        if ($request->tipo === 'Entrada') {
            $producto->stock += $cantidad;
        } else {
            // Si es Salida o Ajuste (merma), restamos.
            if ($producto->stock < $cantidad) {
                return back()->withErrors(['cantidad' => 'No hay suficiente stock para retirar esa cantidad.']);
            }
            $producto->stock -= $cantidad;
        }
        $producto->save();

        // 2. Guardamos el registro en la Auditoría (movimientostock)
        MovimientoStock::create([
            'tipo' => $request->tipo,
            'fecha' => now(), // Laravel pone la fecha y hora exacta
            'cantidad' => $cantidad,
            'motivo' => $request->motivo,
            'id_producto' => $producto->id, // Usamos el ID del producto afectado
        ]);

        return back()->with('success', 'Stock actualizado y movimiento registrado.');
    }

    public function catalogo(Request $request)
{
    $search = $request->input('search');

    $productos = Producto::with('categoria')
        ->when($search, function ($query, $search) {
            $query->where('nombre', 'like', "%{$search}%")
                  ->orWhere('clave', 'like', "%{$search}%");
        })
        // AGREGAMOS 'imagen' AQUÍ ABAJO:
        ->select('id', 'clave', 'nombre', 'talla', 'peso_gramos', 'precio_venta', 'stock', 'categoria_id', 'imagen') 
        ->orderBy('nombre', 'asc')
        ->paginate(12)
        ->withQueryString();

    return Inertia::render('Ventas/Catalogo', [
        'productos' => $productos,
        'filters' => $request->only(['search'])
    ]);
}

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        // Seguridad: Verificar si el producto existe en detalles de venta
        $historialVentas = \Illuminate\Support\Facades\DB::table('detalle_ventas')
                            ->where('id_producto', $id)
                            ->exists();

        // Seguridad: Verificar si el producto existe en auditoría de movimientos
        $historialMovimientos = \App\Models\MovimientoStock::where('id_producto', $id)->exists();

        if ($historialVentas || $historialMovimientos) {
            return back()->withErrors([
                'error' => 'No puedes borrar "' . $producto->nombre . '" porque ya tiene historial de ventas o movimientos. Si ya no lo vendes, pon su stock en 0.'
            ]);
        }

        // Si llega aquí, es un producto "limpio" (como los de prueba) y se puede borrar
        
        // Si tiene imagen física, la borramos del disco duro del servidor
        if ($producto->imagen) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return back()->with('success', 'Producto eliminado permanentemente.');
    }
}