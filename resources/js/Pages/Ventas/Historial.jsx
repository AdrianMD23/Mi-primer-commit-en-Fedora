import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function HistorialVentas({ auth, ventas }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<span>Mis Tickets</span>}>
            <Head title="Historial de Ventas" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ENCABEZADO */}
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-4xl font-serif italic text-stark drop-shadow-md">Historial de Ventas</h2>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                        ← Volver
                    </Link>
                </div>

                {/* TABLA DE HISTORIAL (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] overflow-hidden border border-jewel/20">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gradient-to-r from-void to-jewel/20 border-b border-jewel/30 text-stark/70">
                                <tr>
                                    <th className="px-6 py-4 font-black text-xs uppercase tracking-widest">Folio / Ticket</th>
                                    <th className="px-6 py-4 font-black text-xs uppercase tracking-widest">Fecha y Hora</th>
                                    {/* --- COLUMNA DE ARTÍCULOS --- */}
                                    <th className="px-6 py-4 font-black text-xs uppercase tracking-widest">Artículos Vendidos</th>
                                    <th className="px-6 py-4 font-black text-xs uppercase tracking-widest">Método de Pago</th>
                                    <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stark/5">
                                {ventas.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 italic text-stark/50 font-bold text-lg">
                                            No has registrado ventas aún.
                                        </td>
                                    </tr>
                                ) : (
                                    ventas.data.map((venta) => (
                                        <tr key={venta.id} className="hover:bg-fuschia/10 text-stark transition-colors">
                                            
                                            {/* FOLIO */}
                                            <td className="px-6 py-4 font-black text-stark/40 text-lg">
                                                # {String(venta.id).padStart(5, '0')}
                                            </td>
                                            
                                            {/* FECHA */}
                                            <td className="px-6 py-4 font-bold text-stark/80">
                                                {new Date(venta.created_at).toLocaleString('es-MX')}
                                            </td>
                                            
                                            {/* --- IMPRESIÓN DE LA LISTA DE ARTÍCULOS --- */}
                                            <td className="px-6 py-4">
                                                {venta.detalles && venta.detalles.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {venta.detalles.map((detalle, index) => (
                                                            <li key={index} className="text-[11px] uppercase flex items-center gap-2">
                                                                <span className="font-black text-fuschia bg-fuschia/10 border border-fuschia/30 px-2 py-0.5 rounded shadow-[0_0_5px_rgba(162,57,202,0.2)]">
                                                                    [{detalle.producto?.clave || 'S/C'}]
                                                                </span>
                                                                <span className="font-bold drop-shadow-sm">
                                                                    {detalle.producto?.nombre || 'Producto Borrado'}
                                                                </span>
                                                                <span className="font-black opacity-60">
                                                                    (x{detalle.cantidad})
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-xs italic opacity-40">- Sin detalles -</span>
                                                )}
                                            </td>

                                            {/* MÉTODO DE PAGO */}
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-jewel/20 text-[#8B5CF6] border-jewel/50 shadow-[0_0_10px_rgba(71,23,246,0.2)]">
                                                    {venta.metodo_pago}
                                                </span>
                                            </td>
                                            
                                            {/* TOTAL */}
                                            <td className="px-6 py-4 text-right font-black text-xl text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
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