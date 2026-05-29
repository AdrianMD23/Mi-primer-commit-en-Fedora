import React, { useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stockAlerts, graficaVentas }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const userRole = user?.role || 'Vendedor';

    const isBoss = userRole === 'Administrador' || userRole === 'Gerente';

    // Formateo de datos para la gráfica
    const datosGrafica = useMemo(() => {
        return graficaVentas ? graficaVentas.map(item => {
            const fechaObj = new Date(item.fecha);
            // Sumamos 1 día para corregir zonas horarias si es necesario, o lo dejamos directo
            return {
                dia: fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                ingresos: parseFloat(item.ingresos)
            };
        }) : [];
    }, [graficaVentas]);

    // Calcular el gran total de la semana para el indicador principal
    const totalSemana = useMemo(() => {
        return datosGrafica.reduce((acc, curr) => acc + curr.ingresos, 0);
    }, [datosGrafica]);

    const roleWidgets = {
        'Administrador': [
            { title: 'Usuarios', description: 'Administra cuentas y roles del personal.', href: '/admin/usuarios', buttonText: 'Gestionar', icon: '👥' },
            { title: 'Respaldos', description: 'Copias de seguridad de base de datos.', href: '/respaldo/descargar', buttonText: 'Descargar SQL', icon: '💾' },
        ],
        'Gerente': [
            { title: 'Inventario', description: 'Gestión técnica de existencias.', href: '/inventario', buttonText: 'Ver Almacén', icon: '📦' },
            { title: 'Proveedores', description: 'Directorio de mayoristas y talleres.', href: '/admin/proveedores', buttonText: 'Ver Directorio', icon: '🤝' },
            { title: 'Categorías', description: 'Clasificaciones de stock de joyas.', href: '/admin/categorias', buttonText: 'Gestionar', icon: '🏷️' },
            { title: 'Cortes de Caja', description: 'Validación de flujo de efectivo.', href: '/gerencia/cortes', buttonText: 'Revisar', icon: '📊' },
            { title: 'Auditoría', description: 'Historial de entradas, mermas y ajustes.', href: '/gerencia/movimientos', buttonText: 'Ver Historial', icon: '🕵️‍♂️' },
            { title: 'Estadísticas', description: 'Rendimiento financiero y métricas.', href: '/gerencia/reportes', buttonText: 'Ver Reportes', icon: '📈' },
            { title: 'Gastos', description: 'Registro de salidas de sucursal.', href: '/gerencia/gastos', buttonText: 'Gestionar', icon: '💸' },
        ],
        'Vendedor': [
            { title: 'Punto de Venta', description: 'Registra una nueva transacción.', href: '/ventas/nueva', buttonText: 'Crear Venta', icon: '🛒' },
            { title: 'Catálogo', description: 'Verifica precios y existencias.', href: '/catalogo', buttonText: 'Buscar Pieza', icon: '🔍' },
            { title: 'Mis Ventas', description: 'Historial de tus tickets emitidos.', href: '/ventas/historial', buttonText: 'Ver Historial', icon: '📜' },
            { title: 'Mi Turno', description: 'Resumen de tu efectivo cobrado hoy.', href: '/ventas/mi-corte', buttonText: 'Ver Mi Caja', icon: '💵' },
        ]
    };
    
    const widgets = roleWidgets[userRole] || roleWidgets['Vendedor'];

    return (
        <AuthenticatedLayout user={user} header={<span className="font-black tracking-tight opacity-80">Workspace</span>}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA LIBRE (Estilo SaaS Moderno) */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-stark mb-1">
                            Panel de {userRole}
                        </h1>
                        <p className="text-sm font-medium text-stark/50">
                            Bienvenido de vuelta, <span className="text-stark">{user?.name}</span>. Todo está listo para hoy.
                        </p>
                    </div>
                </div>

                {/* ALERTAS DE STOCK (Minimalistas) */}
                {isBoss && stockAlerts && stockAlerts.length > 0 && (
                    <div className="mb-8 border-l-4 border-red-500 bg-red-500/5 rounded-r-2xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-lg">
                                ⚠️
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-stark tracking-tight">Stock Crítico en {stockAlerts.length} producto(s)</h3>
                                <p className="text-xs text-stark/60 mt-0.5">Se requiere atención en el inventario para evitar pérdida de ventas.</p>
                            </div>
                        </div>
                        <Link href="/inventario" className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">
                            Revisar Inventario
                        </Link>
                    </div>
                )}

                {/* SECCIÓN DE GRÁFICAS Y MÉTRICAS (Estilo FinTech) */}
               {userRole === 'Gerente' && (
                    <div className="mb-10 p-8 rounded-3xl border border-stark/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        
                        {/* El Gran Número (Métrica Principal) */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                            <div>
                                <h3 className="text-xs font-black tracking-widest text-stark/40 uppercase mb-2">Ingresos (Últimos 7 días)</h3>
                                <div className="text-5xl font-black text-stark tracking-tighter">
                                    ${totalSemana.toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                </div>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-btn-start/10 border border-btn-start/20 text-btn-start text-xs font-bold flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-btn-start opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-btn-start"></span>
                                </span>
                                Datos en tiempo real
                            </div>
                        </div>
                        
                        {/* Gráfica de Barras Ultra-Delgadas */}
                        {datosGrafica.length > 0 ? (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={datosGrafica} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBarra" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-btn-start)" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="var(--color-btn-end)" stopOpacity={0.8}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stark)" opacity={0.05} vertical={false} />
                                        <XAxis dataKey="dia" stroke="var(--color-stark)" opacity={0.4} tick={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }} axisLine={false} tickLine={false} dy={15} />
                                        <YAxis stroke="var(--color-stark)" opacity={0.4} tick={{ fontSize: 11, fontWeight: '600' }} tickFormatter={(value) => `$${value}`} axisLine={false} tickLine={false} dx={-10} />
                                        <Tooltip 
                                            cursor={{ fill: 'var(--color-stark)', opacity: 0.03 }}
                                            contentStyle={{ backgroundColor: 'var(--color-void)', border: '1px solid var(--color-stark)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                                            itemStyle={{ color: 'var(--color-btn-start)', fontWeight: '900', fontSize: '18px', margin: 0 }}
                                            labelStyle={{ color: 'var(--color-stark)', opacity: 0.5, marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Total']}
                                        />
                                        <Bar dataKey="ingresos" fill="url(#colorBarra)" radius={[6, 6, 0, 0]} barSize={18} animationDuration={1200} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-stark/10 rounded-2xl bg-stark/5">
                                <span className="text-2xl mb-2 opacity-50">📊</span>
                                <p className="text-stark/50 text-sm font-medium">No hay movimientos financieros recientes.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* GRID DE MÓDULOS (Tarjetas de Cristal) */}
                <h3 className="text-xs font-black tracking-widest text-stark/40 uppercase mb-4 ml-2">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {widgets.map((widget, index) => (
                        <div key={index} className="group flex flex-col p-6 rounded-3xl border border-stark/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-500">
                            
                            <div className="flex items-center gap-4 mb-5">
                                {/* Contenedor del ícono estilo "App Store" */}
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-stark/5 to-stark/10 border border-stark/10 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    {widget.icon}
                                </div>
                                <h4 className="text-lg font-bold text-stark tracking-tight">{widget.title}</h4>
                            </div>
                            
                            <p className="text-xs text-stark/50 mb-8 flex-grow font-medium leading-relaxed">
                                {widget.description}
                            </p>
                            
                            {/* BOTÓN INTELIGENTE (Se revela al pasar el mouse) */}
                            {widget.title === 'Respaldos' ? (
                                <a 
                                    href={widget.href} 
                                    download="respaldo_base_de_datos.sql"
                                    className="mt-auto flex items-center justify-between w-full py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest border border-stark/10 text-stark/70 group-hover:bg-stark group-hover:text-void group-hover:border-transparent transition-all duration-300"
                                >
                                    {widget.buttonText}
                                    <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        ↓
                                    </span>
                                </a>
                            ) : (
                                <Link 
                                    href={widget.href} 
                                    className="mt-auto flex items-center justify-between w-full py-3 px-5 rounded-xl text-xs font-black uppercase tracking-widest border border-stark/10 text-stark/70 group-hover:bg-stark group-hover:text-void group-hover:border-transparent transition-all duration-300"
                                >
                                    {widget.buttonText}
                                    <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        →
                                    </span>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}