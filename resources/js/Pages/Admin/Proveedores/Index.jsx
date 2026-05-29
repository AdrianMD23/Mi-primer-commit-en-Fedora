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
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Directorio Corporativo</span>}>
            <Head title="Proveedores" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA LIBRE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2 sm:px-0">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Gestión de Proveedores</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Directorio oficial de mayoristas, talleres y socios comerciales.</p>
                    </div>
                    <Link href={route('dashboard')} className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                {/* ALERTAS */}
                {flash?.success && (
                    <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center gap-3">
                        <div className="text-emerald-500 font-black">✓</div>
                        <div className="font-medium text-sm text-emerald-700">{flash.success}</div>
                    </div>
                )}

                {/* BARRA SUPERIOR: BUSCADOR Y BOTÓN NUEVO */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center border border-gray-200">
                    <div className="relative w-full flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" placeholder="Buscar por empresa, contacto o mercancía..." 
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm font-medium"
                        />
                    </div>
                    
                    <button onClick={abrirModalNuevo} className="w-full lg:w-auto bg-[#03363D] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] hover:shadow-lg transition-all flex justify-center items-center gap-2 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Nuevo Proveedor
                    </button>
                </div>

                {/* TABLA DE PROVEEDORES */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Taller / Empresa</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Contacto Directo</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500">Categoría Comercial</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-gray-500 text-right">Estatus / Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {listaProveedores.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-10 font-bold text-gray-400 italic">No se encontraron registros de proveedores.</td></tr>
                                ) : (
                                    listaProveedores.map(prov => (
                                        <tr key={prov.id} className={`hover:bg-gray-50 transition-colors group ${prov.activo ? '' : 'opacity-60 bg-gray-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <div className={`font-bold text-sm ${prov.activo ? 'text-[#03363D]' : 'text-gray-500 line-through'}`}>
                                                    {prov.nombre}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                                                    {prov.telefono && <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> {prov.telefono}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-700">{prov.contacto || <span className="text-gray-300 italic">No especificado</span>}</div>
                                                {prov.email && <div className="text-xs text-gray-500 mt-0.5">{prov.email}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${prov.activo ? 'bg-[#174D4D]/10 text-[#174D4D] border-[#174D4D]/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                    {prov.tipo_mercancia || 'General'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    
                                                    {/* Badge de Estatus visual (Solo texto) */}
                                                    <span className={`mr-4 text-[10px] font-black uppercase tracking-widest ${prov.activo ? 'text-emerald-500' : 'text-red-400'}`}>
                                                        {prov.activo ? 'Activo' : 'Inhabilitado'}
                                                    </span>

                                                    {/* Botones de acción fantasma */}
                                                    <button onClick={() => abrirModalEditar(prov)} className="p-2 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#03363D] hover:border-gray-300 transition-all shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100" title="Editar Proveedor">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => cambiarEstatus(prov)} 
                                                        className={`p-2 border rounded-lg transition-all shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 ${prov.activo ? 'bg-white text-red-500 border-red-200 hover:bg-red-50' : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`}
                                                        title={prov.activo ? "Suspender Proveedor" : "Reactivar Proveedor"}
                                                    >
                                                        {prov.activo ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        )}
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
            </div>

            {/* MODAL CREAR / EDITAR CORPORATIVO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-black text-[#03363D] tracking-tight flex items-center gap-2">
                                {editingId ? (
                                    <><svg className="w-5 h-5 text-[#174D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Actualizar Registro</>
                                ) : (
                                    <><svg className="w-5 h-5 text-[#174D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> Nuevo Proveedor Comercial</>
                                )}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Razón Social / Empresa <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} 
                                           className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 font-bold" required />
                                    {errors.nombre && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.nombre}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Agente / Contacto</label>
                                    <input type="text" value={data.contacto} onChange={e => setData('contacto', e.target.value)} 
                                           className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Teléfono Directo</label>
                                    <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value)} 
                                           className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Clasificación de Mercancía</label>
                                    <input type="text" placeholder="Ej. Platería, Relojería, Empaques..." value={data.tipo_mercancia} onChange={e => setData('tipo_mercancia', e.target.value)} 
                                           className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5 placeholder-gray-400" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Correo Electrónico (Ventas)</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} 
                                           className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Dirección / Ubicación Física</label>
                                    <input type="text" value={data.direccion} onChange={e => setData('direccion', e.target.value)} 
                                           className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Notas u Observaciones</label>
                                    <textarea value={data.notas} onChange={e => setData('notas', e.target.value)} rows="2" 
                                              className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-colors text-sm px-4 py-2.5"></textarea>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 py-3 rounded-xl font-bold bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 text-xs transition-colors">
                                    Cancelar
                                </button>
                                <button disabled={processing} className="w-2/3 py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] hover:shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                                    {processing ? 'Guardando...' : (editingId ? 'Actualizar Expediente' : 'Registrar Proveedor')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}