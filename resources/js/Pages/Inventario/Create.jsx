import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, categorias, proveedores }) {
    // 1. Estados para controlar si se desactivan Talla y Peso
    // Falso significa que NO están desactivados (es decir, se pueden usar por defecto)
    const [desactivarTalla, setDesactivarTalla] = useState(false);
    const [desactivarPeso, setDesactivarPeso] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        clave: '',
        nombre: '',
        talla: '',
        peso_gramos: '',
        precio_inv: '',
        precio_venta: '',
        stock: '',
        stock_minimo: '1',
        categoria_id: '', // <-- CAMBIO AQUÍ
        proveedor_id: '', // <-- CAMBIO AQUÍ
        descripcion: '',
    });

    // Función para manejar el checkbox de Talla
    const handleTallaToggle = (e) => {
        const desactivado = e.target.checked;
        setDesactivarTalla(desactivado);
        if (desactivado) {
            setData('talla', ''); // Limpiamos el valor si se desactiva
        }
    };

    // Función para manejar el checkbox de Peso
    const handlePesoToggle = (e) => {
        const desactivado = e.target.checked;
        setDesactivarPeso(desactivado);
        if (desactivado) {
            setData('peso_gramos', ''); // Limpiamos el valor si se desactiva
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('inventario.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Registro de Nueva Pieza</span>}>
            <Head title="Nueva Pieza" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-2xl sm:rounded-2xl p-8" style={{ backgroundColor: '#e8dcc8' }}>
                        
                        <div className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: '#4a0e2e' }}>
                            <h2 className="text-3xl font-serif italic" style={{ color: '#4a0e2e' }}>
                                Detalles del Producto
                            </h2>
                            <Link href={route('inventario.index')} className="text-sm font-bold hover:underline" style={{ color: '#4a0e2e' }}>
                                ← Volver al Catálogo
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Fila 1: Clave y Nombre */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Clave del Producto *</label>
                                    <input type="text" value={data.clave} onChange={e => setData('clave', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e] uppercase" required />
                                    {errors.clave && <p className="text-red-600 text-xs mt-1 font-bold">{errors.clave}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Nombre / Título *</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required />
                                    {errors.nombre && <p className="text-red-600 text-xs mt-1 font-bold">{errors.nombre}</p>}
                                </div>
                            </div>

                            {/* Fila 2: Talla y Peso con Checkboxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 p-4 rounded-xl border border-[#4a0e2e]/20">
                                {/* Sección Talla */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold" style={{ color: '#4a0e2e' }}>Talla / Variante</label>
                                        <label className="flex items-center cursor-pointer text-xs font-bold text-gray-600 hover:text-gray-900">
                                            <input type="checkbox" checked={desactivarTalla} onChange={handleTallaToggle} 
                                                   className="mr-2 rounded text-[#4a0e2e] focus:ring-[#4a0e2e]" />
                                            No aplica
                                        </label>
                                    </div>
                                    <input type="text" placeholder="Ej. Unitalla, M, #7" 
                                           value={data.talla} 
                                           onChange={e => setData('talla', e.target.value)} 
                                           disabled={desactivarTalla}
                                           className={`w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e] transition-all
                                                      ${desactivarTalla ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-white'}`} />
                                </div>

                                {/* Sección Peso */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold" style={{ color: '#4a0e2e' }}>Peso en Gramos (Plata)</label>
                                        <label className="flex items-center cursor-pointer text-xs font-bold text-gray-600 hover:text-gray-900">
                                            <input type="checkbox" checked={desactivarPeso} onChange={handlePesoToggle} 
                                                   className="mr-2 rounded text-[#4a0e2e] focus:ring-[#4a0e2e]" />
                                            No aplica
                                        </label>
                                    </div>
                                    <input type="number" step="0.01" placeholder="Ej. 12.50" 
                                           value={data.peso_gramos} 
                                           onChange={e => setData('peso_gramos', e.target.value)} 
                                           disabled={desactivarPeso}
                                           className={`w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e] transition-all
                                                      ${desactivarPeso ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-white'}`} />
                                </div>
                            </div>

                            {/* Fila 3: Precios */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Costo de Inversión ($) *</label>
                                    <input type="number" step="0.01" value={data.precio_inv} onChange={e => setData('precio_inv', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required />
                                    {errors.precio_inv && <p className="text-red-600 text-xs mt-1 font-bold">{errors.precio_inv}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Precio de Venta ($) *</label>
                                    <input type="number" step="0.01" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required />
                                    {errors.precio_venta && <p className="text-red-600 text-xs mt-1 font-bold">{errors.precio_venta}</p>}
                                </div>
                            </div>

                            {/* Fila 4: Stocks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Stock Inicial *</label>
                                    <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required />
                                    {errors.stock && <p className="text-red-600 text-xs mt-1 font-bold">{errors.stock}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Alerta de Stock Mínimo *</label>
                                    <input type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} 
                                           className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required />
                                </div>
                            </div>

                          {/* Fila 5: Relaciones (Cat y Prov) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold" style={{ color: '#4a0e2e' }}>Categoría *</label>
                                        <Link href="/admin/categorias" className="text-xs font-bold hover:underline" style={{ color: '#bc430d' }}>+ Crear Nueva</Link>
                                    </div>
                                    <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} 
                                            className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required>
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map(cat => (
                                            
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.categoria_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.categoria_id}</p>}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-bold" style={{ color: '#4a0e2e' }}>Proveedor *</label>
                                        <Link href="/admin/proveedores" className="text-xs font-bold hover:underline" style={{ color: '#bc430d' }}>+ Crear Nuevo</Link>
                                    </div>
                                    <select value={data.proveedor_id} onChange={e => setData('proveedor_id', e.target.value)} 
                                            className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]" required>
                                        <option value="">Seleccione un proveedor</option>
                                        {proveedores.map(prov => (
                                            
                                           <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                                        ))}
                                    </select>
                                    {errors.proveedor_id && <p className="text-red-600 text-xs mt-1 font-bold">{errors.proveedor_id}</p>}
                                </div>
                            </div>
                            {/* Fila 6: Descripción */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Descripción Corta</label>
                                <textarea value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} rows="3"
                                          className="w-full rounded-lg border-gray-400 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"></textarea>
                            </div>

                            {/* Botón Guardar */}
                            <div className="flex justify-end pt-6">
                                <button type="submit" disabled={processing} 
                                        className="px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                                        style={{ backgroundColor: '#4a0e2e', color: '#e8dcc8' }}>
                                    {processing ? 'Guardando...' : 'Registrar Pieza'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}