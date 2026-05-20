import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function GastosIndex({ auth, gastos, totalMes }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    }, [flash]);

    // Usamos la fecha de hoy por defecto para agilizar el formulario
    const hoy = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, reset, errors } = useForm({
        concepto: '',
        monto: '',
        fecha: hoy,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gerencia.gastos.store'), {
            onSuccess: () => reset('concepto', 'monto'), // Solo borramos estos, dejamos la fecha
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Control Financiero</span>}>
            <Head title="Control de Gastos" />

            {/* --- VENTANA FLOTANTE DE ÉXITO (Estilo Neón) --- */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity">
                    <div className="bg-void p-8 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)] text-center max-w-sm border border-emerald-500/40 transform scale-100 animate-[bounce_0.5s_ease-in-out]">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-emerald-500/50">💸</div>
                        <h2 className="text-3xl font-serif italic text-stark mb-2 drop-shadow-md">¡Registrado!</h2>
                        <p className="text-stark/70 font-bold mb-6">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full px-6 py-3 bg-emerald-500 text-void hover:bg-emerald-400 transition-colors rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* ENCABEZADO */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-serif italic text-stark drop-shadow-md">Control de Gastos</h2>
                        <p className="text-sm opacity-60 mt-1 text-stark font-bold uppercase tracking-widest">Registra las salidas de efectivo de la sucursal.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* FORMULARIO DE REGISTRO (Cristal Oscuro) */}
                    <div className="p-8 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] h-fit bg-white/5 backdrop-blur-md border border-jewel/30">
                        <h3 className="text-2xl font-serif italic mb-6 text-stark border-b border-stark/10 pb-4">Registrar Salida</h3>
                        
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Concepto del Gasto *</label>
                                <input type="text" value={data.concepto} onChange={e => setData('concepto', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors placeholder-stark/30" 
                                       placeholder="Ej. Artículos de limpieza" required />
                                {errors.concepto && <p className="text-fuschia text-xs mt-1 font-bold">{errors.concepto}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Monto ($) *</label>
                                <input type="number" step="0.01" min="0.1" value={data.monto} onChange={e => setData('monto', e.target.value)}
                                       className="w-full rounded-xl bg-void/80 border border-jewel/50 text-fuschia focus:ring-fuschia focus:border-fuschia font-black text-xl transition-colors placeholder-stark/20 shadow-inner" 
                                       placeholder="0.00" required />
                                {errors.monto && <p className="text-fuschia text-xs mt-1 font-bold">{errors.monto}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Fecha *</label>
                                <input type="date" value={data.fecha} onChange={e => setData('fecha', e.target.value)}
                                       className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-colors style-date" required />
                            </div>

                            <button disabled={processing} className="w-full mt-6 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all disabled:opacity-50">
                                {processing ? 'Registrando...' : 'Guardar Gasto'}
                            </button>
                        </form>
                    </div>

                    {/* HISTORIAL Y TOTALES (2 Columnas) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        
                        {/* Tarjeta de Resumen Mensual (Estilo Neón) */}
                        <div className="p-8 rounded-3xl shadow-[0_0_30px_rgba(162,57,202,0.2)] flex justify-between items-center bg-gradient-to-r from-void to-jewel/20 border border-fuschia/40 relative overflow-hidden">
                            {/* Luz sutil en el fondo */}
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-fuschia/10 rounded-full blur-[50px] pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <p className="text-xs uppercase tracking-widest opacity-80 font-black text-stark mb-1">Total de gastos este mes</p>
                            </div>
                            <div className="text-4xl font-black text-fuschia drop-shadow-[0_0_10px_rgba(162,57,202,0.6)] relative z-10">
                                ${Number(totalMes).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                            </div>
                        </div>

                        {/* Tabla de Historial (Cristal Oscuro) */}
                        <div className="overflow-hidden shadow-[0_0_30px_rgba(71,23,246,0.1)] rounded-3xl bg-white/5 backdrop-blur-md border border-jewel/20">
                            <div className="p-6 border-b border-jewel/30 bg-gradient-to-r from-void to-jewel/10">
                                <h3 className="text-2xl font-serif italic text-stark">Últimos Movimientos</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left border-collapse">
                                    <thead className="text-[10px] uppercase text-stark/60 font-black tracking-widest border-b border-stark/10">
                                        <tr>
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4">Concepto</th>
                                            <th className="px-6 py-4">Registró</th>
                                            <th className="px-6 py-4 text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stark/5">
                                        {gastos?.data?.length === 0 ? (
                                            <tr><td colSpan="4" className="text-center py-10 font-bold text-stark/50 italic">No se han registrado gastos.</td></tr>
                                        ) : (
                                            gastos?.data?.map((gasto) => (
                                                <tr key={gasto.id_gasto} className="hover:bg-fuschia/10 transition-colors text-stark">
                                                    <td className="px-6 py-4 font-bold text-stark/80">{new Date(gasto.fecha).toLocaleDateString('es-MX')}</td>
                                                    <td className="px-6 py-4 font-black drop-shadow-sm text-base">{gasto.concepto}</td>
                                                    <td className="px-6 py-4 opacity-70 text-[10px] uppercase tracking-widest font-bold text-stark">{gasto.usuario?.name || 'Sistema'}</td>
                                                    <td className="px-6 py-4 text-right font-black text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] text-lg">
                                                        -${Number(gasto.monto).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}