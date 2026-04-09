<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

// El Dashboard: Disponible para cualquier usuario logueado
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// --- RUTAS PROTEGIDAS POR ROL ---
// 1. Acceso para Vendedores (y Admin)
Route::middleware(['auth', 'rol:Vendedor,Administrador'])->group(function () {
    Route::get('/ventas/nueva', [VentaController::class, 'create'])->name('ventas.nueva');
    Route::post('/ventas/guardar', [VentaController::class, 'store'])->name('ventas.guardar');
    
    // AGREGA ESTA LÍNEA PARA EL HISTORIAL
    Route::get('/ventas/historial', [VentaController::class, 'historial'])->name('ventas.historial');
});

// 2. Acceso para Gerentes y Admin (Inventario y Cortes)
Route::middleware(['auth', 'rol:Gerente,Administrador'])->group(function () {
    Route::get('/inventario', [ProductController::class, 'index'])->name('inventario.index');
    Route::post('/inventario/agregar', [ProductController::class, 'addStock'])->name('inventario.add');
    Route::post('/inventario/quitar', [ProductController::class, 'removeStock'])->name('inventario.remove');
    
    Route::get('/gerencia/cortes', [AdminController::class, 'cortesIndex'])->name('gerencia.cortes');
    Route::post('/gerencia/cerrar-nota/{id}', [AdminController::class, 'cerrarNota'])->name('gerencia.cerrar.nota');
});

// 3. Acceso Exclusivo de Admin (Gestión de Usuarios)
Route::middleware(['auth', 'rol:Administrador'])->group(function () {
    Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios');
});
require __DIR__.'/auth.php';