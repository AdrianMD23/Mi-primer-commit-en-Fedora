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

    const fondo = parseFloat(data.fondo_caja) || 0;
    const efectivo = parseFloat(totales?.ingresos_efectivo) || 0;
    const otros = parseFloat(totales?.ingresos_otros) || 0;
    const gastos = parseFloat(totales?.gastos) || 0;

    const esperado = fondo + efectivo - gastos;
    const real = parseFloat(data.total_real) || 0;
    const diferencia = real - esperado;
    const isExact = diferencia === 0 && data.total_real !== '';

    const submit = (e) => {
        e.preventDefault();
        post(route('gerencia.cortes.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Auditoría Financiera</span>}>
            <Head title="Corte de Caja" />

            {/* MODAL DE ÉXITO CORPORATIVO */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-gray-100">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-black text-[#03363D] mb-2 tracking-tight">Caja Cerrada</h2>
                        <p className="text-gray-500 text-sm mb-6">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md">Continuar</button>
                    </div>
                </div>
            )}

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Corte de Caja</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Validación de flujo de efectivo y cierre de turno.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* RESUMEN FINANCIERO */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Resumen del Sistema</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Fondo Inicial', value: fondo, color: 'text-gray-600' },
                                { label: 'Ventas Efectivo', value: efectivo, color: 'text-emerald-600' },
                                { label: 'Gastos Reportados', value: gastos, color: 'text-red-600' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50">
                                    <span className="text-sm text-gray-500">{item.label}</span>
                                    <span className={`text-sm font-bold ${item.color}`}>${Number(item.value).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-6">
                                <span className="text-base font-black text-[#03363D] uppercase tracking-widest">Total Esperado</span>
                                <span className="text-3xl font-black text-[#03363D]">${Number(esperado).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>

                    {/* FORMULARIO */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        {corteHoy ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-10 text-gray-400">
                                <div className="text-5xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-[#03363D]">Turno Cerrado</h3>
                                <p className="text-sm">El corte de hoy ya fue registrado.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6">Validación Física</h3>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Fondo de Caja (Cambio) *</label>
                                    <input type="number" step="0.01" value={data.fondo_caja} onChange={e => setData('fondo_caja', e.target.value)} 
                                           className="w-full rounded-lg bg-gray-50 border border-gray-200 text-[#03363D] text-sm px-4 py-3 font-medium" placeholder="0.00" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Efectivo Total Contado *</label>
                                    <input type="number" step="0.01" value={data.total_real} onChange={e => setData('total_real', e.target.value)} 
                                           className="w-full rounded-lg bg-gray-50 border border-gray-200 text-[#03363D] text-2xl font-black px-4 py-3" placeholder="0.00" required />
                                    {data.total_real && (
                                        <div className={`mt-3 p-3 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isExact ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                            Diferencia: {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)} ({isExact ? 'Cuadrado' : diferencia > 0 ? 'Sobrante' : 'Faltante'})
                                        </div>
                                    )}
                                </div>
                                <button type="submit" disabled={processing} className="w-full py-4 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#174D4D] transition-all">
                                    {processing ? 'Procesando...' : 'Realizar Cierre'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* HISTORIAL */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest">Historial de Cortes</h3>
                    </div>
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Fecha</th>
                                <th className="px-8 py-4">Ventas</th>
                                <th className="px-8 py-4">Gastos</th>
                                <th className="px-8 py-4 text-right">Real en Caja</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cortes.map(corte => (
                                <tr key={corte.id} className="hover:bg-gray-50 text-gray-600">
                                    <td className="px-8 py-4 font-medium">{new Date(corte.fecha).toLocaleDateString()}</td>
                                    <td className="px-8 py-4">${Number(corte.total_ventas).toLocaleString()}</td>
                                    <td className="px-8 py-4 text-red-500">-${Number(corte.total_gastos).toLocaleString()}</td>
                                    <td className="px-8 py-4 font-black text-[#03363D] text-right">${Number(corte.total_real).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}