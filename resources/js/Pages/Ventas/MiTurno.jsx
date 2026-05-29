import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MiTurno({ auth, resumen, fecha }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Resumen de Turno</span>}>
            <Head title="Mi Turno" />

            <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA FORMAL */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Mi Caja Actual</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Operaciones registradas al corte: {fecha}</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* TARJETA EFECTIVO */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Efectivo en Cajón</h3>
                        <p className="text-5xl font-black text-[#03363D] tracking-tighter mb-6">
                            ${Number(resumen.efectivo).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                ⚠️ Importante: Este monto total debe ser entregado al área de gerencia al finalizar el turno.
                            </p>
                        </div>
                    </div>

                    {/* TARJETA PAGOS ELECTRÓNICOS */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Pagos Electrónicos</h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-600">Tarjeta</span>
                                <span className="text-xl font-black text-[#03363D]">
                                    ${Number(resumen.tarjeta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-600">Transferencia</span>
                                <span className="text-xl font-black text-[#03363D]">
                                    ${Number(resumen.transferencia).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESUMEN TOTAL (Barra de Cierre) */}
                <div className="mt-8 bg-[#03363D] rounded-2xl p-8 text-center shadow-lg">
                    <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mb-2">Resumen Operativo</p>
                    <p className="text-white text-sm font-medium">
                        Has realizado <span className="font-black text-white">{resumen.cantidad_ventas}</span> ventas hoy, 
                        totalizando <span className="font-black text-white text-lg">${Number(resumen.total).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span> en caja.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}