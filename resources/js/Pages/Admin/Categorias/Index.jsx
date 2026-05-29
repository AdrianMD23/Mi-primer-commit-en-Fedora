import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, Link, usePage } from '@inertiajs/react';

export default function CategoriasIndex({ auth, categorias, filters }) {
    const { flash } = usePage().props;
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
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({ nombre: '' });

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
        if (confirm(`¿Confirmas que deseas ${cat.activo ? 'inhabilitar' : 'habilitar'} "${cat.nombre}"?`)) {
            router.patch(route('categorias.toggle', cat.id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Administración de Catálogo</span>}>
            <Head title="Categorías" />

            <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2 sm:px-0">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Gestión de Categorías</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Clasificación de productos para el sistema.</p>
                    </div>
                    <Link href={route('dashboard')} className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center gap-3">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span className="font-medium text-sm text-emerald-700">{flash.success}</span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center border border-gray-200">
                    <div className="relative w-full flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" placeholder="Buscar categoría..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm font-medium" />
                    </div>
                    <button onClick={abrirModalNuevo} className="w-full sm:w-auto bg-[#03363D] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-all flex justify-center items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nueva Categoría
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Nombre</th>
                                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500 text-right">Estatus / Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {listaCategorias.length === 0 ? (
                                <tr><td colSpan="2" className="text-center py-10 font-bold text-gray-400 italic">No se encontraron categorías.</td></tr>
                            ) : (
                                listaCategorias.map(cat => (
                                    <tr key={cat.id} className={`group hover:bg-gray-50 transition-colors ${cat.activo ? '' : 'opacity-60 bg-gray-50/50'}`}>
                                        <td className="px-6 py-5 font-bold text-[#03363D] text-sm">
                                            {cat.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <span className={`mr-4 text-[10px] font-black uppercase tracking-widest ${cat.activo ? 'text-emerald-600' : 'text-red-400'}`}>
                                                    {cat.activo ? 'Activa' : 'Inactiva'}
                                                </span>
                                                <button onClick={() => abrirModalEditar(cat)} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#03363D] hover:border-gray-300 transition-all shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100" title="Editar">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button onClick={() => cambiarEstatus(cat)} className={`p-2 border rounded-lg transition-all shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 ${cat.activo ? 'bg-white text-red-500 border-red-200 hover:bg-red-50' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`} title={cat.activo ? "Inhabilitar" : "Habilitar"}>
                                                    {cat.activo ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
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

            {/* MODAL CORPORATIVO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-black text-[#03363D] tracking-tight">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Nombre de la Categoría *</label>
                                <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} 
                                       className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 font-medium" placeholder="Ej. Anillos, Pulseras..." required />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.nombre}</p>}
                            </div>
                            <button disabled={processing} className="w-full mt-6 py-3.5 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-all disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}