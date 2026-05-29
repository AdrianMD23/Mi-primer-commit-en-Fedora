import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function UsuariosIndex({ auth, usuarios }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    }, [flash]);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'Vendedor',
    });

    const iniciarEdicion = (user) => {
        setEditingId(user.id);
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            password: '', 
        });
        clearErrors();
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.usuarios.update', editingId), {
                onSuccess: () => cancelarEdicion(),
            });
        } else {
            post(route('admin.usuarios.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    // Diseño Corporativo para Roles
    const getRoleBadge = (rol) => {
        switch(rol) {
            case 'Administrador': return 'bg-[#03363D] text-white border-transparent shadow-sm';
            case 'Gerente': return 'bg-[#174D4D]/10 text-[#174D4D] border-[#174D4D]/20';
            case 'Vendedor': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Recursos Humanos</span>}>
            <Head title="Gestión de Usuarios" />

            {/* Modal Flotante de Éxito (SaaS Formal) */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-gray-100 animate-[pulse_0.3s_ease-out]">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-black text-[#03363D] mb-2 tracking-tight">¡Operación Exitosa!</h2>
                        <p className="text-gray-500 text-sm mb-6 font-medium">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full px-4 py-3 bg-[#03363D] text-white hover:bg-[#174D4D] transition-colors rounded-xl font-bold text-xs uppercase tracking-widest shadow-md">
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            <div className="py-10 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* CABECERA LIBRE */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-4 sm:px-0">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Control de Accesos</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Administra el personal, roles y permisos del sistema.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* FORMULARIO DINÁMICO */}
                    <div className={`p-6 sm:p-8 rounded-2xl shadow-sm h-fit bg-white border-t-4 transition-all duration-300 ${editingId ? 'border-t-[#174D4D] border-x border-b border-gray-200' : 'border-t-gray-200 border-x border-b border-gray-200'}`}>
                        <h3 className="text-lg font-black mb-6 border-b border-gray-100 pb-4 text-[#03363D] tracking-tight flex items-center gap-2">
                            {editingId ? (
                                <>
                                    <svg className="w-5 h-5 text-[#174D4D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    Editar Empleado
                                </>
                            ) : 'Crear Nueva Cuenta'}
                        </h3>
                        
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Nombre Completo <span className="text-red-500">*</span></label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                       className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-all text-sm px-4 py-2.5" required />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Usuario (Login) <span className="text-red-500">*</span></label>
                                <input type="text" value={data.username} onChange={e => setData('username', e.target.value)}
                                       className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-all text-sm px-4 py-2.5 placeholder-gray-400" 
                                       placeholder="Ej. miguel_vendedor" required />
                                {errors.username && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.username}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Correo Electrónico <span className="text-red-500">*</span></label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                       className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-all text-sm px-4 py-2.5" required />
                                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                                    <span>Contraseña <span className="text-red-500">*</span></span>
                                    {editingId && <span className="bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-[8px]">Opcional al editar</span>}
                                </label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                       className="w-full rounded-lg bg-[#F8F9F9] border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] transition-all text-sm px-4 py-2.5 placeholder-gray-400" 
                                       required={!editingId} placeholder="Mínimo 8 caracteres" />
                                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Nivel de Permisos <span className="text-red-500">*</span></label>
                                <select value={data.role} onChange={e => setData('role', e.target.value)}
                                        className="w-full rounded-lg bg-white border border-gray-200 text-[#03363D] focus:ring-[#03363D] focus:border-[#03363D] font-bold text-sm px-4 py-2.5 shadow-sm">
                                    <option value="Vendedor">Vendedor (Punto de Venta)</option>
                                    <option value="Gerente">Gerente (Reportes y Cortes)</option>
                                    <option value="Administrador">Administrador (Acceso Total)</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.role}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                {editingId && (
                                    <button type="button" onClick={cancelarEdicion} className="w-1/3 py-3 rounded-xl font-bold bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 text-xs transition-colors">
                                        Cancelar
                                    </button>
                                )}
                                <button disabled={processing} className={`${editingId ? 'w-2/3' : 'w-full'} py-3 rounded-xl font-black text-xs transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2 ${editingId ? 'bg-[#174D4D] text-white hover:bg-[#03363D]' : 'bg-[#03363D] text-white hover:bg-[#174D4D]'}`}>
                                    {processing ? 'Guardando...' : (editingId ? 'Actualizar Datos' : 'Registrar Usuario')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LISTA DE EMPLEADOS */}
                    <div className="lg:col-span-2 overflow-hidden shadow-sm rounded-2xl bg-white border border-gray-200 flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-black text-[#03363D] tracking-tight">Nómina del Sistema</h3>
                            <p className="text-xs text-gray-500 mt-1">Directorio de usuarios autorizados en la plataforma.</p>
                        </div>
                        
                        <div className="overflow-x-auto flex-grow">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">ID</th>
                                        <th className="px-6 py-4 font-black text-gray-400 uppercase tracking-widest text-[10px]">Empleado</th>
                                        <th className="px-6 py-4 font-black text-gray-400 text-center uppercase tracking-widest text-[10px]">Rol / Permiso</th>
                                        <th className="px-6 py-4 font-black text-gray-400 text-right uppercase tracking-widest text-[10px]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {usuarios.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-5 font-bold text-gray-400 text-xs">
                                                #{String(user.id).padStart(3, '0')}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-[#03363D]">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-medium mt-0.5">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {/* BOTÓN INTELIGENTE (Surprise Hover Effect) */}
                                                <button onClick={() => iniciarEdicion(user)} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm font-bold text-xs text-gray-500 hover:bg-[#03363D] hover:border-[#03363D] hover:text-white transition-all duration-300 group-hover:border-gray-300">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    <span className="hidden sm:inline">Editar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}