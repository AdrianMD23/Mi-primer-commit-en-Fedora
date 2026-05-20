import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function ReportesIndex({ auth, financiero, inventario, mesActual }) {
    
    // Matemática para las barras de progreso visuales
    const totalFlujo = financiero.ventas + financiero.gastos;
    const porcentajeVentas = totalFlujo > 0 ? (financiero.ventas / totalFlujo) * 100 : 0;
    const porcentajeGastos = totalFlujo > 0 ? (financiero.gastos / totalFlujo) * 100 : 0;

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Inteligencia de Negocios</span>}>
            <Head title="Reportes" />
            
            <div className="mb-8 flex justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <a 
                    href={route('gerencia.reportes.pdf')} 
                    className="bg-gradient-to-r from-jewel to-fuschia text-stark px-8 py-4 rounded-xl font-black shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
                >
                    📄 Descargar Reporte PDF
                </a>
            </div>

            <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* ENCABEZADO */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-serif italic capitalize text-stark drop-shadow-md">
                            Rendimiento: {mesActual}
                        </h2>
                        <p className="text-sm opacity-60 mt-1 text-stark uppercase tracking-widest font-bold">
                            Visión general de las finanzas y el almacén.
                        </p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-stark/60 hover:text-fuschia transition-colors uppercase tracking-widest">
                        ← Volver al Panel
                    </Link>
                </div>

                {/* TARJETAS PRINCIPALES (Ventas, Gastos, Neta) - Estilo Cristal Oscuro */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Ventas (Ingresos) */}
                    <div className="p-6 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.1)] bg-white/5 backdrop-blur-md border border-emerald-500/30 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px] group-hover:bg-emerald-500/20 transition-all"></div>
                        <p className="text-xs uppercase tracking-widest font-black text-stark/60 mb-2 relative z-10">Ingresos del Mes</p>
                        <h3 className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] relative z-10">
                            +${Number(financiero.ventas).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                    </div>

                    {/* Gastos */}
                    <div className="p-6 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.1)] bg-white/5 backdrop-blur-md border border-red-500/30 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-[30px] group-hover:bg-red-500/20 transition-all"></div>
                        <p className="text-xs uppercase tracking-widest font-black text-stark/60 mb-2 relative z-10">Gastos del Mes</p>
                        <h3 className="text-4xl font-black text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] relative z-10">
                            -${Number(financiero.gastos).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                    </div>

                    {/* Ganancia Neta */}
                    <div className="p-6 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.2)] bg-gradient-to-br from-void to-jewel/20 border border-jewel/50 relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-fuschia/20 rounded-full blur-[40px] group-hover:bg-fuschia/30 transition-all"></div>
                        <p className="text-xs uppercase tracking-widest font-black text-stark/80 mb-2 relative z-10">Ganancia Neta</p>
                        <h3 className="text-4xl font-black text-stark drop-shadow-[0_0_10px_rgba(162,57,202,0.6)] relative z-10">
                            ${Number(financiero.neta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </h3>
                        <p className={`text-[10px] mt-3 font-black uppercase tracking-widest relative z-10 ${financiero.neta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {financiero.neta >= 0 ? '✅ Negocio Rentable' : '⚠️ Pérdidas detectadas'}
                        </p>
                    </div>
                </div>

                {/* GRÁFICA VISUAL DE BARRAS Y VALOR DE INVENTARIO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Barra de Distribución (Estilo Dashboard Sci-Fi) */}
                    <div className="p-8 rounded-3xl shadow-[0_0_30px_rgba(71,23,246,0.1)] bg-white/5 backdrop-blur-md border border-jewel/20">
                        <h3 className="text-2xl font-serif italic mb-6 text-stark">Distribución de Flujo</h3>
                        
                        {/* Pista de la barra */}
                        <div className="w-full bg-void/80 rounded-full h-6 mb-6 flex overflow-hidden shadow-inner border border-stark/10">
                            {/* Segmento Ventas (Verde Neón) */}
                            <div className="bg-emerald-500 h-6 transition-all duration-1000 relative shadow-[0_0_15px_rgba(16,185,129,0.8)]" style={{ width: `${porcentajeVentas}%` }}>
                                <div className="absolute inset-0 bg-white/20"></div> {/* Brillo superior */}
                            </div>
                            {/* Segmento Gastos (Rojo Neón) */}
                            <div className="bg-red-500 h-6 transition-all duration-1000 relative shadow-[0_0_15px_rgba(239,68,68,0.8)]" style={{ width: `${porcentajeGastos}%` }}>
                                <div className="absolute inset-0 bg-white/20"></div> {/* Brillo superior */}
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-stark/80">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> 
                                Ventas ({porcentajeVentas.toFixed(1)}%)
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span> 
                                Gastos ({porcentajeGastos.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    {/* Capital Invertido */}
                    <div className="p-8 rounded-3xl shadow-[0_0_30px_rgba(162,57,202,0.15)] flex flex-col justify-center text-center bg-gradient-to-bl from-void via-void to-fuschia/10 border border-fuschia/30 relative overflow-hidden group">
                        
                        {/* Luz de fondo sutil */}
                        <div className="absolute inset-0 bg-jewel/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <h3 className="text-2xl font-serif italic mb-2 text-stark relative z-10">Capital en Almacén</h3>
                        <p className="text-[10px] opacity-60 mb-6 font-black tracking-widest uppercase text-stark relative z-10">
                            Valor total de las {inventario.totalPiezas} piezas registradas
                        </p>
                        <div className="text-5xl font-black text-fuschia drop-shadow-[0_0_15px_rgba(162,57,202,0.6)] relative z-10">
                            ${Number(inventario.valorInvertido).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}