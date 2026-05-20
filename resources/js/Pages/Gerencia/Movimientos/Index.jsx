import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MovimientosIndex({ auth, movimientos }) {
    
    // Función para darle color estilo "NEÓN" a la etiqueta según el tipo
    const getTipoBadge = (tipo) => {
        switch(tipo?.toLowerCase()) {
            case 'entrada':
                return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(16,185,129,0.3)]">ENTRADA</span>;
            case 'salida':
                return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/40 rounded-full text-[10px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(239,68,68,0.3)]">SALIDA</span>;
            case 'ajuste':
                return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/40 rounded-full text-[10px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(245,158,11,0.3)]">AJUSTE</span>;
            default:
                return <span className="px-3 py-1 bg-stark/10 text-stark/80 border border-stark/30 rounded-full text-[10px] uppercase tracking-widest font-black">{tipo}</span>;
        }
    };

    // Función para formatear la fecha
    const formatearFecha = (fechaString) => {
        if (!fechaString) return '-';
        const fecha = new Date(fechaString);
        return fecha.toLocaleString('es-MX', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Auditoría de Almacén</span>}>
            <Head title="Movimientos de Stock" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* CONTENEDOR PRINCIPAL: Cristal Oscuro */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] overflow-hidden border border-jewel/20">
                    
                    {/* CABECERA DE LA TABLA */}
                    <div className="p-8 flex justify-between items-center border-b border-jewel/30 bg-gradient-to-r from-void to-jewel/20">
                        <div>
                            <h2 className="text-3xl font-serif italic text-stark drop-shadow-md">Historial de Movimientos</h2>
                            <p className="text-sm opacity-60 mt-1 text-stark">Registro detallado de entradas, mermas y ajustes de inventario.</p>
                        </div>
                        <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                            ← Volver al Panel
                        </Link>
                    </div>

                    {/* CUERPO DE LA TABLA */}
                    <div className="overflow-x-auto p-4">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-stark/10 text-stark/70">
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Folio / ID</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Fecha y Hora</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Tipo</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Producto</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs text-center">Cantidad</th>
                                    <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Motivo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stark/5">
                                {movimientos?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-lg italic opacity-50 text-stark">
                                            No hay movimientos registrados en el sistema.
                                        </td>
                                    </tr>
                                ) : (
                                    movimientos?.data?.map((mov) => (
                                        <tr key={mov.id_movimiento} className="hover:bg-fuschia/10 transition-colors text-stark">
                                            <td className="px-6 py-4 font-black text-stark/40">#{mov.id_movimiento}</td>
                                            <td className="px-6 py-4 font-medium text-stark/80">{formatearFecha(mov.fecha)}</td>
                                            <td className="px-6 py-4">{getTipoBadge(mov.tipo)}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold block drop-shadow-sm text-base">{mov.producto?.nombre || 'Producto Desconocido'}</span>
                                                <span className="text-[10px] uppercase font-black tracking-widest text-fuschia">{mov.producto?.clave || ''}</span>
                                            </td>
                                            {/* Cantidad con color dinámico brillante */}
                                            <td className={`px-6 py-4 text-center font-black text-xl ${
                                                mov.tipo?.toLowerCase() === 'salida' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                                                (mov.tipo?.toLowerCase() === 'entrada' ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                                'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]')
                                            }`}>
                                                {mov.tipo?.toLowerCase() === 'salida' ? '-' : '+'}{mov.cantidad}
                                            </td>
                                            <td className="px-6 py-4 italic opacity-70 text-xs">{mov.motivo}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINACIÓN ESTILO DARK/NEÓN */}
                    {movimientos?.links?.length > 3 && (
                        <div className="p-6 flex justify-center items-center gap-2 border-t border-jewel/20">
                            {movimientos.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                                        link.active 
                                            ? 'bg-gradient-to-r from-jewel to-fuschia text-stark shadow-[0_0_15px_rgba(162,57,202,0.5)]' 
                                            : 'bg-void/50 text-stark/60 hover:bg-fuschia/20 hover:text-stark border border-stark/10'
                                    } ${!link.url ? 'opacity-30 cursor-not-allowed border-none' : ''}`}
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