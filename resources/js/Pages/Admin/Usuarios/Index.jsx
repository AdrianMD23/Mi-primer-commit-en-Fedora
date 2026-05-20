import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function UsuariosIndex({ auth, usuarios }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Estado para saber si estamos editando a alguien o creando uno nuevo
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

    // Función que se activa al presionar el botón Editar en la tabla
    const iniciarEdicion = (user) => {
        setEditingId(user.id);
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            password: '', // Dejamos la contraseña en blanco por seguridad
        });
        clearErrors();
    };

    // Función para cancelar la edición y volver a modo "Crear"
    const cancelarEdicion = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    // Al darle click a Guardar
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

    // Etiquetas estilo Neón para los roles
    const getRoleBadge = (rol) => {
        switch(rol) {
            case 'Administrador': return 'bg-fuschia/20 text-fuschia border-fuschia/50 shadow-[0_0_10px_rgba(162,57,202,0.4)]';
            case 'Gerente': return 'bg-jewel/20 text-[#8B5CF6] border-jewel/50 shadow-[0_0_10px_rgba(71,23,246,0.4)]';
            case 'Vendedor': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Recursos Humanos</span>}>
            <Head title="Gestión de Usuarios" />

            {/* Modal Flotante de Éxito (Estilo Hacker/Neón) */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-void p-8 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)] text-center max-w-sm border border-emerald-500/40 animate-[bounce_0.5s_ease-in-out]">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-emerald-500/50">✓</div>
                        <h2 className="text-3xl font-serif italic text-stark mb-2 drop-shadow-md">¡Operación Exitosa!</h2>
                        <p className="text-stark/70 font-bold mb-6">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full px-6 py-3 bg-emerald-500 text-void hover:bg-emerald-400 transition-colors rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-serif italic text-stark drop-shadow-lg">Control de Accesos</h2>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia hover:underline transition-colors uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* FORMULARIO DINÁMICO (Cristal Oscuro) */}
                    <div className={`p-8 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] h-fit border border-t-4 bg-white/5 backdrop-blur-md transition-colors duration-500 ${editingId ? 'border-fuschia/60 border-t-fuschia shadow-[0_0_30px_rgba(162,57,202,0.2)]' : 'border-jewel/30 border-t-jewel'}`}>
                        <h3 className="text-2xl font-serif italic mb-6 border-b border-stark/10 pb-4 text-stark">
                            {editingId ? 'Editar Empleado' : 'Crear Nueva Cuenta'}
                        </h3>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Nombre Completo *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia placeholder-stark/30 transition-colors" required />
                                {errors.name && <p className="text-fuschia text-xs mt-1 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Usuario (Login) *</label>
                                <input type="text" value={data.username} onChange={e => setData('username', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia placeholder-stark/30 transition-colors" 
                                       placeholder="Ej. miguel_vendedor" required />
                                {errors.username && <p className="text-fuschia text-xs mt-1 font-bold">{errors.username}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Correo Electrónico *</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia placeholder-stark/30 transition-colors" required />
                                {errors.email && <p className="text-fuschia text-xs mt-1 font-bold">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">
                                    Contraseña {editingId && <span className="opacity-50 text-[9px]">(Opcional)</span>}
                                </label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia placeholder-stark/30 transition-colors" 
                                       required={!editingId} placeholder="Mínimo 8 caracteres" />
                                {errors.password && <p className="text-fuschia text-xs mt-1 font-bold">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Nivel de Permisos *</label>
                                <select value={data.role} onChange={e => setData('role', e.target.value)}
                                        className="w-full rounded-xl bg-void/80 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia font-bold transition-colors">
                                    <option value="Vendedor" className="bg-void">🛒 Vendedor</option>
                                    <option value="Gerente" className="bg-void">📊 Gerente</option>
                                    <option value="Administrador" className="bg-void">👑 Administrador</option>
                                </select>
                                {errors.role && <p className="text-fuschia text-xs mt-1 font-bold">{errors.role}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                {editingId && (
                                    <button type="button" onClick={cancelarEdicion} className="w-1/3 py-3 rounded-xl font-bold bg-transparent text-stark border border-stark/30 hover:bg-stark/10 transition-colors">
                                        Cancelar
                                    </button>
                                )}
                                <button disabled={processing} className={`${editingId ? 'w-2/3' : 'w-full'} py-3 rounded-xl font-black text-xs transition-all hover:-translate-y-1 shadow-lg disabled:opacity-50 uppercase tracking-widest bg-gradient-to-r ${editingId ? 'from-fuschia to-[#ff5e5e] shadow-[0_10px_20px_-10px_rgba(162,57,202,0.6)]' : 'from-jewel to-fuschia shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)]'} text-stark`}>
                                    {processing ? 'Guardando...' : (editingId ? 'Actualizar' : 'Dar de Alta')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LISTA DE EMPLEADOS (Cristal Oscuro) */}
                    <div className="lg:col-span-2 overflow-hidden shadow-[0_0_30px_rgba(71,23,246,0.1)] rounded-3xl bg-white/5 backdrop-blur-md border border-jewel/20">
                        <div className="p-6 border-b border-jewel/30 bg-gradient-to-r from-void to-jewel/20 flex justify-between items-center">
                            <h3 className="text-2xl font-serif italic text-stark">Nómina del Sistema</h3>
                        </div>
                        <div className="overflow-x-auto p-4">
                            <table className="min-w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stark/10">
                                        <th className="px-4 py-4 font-black text-stark/70 uppercase tracking-widest text-xs">ID</th>
                                        <th className="px-4 py-4 font-black text-stark/70 uppercase tracking-widest text-xs">Empleado</th>
                                        <th className="px-4 py-4 font-black text-stark/70 text-center uppercase tracking-widest text-xs">Rol</th>
                                        <th className="px-4 py-4 font-black text-stark/70 text-center uppercase tracking-widest text-xs">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stark/5">
                                    {usuarios.map((user) => (
                                        <tr key={user.id} className="hover:bg-fuschia/10 transition-colors text-stark">
                                            <td className="px-4 py-4 font-black opacity-40">#{user.id}</td>
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-lg drop-shadow-sm">{user.name}</div>
                                                <div className="text-xs italic opacity-60">@{user.username}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button onClick={() => iniciarEdicion(user)} className="px-4 py-2 bg-jewel/20 border border-jewel/50 rounded-lg shadow-sm font-bold text-xs text-stark hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_15px_rgba(162,57,202,0.6)] transition-all duration-300">
                                                    ✏️ Editar
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