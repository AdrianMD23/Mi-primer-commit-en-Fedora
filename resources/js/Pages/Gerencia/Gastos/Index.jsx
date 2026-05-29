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

    const hoy = new Date().toISOString().split('T')[0];
    const { data, setData, post, processing, reset, errors } = useForm({
        concepto: '', monto: '', fecha: hoy,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('gerencia.gastos.store'), { onSuccess: () => reset('concepto', 'monto') });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Control Financiero</span>}>
            <Head title="Control de Gastos" />

            {/* MODAL DE ÉXITO CORPORATIVO */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-gray-100">
                        <div className="text-4xl mb-4">💸</div>
                        <h2 className="text-2xl font-black text-[#03363D] mb-2">¡Gasto Registrado!</h2>
                        <p className="text-gray-500 text-sm mb-6">{flash.success}</p>
                        <button onClick={() => setShowSuccess(false)} className="w-full py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md">Continuar</button>
                    </div>
                </div>
            )}

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Control de Gastos</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Gestión de salidas de efectivo de la sucursal.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* FORMULARIO */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest mb-6">Registrar Salida</h3>
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Concepto del Gasto *</label>
                                <input type="text" value={data.concepto} onChange={e => setData('concepto', e.target.value)}
                                       className="w-full rounded-lg bg-gray-50 border border-gray-200 text-[#03363D] text-sm px-4 py-2.5 font-medium" placeholder="Ej. Limpieza" required />
                                {errors.concepto && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.concepto}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Monto ($) *</label>
                                <input type="number" step="0.01" value={data.monto} onChange={e => setData('monto', e.target.value)}
                                       className="w-full rounded-lg bg-gray-50 border border-gray-200 text-[#03363D] font-black text-xl px-4 py-2.5" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Fecha *</label>
                                <input type="date" value={data.fecha} onChange={e => setData('fecha', e.target.value)}
                                       className="w-full rounded-lg bg-gray-50 border border-gray-200 text-[#03363D] text-sm px-4 py-2.5" required />
                            </div>
                            <button disabled={processing} className="w-full py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#174D4D] transition-all disabled:opacity-50">
                                {processing ? 'Registrando...' : 'Guardar Gasto'}
                            </button>
                        </form>
                    </div>

                    {/* TOTAL Y TABLA */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Gastos Este Mes</span>
                            <span className="text-3xl font-black text-[#03363D]">${Number(totalMes).toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <h3 className="text-sm font-black text-[#03363D] uppercase tracking-widest">Últimos Movimientos</h3>
                            </div>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50/80 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4">Fecha</th>
                                        <th className="px-8 py-4">Concepto</th>
                                        <th className="px-8 py-4">Usuario</th>
                                        <th className="px-8 py-4 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {gastos?.data?.map((gasto) => (
                                        <tr key={gasto.id_gasto} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-4 font-medium text-gray-500">{new Date(gasto.fecha).toLocaleDateString()}</td>
                                            <td className="px-8 py-4 font-bold text-[#03363D]">{gasto.concepto}</td>
                                            <td className="px-8 py-4 text-[10px] font-black uppercase text-gray-400">{gasto.usuario?.name || 'Sistema'}</td>
                                            <td className="px-8 py-4 text-right font-black text-red-600">
                                                -${Number(gasto.monto).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}