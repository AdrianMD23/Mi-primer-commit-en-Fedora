import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ReportesIndex({ auth, financiero, inventario, mesActual }) {
    
    // Cálculo para las barras de progreso
    const totalFlujo = financiero.ventas + financiero.gastos;
    const porcentajeVentas = totalFlujo > 0 ? (financiero.ventas / totalFlujo) * 100 : 0;
    const porcentajeGastos = totalFlujo > 0 ? (financiero.gastos / totalFlujo) * 100 : 0;

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Inteligencia de Negocios</span>}>
            <Head title="Reportes Financieros" />
            
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA Y ACCIÓN */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Rendimiento: {mesActual}</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Visión general de las finanzas y el almacén.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] uppercase tracking-widest transition-colors">← Volver al Panel</Link>
                        <a href={route('gerencia.reportes.pdf')} className="bg-[#03363D] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#174D4D] transition-all">
                            Descargar PDF
                        </a>
                    </div>
                </div>

                {/* TARJETAS KPI */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ingresos del Mes</p>
                        <h3 className="text-3xl font-black text-emerald-600 tracking-tight">
                            +${Number(financiero.ventas).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Gastos del Mes</p>
                        <h3 className="text-3xl font-black text-red-600 tracking-tight">
                            -${Number(financiero.gastos).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                    </div>
                    <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Ganancia Neta</p>
                        <h3 className="text-3xl font-black text-[#03363D] tracking-tight">
                            ${Number(financiero.neta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                        <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${financiero.neta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {financiero.neta >= 0 ? '● Negocio Rentable' : '● Pérdidas detectadas'}
                        </p>
                    </div>
                </div>

                {/* DISTRIBUCIÓN Y CAPITAL */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-8 rounded-2xl shadow-sm bg-white border border-gray-200">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#03363D] mb-6">Distribución de Flujo</h3>
                        
                        <div className="w-full bg-gray-100 rounded-full h-4 mb-6 flex overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${porcentajeVentas}%` }}></div>
                            <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${porcentajeGastos}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ventas ({porcentajeVentas.toFixed(1)}%)</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Gastos ({porcentajeGastos.toFixed(1)}%)</span>
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl shadow-sm bg-white border border-gray-200 flex flex-col justify-center">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Capital en Almacén</h3>
                        <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">
                            Valor total de las {inventario.totalPiezas} piezas registradas
                        </p>
                        <div className="text-4xl font-black text-[#03363D] tracking-tighter">
                            ${Number(inventario.valorInvertido).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}