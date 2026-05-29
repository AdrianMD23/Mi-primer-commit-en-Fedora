import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link, usePage } from '@inertiajs/react';

export default function InventarioIndex({ auth, productos, categorias, filters }) {
    const { errors, flash } = usePage().props;
    
    // ESTADOS DEL BUSCADOR
    const [search, setSearch] = useState(filters.search || '');
    const [categoriaId, setCategoriaId] = useState(filters.categoria_id || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('inventario.index'), { search, categoria_id: categoriaId }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, categoriaId]);

    // ==========================================
    // 1. LÓGICA DE EDICIÓN DE PRODUCTO
    // ==========================================
    const [editingProduct, setEditingProduct] = useState(null);
    const { data, setData, post, processing, errors: formErrors, clearErrors } = useForm({
        clave: '', nombre: '', precio_inv: '', precio_venta: '', categoria_id: '', 
        stock_minimo: '', stock_maximo: '', imagen: null, _method: 'put'
    });

    const abrirEdicion = (prod) => {
        setEditingProduct(prod);
        setData({
            clave: prod.clave, nombre: prod.nombre, 
            precio_inv: prod.precio_inv, precio_venta: prod.precio_venta, 
            categoria_id: prod.categoria_id, 
            stock_minimo: prod.stock_minimo || 0,
            stock_maximo: prod.stock_maximo || 0,
            imagen: null, _method: 'put'
        });
        clearErrors();
    };
    const submitEdicion = (e) => {
        e.preventDefault();
        post(route('inventario.update', editingProduct.id), {
            onSuccess: () => setEditingProduct(null),
        });
    };

    // ==========================================
    // 2. LÓGICA DE AJUSTE DE STOCK (Entradas/Salidas)
    // ==========================================
    const opcionesMotivo = {
        Entrada: [
            'Compra de nueva mercancía',
            'Devolución de cliente',
            'Traspaso desde otra sucursal',
            'Mercancía encontrada (sobrante)'
        ],
        Salida: [
            'Devolución a proveedor',
            'Mercancía defectuosa / Dañada',
            'Traspaso a otra sucursal',
            'Robo / Extravío',
            'Uso interno / Exhibición'
        ],
        Ajuste: [
            'Corrección de inventario (Conteo físico)',
            'Merma aceptada / Justificada'
        ]
    };

    const [adjustingStock, setAdjustingStock] = useState(null);
    const [motivoSelect, setMotivoSelect] = useState(opcionesMotivo['Entrada'][0]);

    const { data: stockData, setData: setStockData, post: postStock, processing: processingStock, errors: stockErrors, reset: resetStock } = useForm({
        tipo: 'Entrada',
        cantidad: 1,
        motivo: opcionesMotivo['Entrada'][0]
    });

    const abrirAjusteStock = (prod) => {
        setAdjustingStock(prod);
        resetStock();
        setMotivoSelect(opcionesMotivo['Entrada'][0]);
        setStockData({ tipo: 'Entrada', cantidad: 1, motivo: opcionesMotivo['Entrada'][0] });
    };

    const handleTipoStockChange = (e) => {
        const nuevoTipo = e.target.value;
        const primerMotivo = opcionesMotivo[nuevoTipo][0];
        setMotivoSelect(primerMotivo);
        setStockData({ ...stockData, tipo: nuevoTipo, motivo: primerMotivo });
    };

    const handleMotivoSelectChange = (e) => {
        const val = e.target.value;
        setMotivoSelect(val);
        if (val !== 'Otro') {
            setStockData('motivo', val);
        } else {
            setStockData('motivo', '');
        }
    };

    const submitAjusteStock = (e) => {
        e.preventDefault();
        postStock(route('inventario.ajustar', adjustingStock.id), {
            onSuccess: () => setAdjustingStock(null),
        });
    };

    // ==========================================
    // 3. LÓGICA DE BORRADO
    // ==========================================
    const confirmarBorrado = (producto) => {
        if (confirm(`¿Estás completamente seguro de borrar "${producto.nombre}"?\n\nEsta acción no se puede deshacer y borrará también su fotografía.`)) {
            router.delete(route('inventario.destroy', producto.id), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Gestión de Almacén</span>}>
            <Head title="Inventario" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- BOTÓN VOLVER AL PANEL --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-4 sm:px-0">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Inventario General</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Consulta y gestiona las existencias de productos en tiempo real.</p>
                    </div>
                    <Link href={route('dashboard')} className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>
                
                {/* Alertas de Éxito o Error */}
                {errors?.error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <p className="font-bold tracking-wider uppercase text-red-700 text-xs mb-1">⚠️ Acción Bloqueada</p>
                        <p className="text-red-600 text-sm">{errors.error}</p>
                    </div>
                )}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm">
                        <p className="font-bold tracking-wider uppercase text-emerald-700 text-xs mb-1">✅ Éxito</p>
                        <p className="text-emerald-600 text-sm">{flash.success}</p>
                    </div>
                )}

                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center border border-gray-200">
                    <div className="relative w-full flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" placeholder="Buscar por clave o nombre..." 
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm font-medium"
                        />
                    </div>
                    
                    <select 
                        value={categoriaId} onChange={e => setCategoriaId(e.target.value)}
                        className="w-full lg:w-1/4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-[#03363D] focus:border-[#03363D] py-2.5 transition-colors text-sm font-medium"
                    >
                        <option value="">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>

                    <Link href={route('inventario.create')} 
                          className="w-full lg:w-auto bg-[#03363D] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] hover:shadow-lg transition-all flex justify-center items-center gap-2 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nueva Pieza
                    </Link>
                </div>

                {/* TABLA DE INVENTARIO */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Imagen</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Clave & Producto</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500 text-center">Stock Actual</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Categoría</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Precio Venta</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500 text-right">Acciones Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productos.data.map(prod => (
                                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            {prod.imagen ? (
                                                <img src={`/storage/${prod.imagen}`} alt={prod.nombre} className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-[#03363D]/60">{prod.clave}</span>
                                            <p className="font-bold text-[#03363D] text-sm mt-0.5">{prod.nombre}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border ${prod.stock > (prod.stock_minimo || 0) ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                {prod.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-500 text-xs">{prod.categoria?.nombre || 'N/A'}</td>
                                        <td className="px-6 py-4 font-black text-sm text-[#03363D]">
                                            ${Number(prod.precio_venta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => abrirAjusteStock(prod)} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" title="Ajustar Stock">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                                </button>
                                                <button onClick={() => abrirEdicion(prod)} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#03363D] hover:border-gray-300 transition-all shadow-sm" title="Editar Producto">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => confirmarBorrado(prod)} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm" title="Borrar Producto">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL DE EDICIÓN FLOTANTE */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-black text-[#03363D] tracking-tight">Editar Producto: <span className="text-gray-500 font-medium">{editingProduct.nombre}</span></h2>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={submitEdicion} className="space-y-5">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Fotografía del Producto</label>
                                <input type="file" accept="image/*" onChange={e => setData('imagen', e.target.files[0])}
                                       className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-all cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Clave</label>
                                    <input type="text" value={data.clave} onChange={e => setData('clave', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" required />
                                    {formErrors.clave && <p className="text-red-500 text-xs mt-1 font-bold">{formErrors.clave}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Categoría</label>
                                    <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 font-medium" required>
                                        <option value="">Selecciona una...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Nombre del Producto</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Costo de Inversión ($)</label>
                                    <input type="number" step="0.01" value={data.precio_inv} onChange={e => setData('precio_inv', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 font-medium" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Precio de Venta ($)</label>
                                    <input type="number" step="0.01" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 font-medium" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-amber-600">Alerta Mínima</label>
                                    <input type="number" min="0" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm px-4 py-2.5" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-emerald-600">Límite Máximo</label>
                                    <input type="number" min="0" value={data.stock_maximo} onChange={e => setData('stock_maximo', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm px-4 py-2.5" required />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button disabled={processing} className="w-full py-3.5 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-colors disabled:opacity-50">
                                    {processing ? 'Guardando Cambios...' : 'Actualizar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE AJUSTE DE STOCK */}
            {adjustingStock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-black text-[#03363D] tracking-tight">Ajuste de Existencias</h2>
                            <button onClick={() => setAdjustingStock(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="mb-6 text-center bg-gray-50 p-5 rounded-xl border border-gray-200">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{adjustingStock.nombre}</p>
                            <p className="text-xs font-medium text-gray-400 mt-2">Stock Actual en Sistema</p>
                            <p className="text-4xl font-black text-[#03363D] mt-1">{adjustingStock.stock}</p>
                        </div>

                        <form onSubmit={submitAjusteStock} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Tipo de Movimiento</label>
                                <select value={stockData.tipo} onChange={handleTipoStockChange} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm font-medium px-4 py-2.5" required>
                                    <option value="Entrada">Entrada (Sumar al stock)</option>
                                    <option value="Salida">Salida (Restar del stock)</option>
                                    <option value="Ajuste">Ajuste / Auditoría</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Cantidad a Procesar</label>
                                <input type="number" min="1" value={stockData.cantidad} onChange={e => setStockData('cantidad', e.target.value)} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] text-lg font-black text-center focus:ring-[#03363D] focus:border-[#03363D] py-2" required />
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Motivo de la Operación</label>
                                <select value={motivoSelect} onChange={handleMotivoSelectChange} className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm font-medium px-4 py-2.5 mb-2" required>
                                    {opcionesMotivo[stockData.tipo].map((opcion, idx) => (
                                        <option key={idx} value={opcion}>{opcion}</option>
                                    ))}
                                    <option value="Otro" className="font-bold text-gray-700">Otro motivo (Especificar)...</option>
                                </select>

                                {motivoSelect === 'Otro' && (
                                    <input type="text" value={stockData.motivo} onChange={e => setStockData('motivo', e.target.value)} placeholder="Escribe el motivo detallado..." className="w-full rounded-lg bg-white border border-gray-300 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 shadow-inner" required autoFocus />
                                )}
                            </div>
                            
                            <div className="pt-2">
                                <button disabled={processingStock} className="w-full py-3.5 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-colors disabled:opacity-50">
                                    {processingStock ? 'Procesando...' : 'Confirmar Movimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}