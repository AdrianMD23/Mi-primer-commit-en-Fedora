<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- IMPORTACIÓN DE CONTROLADORES ---
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\ConfiguracionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\CorteCajaController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\Admin\ProveedorController;

Route::redirect('/', '/login');

// El Dashboard: Disponible para cualquier usuario logueado
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// ==========================================
// 1. ACCESO PARA VENDEDORES (Y ADMIN)
// ==========================================
Route::middleware(['auth', 'rol:Vendedor,Administrador'])->group(function () {
    // Catálogo
    Route::get('/catalogo', [ProductController::class, 'catalogo'])->name('catalogo.index');

    // Punto de Venta (POS)
    Route::get('/ventas/descargar-pdf', [ReporteController::class, 'descargarVentasHoyPDF'])->name('ventas.pdf.hoy');
    Route::get('/ventas/nueva', [VentaController::class, 'create'])->name('ventas.nueva');
    Route::post('/ventas/store', [VentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/historial', [VentaController::class, 'historial'])->name('ventas.historial');
    Route::get('/ventas/mi-corte', [VentaController::class, 'miTurno'])->name('ventas.mi_corte');
});

// ==========================================
// 2. ACCESO PARA GERENTES Y ADMIN (Inventario, Cortes, Proveedores y Categorías)
// ==========================================
Route::middleware(['auth', 'rol:Gerente,Administrador'])->group(function () {
    // Reportes
    Route::get('/gerencia/reportes', [ReporteController::class, 'index'])->name('gerencia.reportes');
    Route::get('/gerencia/reportes/pdf', [ReporteController::class, 'descargarPDF'])->name('gerencia.reportes.pdf');
    Route::get('/gerencia/reportes/ventas-hoy', [ReporteController::class, 'descargarVentasHoyPDF'])->name('gerencia.reportes.ventas-hoy');
    
    // Control de Gastos
    Route::get('/gerencia/gastos', [GastoController::class, 'index'])->name('gerencia.gastos');
    Route::post('/gerencia/gastos', [GastoController::class, 'store'])->name('gerencia.gastos.store');

    // Inventario
    Route::get('/inventario', [ProductController::class, 'index'])->name('inventario.index');
    Route::get('/inventario/crear', [ProductController::class, 'create'])->name('inventario.create');
    Route::post('/inventario', [ProductController::class, 'store'])->name('inventario.store');
    Route::put('/inventario/{id}', [ProductController::class, 'update'])->name('inventario.update');
    Route::delete('/inventario/{id}', [ProductController::class, 'destroy'])->name('inventario.destroy');
    
    // Ajustes de Stock
    Route::post('/inventario/{producto}/ajustar', [ProductController::class, 'ajustarStock'])->name('inventario.ajustar');
    Route::post('/inventario/agregar', [ProductController::class, 'addStock'])->name('inventario.add'); // (Opcional)
    Route::post('/inventario/quitar', [ProductController::class, 'removeStock'])->name('inventario.remove'); // (Opcional)
    
    // Auditoría de Movimientos
    Route::get('/gerencia/movimientos', [MovimientoController::class, 'index'])->name('gerencia.movimientos');
    
    // Gestión de Cortes
    Route::get('/gerencia/cortes', [CorteCajaController::class, 'index'])->name('gerencia.cortes');
    Route::post('/gerencia/cortes', [CorteCajaController::class, 'store'])->name('gerencia.cortes.store');

    // --- MÓDULOS DELEGADOS AL GERENTE ---
    // Módulo de Proveedores
    Route::get('/admin/proveedores', [ProveedorController::class, 'index'])->name('proveedores.index');
    Route::post('/admin/proveedores', [ProveedorController::class, 'store'])->name('proveedores.store');
    Route::put('/admin/proveedores/{id}', [ProveedorController::class, 'update'])->name('proveedores.update');
    Route::patch('/admin/proveedores/{id}/toggle', [ProveedorController::class, 'toggle'])->name('proveedores.toggle');

    // Módulo de Categorías
    Route::patch('admin/categorias/{categoria}/toggle', [CategoriaController::class, 'toggle'])->name('categorias.toggle');
    Route::resource('admin/categorias', CategoriaController::class);
});

// ==========================================
// 3. ACCESO EXCLUSIVO DE ADMIN (Gestión de TI)
// ==========================================
Route::middleware(['auth', 'rol:Administrador'])->group(function () {
    // Gestión de Usuarios
    Route::get('/admin/usuarios', [UserController::class, 'index'])->name('admin.usuarios');
    Route::post('/admin/usuarios', [UserController::class, 'store'])->name('admin.usuarios.store');
    Route::put('/admin/usuarios/{id}', [UserController::class, 'update'])->name('admin.usuarios.update');
    
    // Configuración Global
    Route::get('/configuracion', [ConfiguracionController::class, 'index'])->name('admin.configuracion.index');
    Route::post('/configuracion', [ConfiguracionController::class, 'update'])->name('admin.configuracion.update');
    
    // Respaldos de Sistema
    Route::get('/respaldo/descargar', [BackupController::class, 'download'])->name('admin.respaldo.download');
});

require __DIR__.'/auth.php';