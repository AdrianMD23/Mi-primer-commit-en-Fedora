import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function CortesIndex({ auth, totales, cortes, corteHoy }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    }, [flash]);

    const { data, setData, post, processing, errors } = useForm({
        fondo_caja: '',
        total_real: '',
        observaciones: '',
    });

    // Variables numéricas seguras
    const fondo = parseFloat(data.fondo_caja) || 0;
    const efectivo = parseFloat(totales?.ingresos_efectivo) || 0;
    const otros = parseFloat(totales?.ingresos_otros) || 0;
    const gastos = parseFloat(totales?.gastos) || 0;

    // FÓRMULA REAL: Fondo + Ventas Efectivo - Gastos
    const esperado = fondo + efectivo - gastos;
    const real = parseFloat(data.total_real) || 0;
    const diferencia = real - esperado;
    
    // Solo mostramos cuadre si ya escribieron algo en el total real
    const isExact = diferencia === 0 && data.total_real !== '';

    const submit = (e) => {
        e.preventDefault();
        post(route('gerencia.cortes.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Auditoría Financiera</span>}>
            <Head title="Corte de Caja" />

            {/* Modal de Éxito Estilo Neón */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-void p-8 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)] text-center max-w-sm border border-emerald-500/40">
                        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-[0_0_20px_rgba(34,197,94,0.4)] border border-emerald-500/50">🔒</div>
                        <h2 className="text-3xl font-serif italic text-stark mb-2 drop-shadow-md">¡Caja Cerrada!</h2>
                        <p className="text-stark/70 font-bold mb-6">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full px-6 py-3 bg-emerald-500 text-void hover:bg-emerald-400 transition-colors rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-serif italic text-stark drop-shadow-md">Corte de Caja Diario</h2>
                        <p className="text-sm opacity-60 mt-1 text-stark uppercase tracking-widest font-bold">Validación de efectivo y cierre de turno.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                  {/* RESUMEN DEL SISTEMA (Cristal Oscuro) */}
                    <div className="bg-white/5 backdrop-blur-md border border-jewel/20 p-8 rounded-3xl h-fit shadow-[0_0_30px_rgba(71,23,246,0.1)]">
                        <h3 className="text-2xl font-serif italic mb-6 text-stark">Resumen del Sistema</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center border-b border-stark/10 pb-4">
                                <span className="opacity-80 text-stark text-sm uppercase tracking-widest font-bold">Dinero Inicial (Fondo)</span>
                                <span className="font-black text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                                    + ${Number(fondo).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-stark/10 pb-4">
                                <span className="opacity-80 text-stark text-sm uppercase tracking-widest font-bold">Ventas en Efectivo (+)</span>
                                <span className="font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                    + ${Number(efectivo).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-stark/10 pb-4">
                                <span className="opacity-80 text-stark text-sm uppercase tracking-widest font-bold">Gastos Reportados (-)</span>
                                <span className="font-black text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">
                                    - ${Number(gastos).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 opacity-60 mt-2">
                                <span className="text-stark italic text-xs uppercase tracking-wider">Ventas por Tarjeta (En Banco)</span>
                                <span className="font-bold text-stark/60 text-sm">
                                    ${Number(otros).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-jewel/30">
                            <span className="text-xs uppercase tracking-widest font-black text-fuschia block mb-2">Total Esperado en Cajón</span>
                            <span className="text-5xl font-black block text-right text-stark drop-shadow-md">
                                ${Number(esperado).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                            </span>
                        </div>
                    </div>

                    {/* FORMULARIO DE CIERRE (Cristal Oscuro) */}
                    <div className="bg-white/5 backdrop-blur-md border border-jewel/20 p-8 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)]">
                        {corteHoy ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">✅</div>
                                <h3 className="text-3xl font-serif italic mb-2 text-stark">Turno Cerrado</h3>
                                <p className="font-bold opacity-60 text-stark">El corte de caja de hoy ya fue registrado con éxito.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-serif italic mb-6 text-stark border-b border-stark/10 pb-4">Validación Física</h3>
                                <form onSubmit={submit} className="space-y-5">
                                    
                                    {/* CAMPO: FONDO DE CAJA */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Fondo de Caja (Cambio inicial) *</label>
                                        <input type="number" step="0.01" value={data.fondo_caja} onChange={e => setData('fondo_caja', e.target.value)}
                                            className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia text-xl font-bold py-3 px-4 shadow-inner placeholder-stark/20 transition-colors" placeholder="Ej. 500.00" required />
                                        {errors.fondo_caja && <p className="text-fuschia text-xs mt-1 font-bold">{errors.fondo_caja}</p>}
                                    </div>

                                    {/* CAMPO: EFECTIVO REAL */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Efectivo Total Contado ($) *</label>
                                        <input type="number" step="0.01" value={data.total_real} onChange={e => setData('total_real', e.target.value)}
                                            className="w-full rounded-xl bg-void/80 border border-jewel/50 text-stark focus:ring-fuschia focus:border-fuschia text-3xl font-black py-4 px-4 shadow-inner placeholder-stark/20 transition-colors" placeholder="0.00" required />
                                        
                                        {data.total_real && (
                                            <div className={`mt-3 p-4 rounded-xl text-sm font-bold flex justify-between items-center shadow-lg transition-all duration-300 border ${
                                                isExact ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                                                diferencia > 0 ? 'bg-jewel/20 text-[#8B5CF6] border-jewel/50 shadow-[0_0_15px_rgba(71,23,246,0.2)]' : 
                                                'bg-red-500/10 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                            }`}>
                                                <span className="uppercase tracking-widest text-[10px] font-black">Diferencia detectada:</span>
                                                <span className="text-xl font-black">
                                                    {diferencia > 0 ? '+' : ''}{Number(diferencia).toLocaleString('es-MX', {minimumFractionDigits: 2})} 
                                                    <span className="text-[10px] uppercase tracking-widest ml-2 opacity-80 block text-right">
                                                        ({isExact ? 'Cuadre Perfecto' : diferencia > 0 ? 'Sobrante' : 'Faltante'})
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CAMPO: NOTAS */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-1">Observaciones (Opcional)</label>
                                        <textarea value={data.observaciones} onChange={e => setData('observaciones', e.target.value)} rows="2"
                                            className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia shadow-inner text-sm placeholder-stark/20 transition-colors" placeholder="Ej. El sobrante fue propina..."></textarea>
                                    </div>

                                    <button disabled={processing} className="w-full mt-6 py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all disabled:opacity-50">
                                        {processing ? 'Procesando...' : 'Realizar Cierre de Caja'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* TABLA DE HISTORIAL DE CORTES (Cristal Oscuro) */}
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-[0_0_30px_rgba(71,23,246,0.1)] border border-jewel/20 mt-8">
                    <div className="border-b border-jewel/30 bg-gradient-to-r from-void to-jewel/20 p-4 -m-6 mb-6 rounded-t-3xl">
                        <h3 className="text-2xl font-serif italic text-stark px-2">Historial de Cortes</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="text-[10px] uppercase text-stark/60 font-black tracking-widest border-b border-stark/10">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Ventas (Efectivo)</th>
                                    <th className="px-6 py-4">Gastos</th>
                                    <th className="px-6 py-4">Real en Caja</th>
                                    <th className="px-6 py-4 text-center">Estado</th>
                                    <th className="px-6 py-4">Notas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stark/5">
                                {!cortes || cortes.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 opacity-50 italic text-stark font-bold">
                                            No hay cortes de caja registrados anteriormente.
                                        </td>
                                    </tr>
                                ) : (
                                    cortes.map(corte => (
                                        <tr key={corte.id} className="hover:bg-fuschia/10 transition-colors text-stark">
                                            <td className="px-6 py-4 font-bold text-stark/80">{new Date(corte.fecha).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                                            <td className="px-6 py-4 text-emerald-300 font-bold">${Number(corte.total_ventas).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-red-400 font-bold">-${Number(corte.total_gastos).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 font-black text-jewel drop-shadow-[0_0_8px_rgba(71,23,246,0.5)] text-lg">${Number(corte.total_real).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border shadow-sm ${
                                                    corte.estado === 'Cuadre Exacto' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' :
                                                    corte.estado === 'Sobrante' ? 'bg-jewel/20 text-[#8B5CF6] border-jewel/50' :
                                                    'bg-red-500/10 text-red-400 border-red-500/40'
                                                }`}>
                                                    {corte.estado} ({corte.diferencia > 0 ? '+' : ''}{Number(corte.diferencia).toLocaleString('es-MX')})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs opacity-60 max-w-xs truncate italic" title={corte.observaciones}>
                                                {corte.observaciones || 'Sin notas'}
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