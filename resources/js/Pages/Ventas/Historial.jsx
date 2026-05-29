import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function HistorialVentas({ auth, ventas }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Registro de Operaciones</span>}>
            <Head title="Historial de Ventas" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA FORMAL */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Historial de Ventas</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Bitácora de tickets emitidos durante el turno actual.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/ventas/descargar-pdf" className="bg-[#03363D] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-all">
                            Exportar PDF
                        </a>
                        <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest">
                            ← Volver
                        </Link>
                    </div>
                </div>

                {/* TABLA CORPORATIVA */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr className="text-[10px] uppercase font-black text-gray-500 tracking-widest">
                                    <th className="px-8 py-4">Folio</th>
                                    <th className="px-8 py-4">Fecha / Hora</th>
                                    <th className="px-8 py-4">Artículos Vendidos</th>
                                    <th className="px-8 py-4">Método</th>
                                    <th className="px-8 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ventas.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-gray-400 font-medium italic">No se han registrado ventas aún.</td>
                                    </tr>
                                ) : (
                                    ventas.data.map((venta) => (
                                        <tr key={venta.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-400 text-xs">#{String(venta.id).padStart(5, '0')}</td>
                                            <td className="px-8 py-5 font-medium text-gray-600">{new Date(venta.created_at).toLocaleString('es-MX')}</td>
                                            
                                            {/* ARTÍCULOS */}
                                            <td className="px-8 py-5">
                                                {venta.detalles && venta.detalles.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {venta.detalles.map((detalle, index) => (
                                                            <li key={index} className="text-[11px] text-gray-600 flex items-center gap-2">
                                                                <span className="font-bold text-gray-400">[{detalle.producto?.clave || 'S/C'}]</span>
                                                                {detalle.producto?.nombre || 'Producto Borrado'}
                                                                <span className="font-black text-gray-400">x{detalle.cantidad}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : <span className="text-xs italic text-gray-300">- Sin detalles -</span>}
                                            </td>

                                            {/* MÉTODO */}
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                                                    {venta.metodo_pago}
                                                </span>
                                            </td>
                                            
                                            {/* TOTAL */}
                                            <td className="px-8 py-5 text-right font-black text-[#03363D]">
                                                ${Number(venta.total).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}