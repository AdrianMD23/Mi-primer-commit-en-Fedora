import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MovimientosIndex({ auth, movimientos }) {
    
    // Etiquetas de estado sólidas y claras
    const getTipoBadge = (tipo) => {
        const baseClass = "px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border";
        switch(tipo?.toLowerCase()) {
            case 'entrada': return <span className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-200`}>Entrada</span>;
            case 'salida': return <span className={`${baseClass} bg-red-50 text-red-600 border-red-200`}>Salida</span>;
            case 'ajuste': return <span className={`${baseClass} bg-amber-50 text-amber-600 border-amber-200`}>Ajuste</span>;
            default: return <span className={`${baseClass} bg-gray-50 text-gray-500 border-gray-200`}>{tipo}</span>;
        }
    };

    const formatearFecha = (fechaString) => {
        if (!fechaString) return '-';
        return new Date(fechaString).toLocaleString('es-MX', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Auditoría de Almacén</span>}>
            <Head title="Historial de Movimientos" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Historial de Movimientos</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Registro detallado y trazabilidad de inventario.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                {/* TABLA FORMAL */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr className="text-[10px] uppercase font-black text-gray-500 tracking-widest">
                                    <th className="px-8 py-4">Folio</th>
                                    <th className="px-8 py-4">Fecha / Hora</th>
                                    <th className="px-8 py-4">Tipo</th>
                                    <th className="px-8 py-4">Producto</th>
                                    <th className="px-8 py-4 text-center">Cantidad</th>
                                    <th className="px-8 py-4">Motivo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {!movimientos?.data || movimientos.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-gray-400 font-medium italic">No se encontraron movimientos registrados.</td>
                                    </tr>
                                ) : (
                                    movimientos.data.map((mov) => (
                                        <tr key={mov.id_movimiento} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-400 text-xs">#{mov.id_movimiento}</td>
                                            <td className="px-8 py-5 font-medium text-gray-600">{formatearFecha(mov.fecha)}</td>
                                            <td className="px-8 py-5">{getTipoBadge(mov.tipo)}</td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-[#03363D]">{mov.producto?.nombre || 'Producto'}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{mov.producto?.clave || '-'}</div>
                                            </td>
                                            <td className={`px-8 py-5 text-center font-black text-lg ${
                                                mov.tipo?.toLowerCase() === 'salida' ? 'text-red-600' : 
                                                (mov.tipo?.toLowerCase() === 'entrada' ? 'text-emerald-600' : 'text-amber-600')
                                            }`}>
                                                {mov.tipo?.toLowerCase() === 'salida' ? '-' : '+'}{mov.cantidad}
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 text-xs italic">{mov.motivo}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINACIÓN ELEGANTE */}
                    {movimientos?.links?.length > 3 && (
                        <div className="px-8 py-4 border-t border-gray-100 flex justify-center items-center gap-1">
                            {movimientos.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${
                                        link.active 
                                            ? 'bg-[#03363D] text-white' 
                                            : 'text-gray-400 hover:bg-gray-100'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}