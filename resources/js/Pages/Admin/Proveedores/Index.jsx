import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link, usePage } from '@inertiajs/react';

export default function ProveedoresIndex({ auth, proveedores, filters }) {
    const { flash, errors: pageErrors } = usePage().props;
    
    // RED DE SEGURIDAD: Detecta si es paginación (.data) o arreglo normal
    const listaProveedores = proveedores?.data || proveedores || [];
    
    // Buscador
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('proveedores.index'), { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Formulario y Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '', contacto: '', telefono: '', email: '', direccion: '', tipo_mercancia: '', notas: ''
    });

    const abrirModalNuevo = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const abrirModalEditar = (prov) => {
        setEditingId(prov.id);
        setData({
            nombre: prov.nombre || '', contacto: prov.contacto || '', 
            telefono: prov.telefono || '', email: prov.email || '', 
            direccion: prov.direccion || '', tipo_mercancia: prov.tipo_mercancia || '', notas: prov.notas || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('proveedores.update', editingId), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('proveedores.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const cambiarEstatus = (prov) => {
        const accion = prov.activo ? 'inhabilitar' : 'habilitar';
        if (confirm(`¿Estás seguro de ${accion} a "${prov.nombre}"?`)) {
            router.patch(route('proveedores.toggle', prov.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Directorio de Proveedores</span>}>
            <Head title="Proveedores" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* BOTÓN VOLVER AL PANEL */}
                <div className="flex justify-end mb-6">
                    <Link href={route('dashboard')} className="text-stark/60 font-bold text-sm hover:text-fuschia transition-colors flex items-center gap-2 uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                {/* ALERTAS */}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-900/30 border-l-4 border-emerald-500 text-emerald-200 p-4 rounded shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold tracking-wider">
                        <span className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">✅</span> {flash.success}
                    </div>
                )}

                {/* BARRA SUPERIOR: BUSCADOR Y BOTÓN NUEVO (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] mb-8 flex flex-col lg:flex-row gap-4 items-center border border-jewel/30">
                    <input 
                        type="text" placeholder="🔍 Buscar por nombre, contacto o mercancía..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia py-3 text-lg font-bold placeholder-stark/30 transition-colors"
                    />
                    <button onClick={abrirModalNuevo} className="w-full lg:w-auto bg-gradient-to-r from-jewel to-fuschia text-stark px-8 py-3 rounded-xl font-black text-lg shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 whitespace-nowrap uppercase tracking-wider">
                        ➕ Nuevo Proveedor
                    </button>
                </div>

                {/* TABLA (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] overflow-hidden border border-jewel/20">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead className="bg-gradient-to-r from-void to-jewel/20 border-b border-jewel/30 text-stark/70">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Taller / Mayorista</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Contacto</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Teléfono</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Tipo de Mercancía</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stark/5">
                            {listaProveedores.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 font-bold text-stark/50 italic">No se encontraron proveedores.</td></tr>
                            ) : (
                                listaProveedores.map(prov => (
                                    <tr key={prov.id} className={`hover:bg-fuschia/10 transition-colors ${prov.activo ? 'text-stark' : 'text-stark/40'}`}>
                                        <td className="px-6 py-4 font-black text-base drop-shadow-sm">
                                            {prov.nombre}
                                            {!prov.activo && <span className="block text-[9px] uppercase tracking-widest text-red-400 mt-1">Inhabilitado</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold opacity-80">{prov.contacto || '-'}</td>
                                        <td className="px-6 py-4 font-bold">{prov.telefono || '-'}</td>
                                        <td className="px-6 py-4">
                                            {/* Etiqueta estilo neón */}
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${prov.activo ? 'bg-jewel/20 text-[#8B5CF6] border-jewel/50 shadow-[0_0_10px_rgba(71,23,246,0.2)]' : 'bg-stark/5 text-stark/50 border-stark/20'}`}>
                                                {prov.tipo_mercancia || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => abrirModalEditar(prov)} className="px-3 py-2 bg-white/10 text-stark border border-stark/30 rounded-lg font-bold shadow-sm hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_15px_rgba(162,57,202,0.5)] transition-all duration-300" title="Editar">
                                                    ✏️
                                                </button>
                                                {/* BOTÓN DE INTERRUPTOR NEÓN */}
                                                <button 
                                                    onClick={() => cambiarEstatus(prov)} 
                                                    className={`px-3 py-2 border rounded-lg font-bold shadow-sm transition-all duration-300 ${prov.activo ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500 hover:text-void hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500 hover:text-void hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
                                                    title={prov.activo ? "Inhabilitar Proveedor" : "Habilitar Proveedor"}
                                                >
                                                    {prov.activo ? '🚫' : '✅'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL CREAR / EDITAR (Cristal Oscuro) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-void border border-jewel/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.2)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-stark/10 pb-4">
                            <h2 className="text-2xl font-serif italic text-stark drop-shadow-md">{editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stark font-black text-xl hover:text-fuschia transition-colors">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Empresa / Taller *</label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" required />
                                    {errors.nombre && <p className="text-fuschia text-xs mt-1 font-bold">{errors.nombre}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Persona de Contacto</label>
                                    <input type="text" value={data.contacto} onChange={e => setData('contacto', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Teléfono</label>
                                    <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Tipo de Mercancía</label>
                                    <input type="text" placeholder="Ej. Plata, Relojes..." value={data.tipo_mercancia} onChange={e => setData('tipo_mercancia', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors placeholder-stark/30" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Correo Electrónico</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Dirección</label>
                                    <input type="text" value={data.direccion} onChange={e => setData('direccion', e.target.value)} className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Notas Adicionales</label>
                                    <textarea value={data.notas} onChange={e => setData('notas', e.target.value)} rows="2" className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors"></textarea>
                                </div>
                            </div>
                            
                            <button disabled={processing} className="w-full mt-6 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar Proveedor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}