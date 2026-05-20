import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MiTurno({ auth, resumen, fecha }) {
    return (
        <AuthenticatedLayout user={auth.user} header={<span>Resumen de Turno</span>}>
            <Head title="Mi Turno" />

            <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ENCABEZADO */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-serif italic text-stark drop-shadow-md">Mi Caja Actual</h2>
                        <p className="text-sm opacity-60 mt-1 text-stark uppercase tracking-widest font-bold">Operaciones del día: {fecha}</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                        ← Volver
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* TARJETA DE EFECTIVO (Cristal Oscuro + Esmeralda) */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.15)] p-8 border border-emerald-500/30 relative overflow-hidden group flex flex-col justify-center">
                        {/* Brillo de fondo */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                        <div className="absolute top-[-10px] right-[-10px] text-9xl opacity-5 drop-shadow-lg pointer-events-none">💵</div>
                        
                        <h3 className="text-xs font-black text-stark/70 uppercase tracking-widest mb-2 relative z-10">Efectivo en Cajón</h3>
                        
                        <p className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-6 relative z-10">
                            ${Number(resumen.efectivo).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </p>
                        
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl inline-block shadow-inner">
                                * Este monto debes entregar al Gerente.
                            </p>
                        </div>
                    </div>

                    {/* TARJETA DE OTROS MÉTODOS (Cristal Oscuro + Fuschia) */}
                    <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] p-8 flex flex-col justify-center border border-jewel/30 relative overflow-hidden group">
                        {/* Brillo de fondo */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fuschia/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-fuschia/20 transition-all duration-700"></div>
                        
                        <h3 className="text-xl font-serif italic text-stark mb-6 border-b border-stark/10 pb-4 relative z-10">Pagos Electrónicos</h3>
                        
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <span className="font-black text-stark/70 uppercase text-xs tracking-widest flex items-center gap-2">
                                <span className="text-lg drop-shadow-md">💳</span> Tarjeta
                            </span>
                            <span className="font-black text-2xl text-fuschia drop-shadow-[0_0_8px_rgba(162,57,202,0.5)]">
                                ${Number(resumen.tarjeta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center relative z-10">
                            <span className="font-black text-stark/70 uppercase text-xs tracking-widest flex items-center gap-2">
                                <span className="text-lg drop-shadow-md">📱</span> Transferencia
                            </span>
                            <span className="font-black text-2xl text-fuschia drop-shadow-[0_0_8px_rgba(162,57,202,0.5)]">
                                ${Number(resumen.transferencia).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RESUMEN TOTAL (Barra Amplia Neón) */}
                <div className="mt-8 bg-gradient-to-r from-void to-jewel/20 backdrop-blur-md rounded-3xl p-8 text-center border border-fuschia/30 shadow-[0_0_30px_rgba(162,57,202,0.15)] relative overflow-hidden">
                    <p className="text-stark/80 font-bold text-sm uppercase tracking-widest leading-relaxed">
                        Has realizado <span className="text-3xl text-fuschia font-black drop-shadow-[0_0_10px_rgba(162,57,202,0.6)] mx-2 align-middle">{resumen.cantidad_ventas}</span> ventas hoy, <br className="sm:hidden" />sumando un total general de <span className="text-3xl text-emerald-400 font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.6)] mx-2 align-middle">${Number(resumen.total).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>.
                    </p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}