import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, productos }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span>Gestión de Almacén</span>}
        >
            <Head title="Inventario" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                {/* Contenedor principal: Estilo Velvet */}
                <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#3a0b24', color: '#e8dcc8' }}>
                    
                    {/* Cabecera de la tabla */}
                    <div className="p-8 border-b" style={{ borderColor: 'rgba(232, 220, 200, 0.2)' }}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-serif italic">Catálogo de Inventario</h2>
                            <button className="px-6 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg"
                                    style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                                + Nueva Pieza
                            </button>
                        </div>
                    </div>

                    {/* Cuerpo de la tabla: Estilo Bone */}
                    <div className="p-8" style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-current opacity-70">
                                        <th className="py-3 font-serif italic tracking-wide">Clave</th>
                                        <th className="py-3 font-serif italic tracking-wide">Descripción</th>
                                        <th className="py-3 font-serif italic tracking-wide">Stock</th>
                                        <th className="py-3 font-serif italic tracking-wide">Precio Unit.</th>
                                        <th className="py-3 font-serif italic tracking-wide">Categoría</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center opacity-70 italic">
                                                El almacén está vacío. Registra tu primera pieza de plata.
                                            </td>
                                        </tr>
                                    ) : (
                                        productos.map((item) => (
                                            <tr key={item.id} className="border-b border-current border-opacity-20 hover:bg-black hover:bg-opacity-5 transition-colors">
                                                <td className="py-4 font-bold">{item.clave}</td>
                                                <td className="py-4">{item.nombre}</td>
                                                <td className="py-4">
                                                    {/* Alerta de Stock Mínimo */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.stock <= item.stock_minimo ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                        {item.stock} pz
                                                    </span>
                                                </td>
                                                <td className="py-4 text-lg font-serif italic">${item.precio_venta}</td>
                                                <td className="py-4 opacity-80">{item.categoria?.nombre || 'Sin Categoría'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}