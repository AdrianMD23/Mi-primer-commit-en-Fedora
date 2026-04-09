import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, usuarios }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span>Gestión de Personal</span>}
        >
            <Head title="Usuarios" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {/* Contenedor principal: Estilo Velvet */}
                <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#3a0b24', color: '#e8dcc8' }}>
                    
                    {/* Cabecera */}
                    <div className="p-8 border-b" style={{ borderColor: 'rgba(232, 220, 200, 0.2)' }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-serif italic">Plantilla de Empleados</h2>
                            <button className="px-6 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg"
                                    style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                                + Nuevo Usuario
                            </button>
                        </div>
                    </div>

                    {/* Cuerpo de la tabla: Estilo Bone */}
                    <div className="p-8" style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-current opacity-70">
                                        <th className="py-3 font-serif italic tracking-wide">Nombre</th>
                                        <th className="py-3 font-serif italic tracking-wide">Usuario</th>
                                        <th className="py-3 font-serif italic tracking-wide">Correo</th>
                                        <th className="py-3 font-serif italic tracking-wide">Rol</th>
                                        <th className="py-3 font-serif italic tracking-wide text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((empleado) => (
                                        <tr key={empleado.id} className="border-b border-current border-opacity-20 hover:bg-black hover:bg-opacity-5 transition-colors">
                                            <td className="py-4 font-bold">{empleado.name}</td>
                                            <td className="py-4 opacity-80">@{empleado.username}</td>
                                            <td className="py-4">{empleado.email}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                    ${empleado.role === 'Administrador' ? 'bg-purple-200 text-purple-800' : 
                                                      empleado.role === 'Gerente' ? 'bg-blue-200 text-blue-800' : 
                                                      'bg-green-200 text-green-800'}`}>
                                                    {empleado.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <button className="text-sm font-bold underline opacity-70 hover:opacity-100 transition-opacity">
                                                    Editar
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