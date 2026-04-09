import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function UsersManage({ auth, users }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Usuarios" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-[#f09410]">
                        <h2 className="text-2xl font-bold mb-6 text-[#702d09]">Control de Usuarios</h2>
                        
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-[#f0d0c8]">
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Rol Actual</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-6 py-4">{u.name}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Aquí podrías poner un botón para abrir un modal de edición */}
                                            <button className="text-[#bc430d] hover:underline font-bold">Editar Rol</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}