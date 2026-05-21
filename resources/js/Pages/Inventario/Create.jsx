import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, categorias, proveedores }) {
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
        stock_maximo: '', // Agregado
        categoria_id: '',
        proveedor_id: '',
        descripcion: '',
        imagen: null,
    });

    const handleTallaToggle = (e) => {
        const desactivado = e.target.checked;
        setDesactivarTalla(desactivado);
        if (desactivado) setData('talla', '');
    };

    const handlePesoToggle = (e) => {
        const desactivado = e.target.checked;
        setDesactivarPeso(desactivado);
        if (desactivado) setData('peso_gramos', '');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('inventario.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="text-stark">Registro de Nueva Pieza</span>}>
            <Head title="Nueva Pieza" />

            <div className="py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.15)] border border-jewel/30">
                        
                        <div className="flex justify-between items-center mb-8 border-b border-jewel/30 pb-4">
                            <h2 className="text-3xl font-serif italic text-stark drop-shadow-md">
                                Detalles del Producto
                            </h2>
                            <Link href={route('inventario.index')} className="text-sm font-black text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                                ← Volver al Catálogo
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Clave y Nombre */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Clave del Producto *</label>
                                    <input type="text" value={data.clave} onChange={e => setData('clave', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors uppercase" required />
                                    {errors.clave && <p className="text-fuschia text-xs mt-1 font-bold">{errors.clave}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Nombre / Título *</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                    {errors.nombre && <p className="text-fuschia text-xs mt-1 font-bold">{errors.nombre}</p>}
                                </div>
                            </div>

                            {/* Talla y Peso */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-jewel/20">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-stark/80">Talla / Variante</label>
                                        <label className="flex items-center cursor-pointer text-[10px] font-black text-stark/50 hover:text-fuschia">
                                            <input type="checkbox" checked={desactivarTalla} onChange={handleTallaToggle} className="mr-2 rounded bg-void/50 border-jewel/30 text-fuschia focus:ring-fuschia" />
                                            No aplica
                                        </label>
                                    </div>
                                    <input type="text" value={data.talla} onChange={e => setData('talla', e.target.value)} disabled={desactivarTalla}
                                           className={`w-full rounded-xl border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia ${desactivarTalla ? 'bg-void/20 opacity-50' : 'bg-void/50'}`} />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-stark/80">Peso en Gramos</label>
                                        <label className="flex items-center cursor-pointer text-[10px] font-black text-stark/50 hover:text-fuschia">
                                            <input type="checkbox" checked={desactivarPeso} onChange={handlePesoToggle} className="mr-2 rounded bg-void/50 border-jewel/30 text-fuschia focus:ring-fuschia" />
                                            No aplica
                                        </label>
                                    </div>
                                    <input type="number" step="0.01" value={data.peso_gramos} onChange={e => setData('peso_gramos', e.target.value)} disabled={desactivarPeso}
                                           className={`w-full rounded-xl border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia ${desactivarPeso ? 'bg-void/20 opacity-50' : 'bg-void/50'}`} />
                                </div>
                            </div>

                            {/* Precios y Stocks */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Costo ($)</label>
                                    <input type="number" step="0.01" value={data.precio_inv} onChange={e => setData('precio_inv', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Venta ($)</label>
                                    <input type="number" step="0.01" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Stock Inicial</label>
                                    <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Alerta Mínima</label>
                                    <input type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Límite Máximo</label>
                                    <input type="number" value={data.stock_maximo} onChange={e => setData('stock_maximo', e.target.value)} 
                                           className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required />
                                </div>
                            </div>

                            {/* Categorías y Proveedores */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Categoría</label>
                                    <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} 
                                            className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required>
                                        <option value="" className="bg-void">Seleccione...</option>
                                        {categorias.map(cat => <option key={cat.id} value={cat.id} className="bg-void">{cat.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest mb-1 text-stark/80">Proveedor</label>
                                    <select value={data.proveedor_id} onChange={e => setData('proveedor_id', e.target.value)} 
                                            className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia" required>
                                        <option value="" className="bg-void">Seleccione...</option>
                                        {proveedores.map(prov => <option key={prov.id} value={prov.id} className="bg-void">{prov.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Botón */}
                            <button type="submit" disabled={processing} 
                                    className="w-full py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] transition-all">
                                {processing ? 'Registrando...' : 'Registrar Pieza'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}