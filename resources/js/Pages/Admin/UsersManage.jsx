import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function UsersManage({ auth, users }) {
    // Estado para controlar qué usuario se está editando y si el modal está abierto
    const [editingUser, setEditingUser] = useState(null);

    // Inicializamos el formulario de Inertia incluyendo 'username'
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '', 
        email: '',
        role: '',
        password: '',
    });

    // Función para abrir el modal y cargar los datos del usuario seleccionado
    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            username: user.username || '', // Cargamos el usuario
            email: user.email,
            role: user.role,
            password: '', // Siempre vacío por seguridad
        });
        clearErrors();
    };

    // Función para cerrar el modal y limpiar el formulario
    const closeEditModal = () => {
        setEditingUser(null);
        reset();
        clearErrors();
    };

    // Función para enviar el formulario al backend
    const submitEdit = (e) => {
        e.preventDefault();
        put(route('admin.usuarios.update', editingUser.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Gestión de Usuarios</span>}>
            <Head title="Gestión de Usuarios" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-2xl sm:rounded-2xl p-8" style={{ backgroundColor: '#e8dcc8' }}>
                        <h2 className="text-3xl font-serif italic mb-8" style={{ color: '#4a0e2e' }}>
                            Control de Usuarios
                        </h2>
                        
                        <div className="overflow-x-auto rounded-xl border border-[#4a0e2e]/20">
                            <table className="min-w-full divide-y divide-[#4a0e2e]/20 text-sm">
                                <thead style={{ backgroundColor: '#4a0e2e', color: '#e8dcc8' }}>
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Nombre</th>
                                        {/* Nueva columna para ver el usuario */}
                                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Usuario</th> 
                                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Rol Actual</th>
                                        <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#4a0e2e]/10 bg-white">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-[#e8dcc8]/30 transition-colors">
                                            <td className="px-6 py-4 font-medium" style={{ color: '#4a0e2e' }}>{u.name}</td>
                                            <td className="px-6 py-4 text-gray-600 font-semibold">{u.username}</td> {/* Se muestra el usuario */}
                                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold border" 
                                                      style={{ 
                                                          backgroundColor: u.role === 'Administrador' ? '#4a0e2e' : 'transparent',
                                                          color: u.role === 'Administrador' ? '#e8dcc8' : '#4a0e2e',
                                                          borderColor: '#4a0e2e'
                                                      }}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button 
                                                    onClick={() => openEditModal(u)}
                                                    className="font-bold hover:underline"
                                                    style={{ color: '#4a0e2e' }}
                                                >
                                                    Editar Usuario
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

            {/* MODAL DE EDICIÓN */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl shadow-2xl p-8" style={{ backgroundColor: '#e8dcc8' }}>
                        <h3 className="text-2xl font-serif italic mb-6" style={{ color: '#4a0e2e' }}>
                            Editar: {editingUser.name}
                        </h3>
                        
                        <form onSubmit={submitEdit} className="space-y-5">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"
                                    required
                                />
                                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Nombre de Usuario (Para Login) */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Nombre de Usuario (Login)</label>
                                <input 
                                    type="text" 
                                    value={data.username} 
                                    onChange={e => setData('username', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"
                                    required
                                />
                                {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"
                                    required
                                />
                                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Rol */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>Rol del Sistema</label>
                                <select 
                                    value={data.role} 
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"
                                >
                                    <option value="Administrador">Administrador</option>
                                    <option value="Gerente">Gerente</option>
                                    <option value="Vendedor">Vendedor</option>
                                </select>
                                {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: '#4a0e2e' }}>
                                    Nueva Contraseña <span className="font-normal opacity-70">(Opcional)</span>
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="Dejar en blanco para mantener la actual"
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#4a0e2e] focus:border-[#4a0e2e]"
                                />
                                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#4a0e2e]/20">
                                <button 
                                    type="button" 
                                    onClick={closeEditModal}
                                    className="px-5 py-2 rounded-full text-sm font-bold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
                                    style={{ backgroundColor: '#4a0e2e', color: '#e8dcc8' }}
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}