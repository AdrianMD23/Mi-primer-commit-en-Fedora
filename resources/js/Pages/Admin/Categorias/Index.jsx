import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link, usePage } from '@inertiajs/react';

export default function CategoriasIndex({ auth, categorias, filters }) {
    const { flash } = usePage().props;
    
    // RED DE SEGURIDAD
    const listaCategorias = categorias?.data || categorias || [];
    
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('categorias.index'), { search }, { preserveState: true, replace: true });
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: ''
    });

    const abrirModalNuevo = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const abrirModalEditar = (cat) => {
        setEditingId(cat.id);
        setData({ nombre: cat.nombre || '' });
        clearErrors();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('categorias.update', editingId), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('categorias.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const cambiarEstatus = (cat) => {
        const accion = cat.activo ? 'inhabilitar' : 'habilitar';
        if (confirm(`¿Estás seguro de ${accion} la categoría "${cat.nombre}"?`)) {
            router.patch(route('categorias.toggle', cat.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Gestión de Categorías</span>}>
            <Head title="Categorías" />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* BOTÓN VOLVER */}
                <div className="flex justify-end mb-6">
                    <Link href={route('dashboard')} className="text-stark/60 font-bold text-sm hover:text-fuschia transition-colors flex items-center gap-2 uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                {/* ALERTAS ESTILO NEÓN */}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] font-bold tracking-wider">
                        <span className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">✅</span> {flash.success}
                    </div>
                )}

                {/* BARRA SUPERIOR: BUSCADOR Y BOTÓN NUEVO (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] mb-8 flex flex-col sm:flex-row gap-4 items-center border border-jewel/30">
                    <input 
                        type="text" placeholder="🔍 Buscar categoría..." 
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia py-3 text-lg font-bold placeholder-stark/30 transition-colors"
                    />
                    <button onClick={abrirModalNuevo} className="w-full sm:w-auto bg-gradient-to-r from-jewel to-fuschia text-stark px-8 py-3 rounded-xl font-black text-lg shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2 whitespace-nowrap uppercase tracking-wider">
                        ➕ Nueva Categoría
                    </button>
                </div>

                {/* TABLA (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] overflow-hidden border border-jewel/20">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead className="bg-gradient-to-r from-void to-jewel/20 border-b border-jewel/30 text-stark/70">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Nombre de la Categoría</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stark/5">
                            {listaCategorias.length === 0 ? (
                                <tr><td colSpan="2" className="text-center py-10 font-bold text-stark/50 italic">No se encontraron categorías.</td></tr>
                            ) : (
                                listaCategorias.map(cat => (
                                    <tr key={cat.id} className={`transition-colors ${cat.activo ? 'hover:bg-fuschia/10 text-stark' : 'bg-void/40 text-stark/40'}`}>
                                        <td className="px-6 py-4">
                                            <span className="font-black text-lg block drop-shadow-sm">{cat.nombre}</span>
                                            {!cat.activo && (
                                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest mt-2 inline-block">
                                                    Inactiva
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-3">
                                                {/* BOTÓN EDITAR */}
                                                <button onClick={() => abrirModalEditar(cat)} className="px-4 py-2 bg-white/5 text-stark border border-stark/20 rounded-lg font-bold shadow-sm hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_15px_rgba(162,57,202,0.5)] transition-all duration-300" title="Editar">
                                                    ✏️
                                                </button>
                                                {/* BOTÓN INTERRUPTOR (Habilitar/Deshabilitar) */}
                                                <button 
                                                    onClick={() => cambiarEstatus(cat)} 
                                                    className={`px-4 py-2 border rounded-lg font-bold shadow-sm transition-all duration-300 ${
                                                        cat.activo 
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-void hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-void hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                                    }`}
                                                    title={cat.activo ? "Inhabilitar" : "Habilitar"}
                                                >
                                                    {cat.activo ? '🚫' : '✅'}
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
                    <div className="bg-void border border-jewel/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.2)] w-full max-w-md">
                        <div className="flex justify-between items-center mb-6 border-b border-stark/10 pb-4">
                            <h2 className="text-2xl font-serif italic text-stark drop-shadow-md">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-stark font-black text-xl hover:text-fuschia transition-colors">✕</button>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">Nombre de la Categoría *</label>
                                <input 
                                    type="text" 
                                    value={data.nombre} 
                                    onChange={e => setData('nombre', e.target.value)} 
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors placeholder-stark/30 py-3" 
                                    placeholder="Ej. Anillos, Pulseras..." 
                                    required 
                                />
                                {errors.nombre && <p className="text-fuschia text-xs mt-1 font-bold drop-shadow-sm">{errors.nombre}</p>}
                            </div>
                            
                            <button disabled={processing} className="w-full mt-8 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}