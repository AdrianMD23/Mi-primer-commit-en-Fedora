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
        clave: '', nombre: '', precio_inv: '', precio_venta: '', categoria_id: '', imagen: null, _method: 'put'
    });

    const abrirEdicion = (prod) => {
        setEditingProduct(prod);
        setData({
            clave: prod.clave, nombre: prod.nombre, 
            precio_inv: prod.precio_inv, precio_venta: prod.precio_venta, 
            categoria_id: prod.categoria_id, imagen: null, _method: 'put'
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
        <AuthenticatedLayout user={auth.user} header={<span>Gestión de Almacén</span>}>
            <Head title="Inventario" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- BOTÓN VOLVER AL PANEL --- */}
                <div className="flex justify-end mb-6">
                    <Link href={route('dashboard')} className="text-stark/60 font-bold text-sm hover:text-fuschia transition-colors flex items-center gap-2 uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>
                {/* ----------------------------- */}
                
                {/* Alertas de Éxito o Error (Estilo Dark/Neon) */}
                {errors?.error && (
                    <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 text-red-200 p-4 rounded shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <p className="font-bold tracking-wider uppercase text-red-400 text-xs mb-1">⚠️ Acción Bloqueada</p>
                        <p>{errors.error}</p>
                    </div>
                )}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-200 p-4 rounded shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <p className="font-bold tracking-wider uppercase text-emerald-400 text-xs mb-1">✅ Éxito</p>
                        <p>{flash.success}</p>
                    </div>
                )}

                {/* BARRA DE BÚSQUEDA Y FILTROS (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] mb-8 flex flex-col lg:flex-row gap-4 items-center border border-jewel/30">
                    <input 
                        type="text" placeholder="🔍 Buscar por clave o nombre..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia py-3 text-lg font-bold placeholder-stark/30 transition-colors"
                    />
                    
                    <select 
                        value={categoriaId} onChange={e => setCategoriaId(e.target.value)}
                        className="w-full lg:w-1/3 rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia py-3 font-bold transition-colors"
                    >
                        <option value="" className="bg-void">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-void">{cat.nombre}</option>
                        ))}
                    </select>

                    <Link href={route('inventario.create')} 
                          className="w-full lg:w-auto bg-gradient-to-r from-jewel to-fuschia text-stark px-8 py-3 rounded-xl font-black text-lg shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 whitespace-nowrap uppercase tracking-wider">
                        ➕ Nueva Pieza
                    </Link>
                </div>

                {/* TABLA DE INVENTARIO (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] overflow-hidden border border-jewel/20">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead className="bg-gradient-to-r from-void to-jewel/20 border-b border-jewel/30 text-stark">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70">Foto</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70">Clave & Producto</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70 text-center">Stock</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70">Categoría</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70">Precio Venta</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-stark/70 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stark/5">
                            {productos.data.map(prod => (
                                <tr key={prod.id} className="hover:bg-fuschia/10 transition-colors text-stark">
                                    <td className="px-6 py-4">
                                        {prod.imagen ? (
                                            <img src={`/storage/${prod.imagen}`} alt={prod.nombre} className="w-14 h-14 object-cover rounded-lg shadow-sm border border-jewel/30" />
                                        ) : (
                                            <div className="w-14 h-14 bg-void/50 rounded-lg flex items-center justify-center text-xl shadow-inner opacity-50 border border-stark/10">📷</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-fuschia">{prod.clave}</span>
                                        <p className="font-bold text-stark text-base drop-shadow-sm">{prod.nombre}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Badge de Stock Neón */}
                                        <span className={`px-3 py-1 rounded-full font-black text-sm border ${prod.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                                            {prod.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-stark/60">{prod.categoria?.nombre || 'N/A'}</td>
                                    <td className="px-6 py-4 font-black text-lg text-jewel drop-shadow-[0_0_8px_rgba(71,23,246,0.5)]">
                                        ${Number(prod.precio_venta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => abrirAjusteStock(prod)} className="px-3 py-2 bg-jewel/20 text-stark border border-jewel/50 rounded-lg font-bold shadow-sm hover:bg-jewel hover:shadow-[0_0_15px_rgba(71,23,246,0.5)] transition-all" title="Ajustar Stock">
                                                📦
                                            </button>
                                            <button onClick={() => abrirEdicion(prod)} className="px-3 py-2 bg-white/10 text-stark border border-stark/30 rounded-lg font-bold shadow-sm hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_15px_rgba(162,57,202,0.5)] transition-all" title="Editar Producto">
                                                ✏️
                                            </button>
                                            <button onClick={() => confirmarBorrado(prod)} className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold shadow-sm hover:bg-red-500 hover:text-void hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all" title="Borrar Producto">
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* MODAL DE EDICIÓN FLOTANTE (Cristal Oscuro) */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-void border border-jewel/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.2)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-stark/10 pb-4">
                            <h2 className="text-2xl font-serif italic text-stark drop-shadow-md">Editar: {editingProduct.nombre}</h2>
                            <button onClick={() => setEditingProduct(null)} className="text-stark font-black text-xl hover:text-fuschia transition-colors">✕</button>
                        </div>

                        <form onSubmit={submitEdicion} className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl shadow-sm border border-jewel/20">
                                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-stark/80">📷 Subir Fotografía</label>
                                <input type="file" accept="image/*" onChange={e => setData('imagen', e.target.files[0])}
                                       className="w-full text-sm text-stark/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-black file:bg-jewel file:text-stark hover:file:bg-fuschia transition-all file:shadow-[0_0_10px_rgba(71,23,246,0.4)]" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Clave</label>
                                    <input type="text" value={data.clave} onChange={e => setData('clave', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                    {formErrors.clave && <p className="text-fuschia text-xs mt-1 font-bold">{formErrors.clave}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Categoría</label>
                                    <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required>
                                        <option value="" className="bg-void">Selecciona una...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id} className="bg-void">{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Nombre</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Precio Inversión ($)</label>
                                    <input type="number" step="0.01" value={data.precio_inv} onChange={e => setData('precio_inv', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Precio Venta ($)</label>
                                    <input type="number" step="0.01" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                </div>
                            </div>
                            
                            <button disabled={processing} className="w-full mt-6 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all disabled:opacity-50">
                                {processing ? 'Subiendo...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE AJUSTE DE STOCK (Cristal Oscuro) */}
            {adjustingStock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-void border border-jewel/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.2)] w-full max-w-md">
                        <div className="flex justify-between items-center mb-6 border-b border-stark/10 pb-4">
                            <h2 className="text-2xl font-serif italic text-stark drop-shadow-md">Ajuste de Stock</h2>
                            <button onClick={() => setAdjustingStock(null)} className="text-stark font-black text-xl hover:text-fuschia transition-colors">✕</button>
                        </div>

                        <div className="mb-6 text-center bg-white/5 p-4 rounded-2xl shadow-sm border border-jewel/20">
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest text-stark">{adjustingStock.nombre}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-stark/50 mt-2">Stock en Almacén</p>
                            <p className="text-5xl font-black text-fuschia drop-shadow-[0_0_10px_rgba(162,57,202,0.5)]">{adjustingStock.stock}</p>
                        </div>

                        <form onSubmit={submitAjusteStock} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Tipo de Movimiento</label>
                                <select value={stockData.tipo} onChange={handleTipoStockChange} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia font-bold transition-colors" required>
                                    <option value="Entrada" className="bg-void">📥 Entrada (Agregar)</option>
                                    <option value="Salida" className="bg-void">📤 Salida (Retiro)</option>
                                    <option value="Ajuste" className="bg-void">⚠️ Ajuste (Merma)</option>
                                </select>
                                {stockErrors.tipo && <p className="text-fuschia text-xs mt-1 font-bold">{stockErrors.tipo}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Cantidad a Mover</label>
                                <input type="number" min="1" value={stockData.cantidad} onChange={e => setStockData('cantidad', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-fuschia text-xl font-black text-center focus:ring-fuschia focus:border-fuschia transition-colors shadow-inner" required />
                                {stockErrors.cantidad && <p className="text-fuschia text-xs mt-1 font-bold">{stockErrors.cantidad}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Motivo de la Auditoría</label>
                                
                                <select 
                                    value={motivoSelect} 
                                    onChange={handleMotivoSelectChange} 
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia font-bold mb-2 transition-colors" 
                                    required
                                >
                                    {opcionesMotivo[stockData.tipo].map((opcion, idx) => (
                                        <option key={idx} value={opcion} className="bg-void">{opcion}</option>
                                    ))}
                                    <option value="Otro" className="font-black bg-void">📝 Otro motivo...</option>
                                </select>

                                {motivoSelect === 'Otro' && (
                                    <input 
                                        type="text" 
                                        value={stockData.motivo} 
                                        onChange={e => setStockData('motivo', e.target.value)} 
                                        placeholder="Escribe el motivo..." 
                                        className="w-full rounded-xl bg-void/50 border border-fuschia text-stark focus:ring-fuschia focus:border-fuschia transition-all shadow-inner" 
                                        required 
                                        autoFocus
                                    />
                                )}
                                
                                {stockErrors.motivo && <p className="text-fuschia text-xs mt-1 font-bold">{stockErrors.motivo}</p>}
                            </div>
                            
                            <button disabled={processingStock} className="w-full mt-6 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all disabled:opacity-50">
                                {processingStock ? 'Registrando...' : 'Confirmar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}