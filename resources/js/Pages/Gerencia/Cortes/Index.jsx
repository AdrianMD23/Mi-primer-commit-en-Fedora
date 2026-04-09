import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, cortes }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span>Supervisión Financiera</span>}
        >
            <Head title="Cortes de Caja" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {/* Contenedor principal: Estilo Velvet */}
                <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#3a0b24', color: '#e8dcc8' }}>
                    
                    {/* Cabecera */}
                    <div className="p-8 border-b" style={{ borderColor: 'rgba(232, 220, 200, 0.2)' }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-serif italic">Historial de Cortes de Caja</h2>
                            <button className="px-6 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                                🔒 Cerrar Caja Actual
                            </button>
                        </div>
                    </div>

                    {/* Cuerpo de la tabla: Estilo Bone */}
                    <div className="p-8" style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-current opacity-70">
                                        <th className="py-3 font-serif italic tracking-wide">Fecha</th>
                                        <th className="py-3 font-serif italic tracking-wide">Encargado</th>
                                        <th className="py-3 font-serif italic tracking-wide text-center">No. Ventas</th>
                                        <th className="py-3 font-serif italic tracking-wide text-right pr-4">Total Ingresos</th>
                                        <th className="py-3 font-serif italic tracking-wide text-center">Estado</th>
                                        <th className="py-3 font-serif italic tracking-wide text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cortes.map((corte) => (
                                        <tr key={corte.id} className="border-b border-current border-opacity-20 hover:bg-black hover:bg-opacity-5 transition-colors">
                                            <td className="py-4 font-bold">{corte.fecha}</td>
                                            <td className="py-4 opacity-80">{corte.encargado}</td>
                                            <td className="py-4 text-center">{corte.total_ventas}</td>
                                            <td className="py-4 text-right pr-4 font-serif italic text-lg">
                                                ${corte.ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                                                    ${corte.estado === 'Abierto' ? 'bg-green-200 text-green-800 border border-green-300' : 
                                                      'bg-gray-300 text-gray-700 opacity-80'}`}>
                                                    {corte.estado}
                                                </span>
                                            </td>
                                            <td className="py-4 text-center">
                                                <button className="text-sm font-bold underline opacity-70 hover:opacity-100 transition-opacity">
                                                    Ver Detalle
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