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
        stock_maximo: '',
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
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Gestión de Almacén</span>}>
            <Head title="Nueva Pieza" />

            <div className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* ENCABEZADO */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2 sm:px-0">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Alta de Nuevo Producto</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">Registra una nueva pieza de joyería en el inventario.</p>
                        </div>
                        <Link href={route('inventario.index')} className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                            <span>←</span> Volver al Catálogo
                        </Link>
                    </div>

                    {/* FORMULARIO */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <form onSubmit={submit} className="divide-y divide-gray-100">
                            
                            {/* SECCIÓN: Información Básica */}
                            <div className="p-6 sm:p-8">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">1</span>
                                    Información General
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Clave / SKU Único <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.clave} onChange={e => setData('clave', e.target.value)} 
                                               className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors uppercase text-sm px-4 py-2.5 font-bold" required />
                                        {errors.clave && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.clave}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Nombre Descriptivo <span className="text-red-500">*</span></label>
                                        <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} 
                                               className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" required />
                                        {errors.nombre && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.nombre}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN: Características y Medidas */}
                            <div className="p-6 sm:p-8 bg-gray-50/50">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</span>
                                    Especificaciones Técnicas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Talla / Variante</label>
                                            <label className="flex items-center cursor-pointer text-[10px] font-bold text-gray-400 hover:text-gray-600">
                                                <input type="checkbox" checked={desactivarTalla} onChange={handleTallaToggle} className="mr-2 rounded border-gray-300 text-gray-500 focus:ring-gray-500" />
                                                Marcar como Unitalla
                                            </label>
                                        </div>
                                        <input type="text" value={data.talla} onChange={e => setData('talla', e.target.value)} disabled={desactivarTalla}
                                               className={`w-full rounded-lg border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 transition-all ${desactivarTalla ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white'}`} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Peso (Gramos)</label>
                                            <label className="flex items-center cursor-pointer text-[10px] font-bold text-gray-400 hover:text-gray-600">
                                                <input type="checkbox" checked={desactivarPeso} onChange={handlePesoToggle} className="mr-2 rounded border-gray-300 text-gray-500 focus:ring-gray-500" />
                                                No aplicable
                                            </label>
                                        </div>
                                        <input type="number" step="0.01" value={data.peso_gramos} onChange={e => setData('peso_gramos', e.target.value)} disabled={desactivarPeso}
                                               className={`w-full rounded-lg border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 transition-all ${desactivarPeso ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white'}`} />
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN: Precios y Stock */}
                            <div className="p-6 sm:p-8">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">3</span>
                                    Datos Comerciales
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Costo de Inversión <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-bold">$</span>
                                            <input type="number" step="0.01" value={data.precio_inv} onChange={e => setData('precio_inv', e.target.value)} 
                                                   className="w-full pl-8 rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 font-medium" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Precio Público <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#03363D] font-bold">$</span>
                                            <input type="number" step="0.01" value={data.precio_venta} onChange={e => setData('precio_venta', e.target.value)} 
                                                   className="w-full pl-8 rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 font-black shadow-sm" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Stock Inicial <span className="text-red-500">*</span></label>
                                        <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} 
                                               className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm px-4 py-2.5 text-center font-bold" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-gray-50 border border-gray-100 rounded-xl">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-amber-600">Alerta de Stock Mínimo</label>
                                        <input type="number" value={data.stock_minimo} onChange={e => setData('stock_minimo', e.target.value)} 
                                               className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-amber-500 focus:border-amber-500 text-sm px-4 py-2.5" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-emerald-600">Límite de Stock Máximo</label>
                                        <input type="number" value={data.stock_maximo} onChange={e => setData('stock_maximo', e.target.value)} 
                                               className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-emerald-500 focus:border-emerald-500 text-sm px-4 py-2.5" required />
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN: Clasificación */}
                            <div className="p-6 sm:p-8">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">4</span>
                                    Clasificación y Proveeduría
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Categoría <span className="text-red-500">*</span></label>
                                        <select value={data.categoria_id} onChange={e => setData('categoria_id', e.target.value)} 
                                                className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm font-medium px-4 py-2.5" required>
                                            <option value="">Seleccione una categoría...</option>
                                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">Proveedor <span className="text-red-500">*</span></label>
                                        <select value={data.proveedor_id} onChange={e => setData('proveedor_id', e.target.value)} 
                                                className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] text-sm font-medium px-4 py-2.5" required>
                                            <option value="">Seleccione el proveedor...</option>
                                            {proveedores.map(prov => <option key={prov.id} value={prov.id}>{prov.nombre}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER DEL FORMULARIO: Botón Submit */}
                            <div className="p-6 sm:p-8 bg-gray-50/80 flex items-center justify-end gap-4">
                                <Link href={route('inventario.index')} className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors px-4 py-2">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} 
                                        className="px-8 py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] hover:shadow-lg transition-all disabled:opacity-50">
                                    {processing ? 'Guardando en BD...' : 'Finalizar Registro'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}