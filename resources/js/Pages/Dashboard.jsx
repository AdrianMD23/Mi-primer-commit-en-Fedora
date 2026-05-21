import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stockAlerts }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const userRole = user?.role || 'Vendedor';

    const isBoss = userRole === 'Administrador' || userRole === 'Gerente';

    const roleWidgets = {
        'Administrador': [
            { title: 'Usuarios', description: 'Administra cuentas y roles.', href: '/admin/usuarios', buttonText: 'Gestionar', icon: '👥' },
            { title: 'Inventario', description: 'Gestión de existencias y precios.', href: '/inventario', buttonText: 'Ver Almacén', icon: '📦' },
            { title: 'Auditoría de Movimientos', description: 'Historial de entradas, mermas y ajustes.', href: '/gerencia/movimientos', buttonText: 'Ver Historial', icon: '🕵️‍♂️' },
            { title: 'Proveedores', description: 'Directorio de mayoristas y talleres de platería.', href: '/admin/proveedores', buttonText: 'Ver Directorio', icon: '🤝' },
            { title: 'Categorías de Joyas', description: 'Administración de familias y clasificaciones de stock.', href: '/admin/categorias', buttonText: 'Gestionar', icon: '🏷️' },
            // { title: 'Configuración Global', description: 'Ajustes de tickets, datos de la tienda y preferencias.', href: route('admin.configuracion.index'), buttonText: 'Ajustar Sistema', icon: '⚙️' },
            { 
                title: 'Respaldos de Sistema', 
                description: 'Copias de seguridad de la base de datos y prevención.', 
                href: '/respaldo/descargar',
                buttonText: 'Descargar Respaldo', 
                icon: '💾' 
            },
        ],
        'Gerente': [
            { title: 'Inventario', description: 'Gestión técnica de existencias.', href: '/inventario', buttonText: 'Ver Almacén', icon: '📦' },
            { title: 'Gestión de Cortes', description: 'Validación de caja diaria.', href: '/gerencia/cortes', buttonText: 'Revisar', icon: '📊' },
            { title: 'Auditoría de Movimientos', description: 'Historial de entradas, mermas y ajustes.', href: '/gerencia/movimientos', buttonText: 'Ver Historial', icon: '🕵️‍♂️' },
            { title: 'Reportes y Estadísticas', description: 'Rendimiento de vendedores y ganancias.', href: '/gerencia/reportes', buttonText: 'Ver Reportes', icon: '📈' },
            { title: 'Control de Gastos', description: 'Registro de salidas de dinero en sucursal.', href: '/gerencia/gastos', buttonText: 'Gestionar Gastos', icon: '💸' },
        ],
        'Vendedor': [
            { title: 'Punto de Venta', description: 'Registra una nueva transacción.', href: '/ventas/nueva', buttonText: 'Crear Venta', icon: '🛒' },
            { title: 'Consultar Catálogo', description: 'Verifica precios y existencias al instante.', href: '/catalogo', buttonText: 'Buscar Pieza', icon: '🔍' },
            { title: 'Mis Ventas', description: 'Historial de tus tickets y devoluciones.', href: '/ventas/historial', buttonText: 'Ver Historial', icon: '📜' },
            { title: 'Mi Turno', description: 'Resumen de tu efectivo cobrado hoy.', href: '/ventas/mi-corte', buttonText: 'Ver Mi Caja', icon: '💵' },
        ]
    };
    
    const widgets = roleWidgets[userRole] || roleWidgets['Vendedor'];

    return (
        <AuthenticatedLayout user={user} header={<span>Panel de Control</span>}>
            <Head title="Dashboard" />

            {/* BANNER DE BIENVENIDA (Cristalino Oscuro con borde Neón) */}
            <div className="rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(71,23,246,0.15)] flex items-center justify-between bg-white/5 backdrop-blur-sm border border-jewel/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-fuschia/20 to-transparent rounded-bl-full pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-serif italic mb-1 text-stark drop-shadow-md">Bienvenido, {user?.name}</h1>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-stark/50">
                        Sesión Iniciada como <span className="text-fuschia">{userRole}</span>
                    </p>
                </div>
                {/* Ícono de Brillo/✧ con tu color Fuschia */}
                <div className="text-5xl opacity-40 hidden md:block text-fuschia relative z-10 animate-pulse">✧</div>
            </div>

            {/* SECCIÓN DE ALERTAS DE STOCK */}
            {isBoss && stockAlerts && stockAlerts.length > 0 && (
                <div className="mb-10 animate-pulse">
                    <div className="bg-fuschia/10 border border-fuschia/50 rounded-2xl p-6 shadow-[0_0_20px_rgba(162,57,202,0.2)]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl drop-shadow-[0_0_10px_rgba(162,57,202,0.8)]">⚠️</span>
                            <h3 className="text-xl font-bold text-stark">Atención: Stock Crítico</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {stockAlerts.map(item => (
                                <div key={item.id} className="bg-void/60 p-3 rounded-lg flex justify-between items-center border border-fuschia/30">
                                    <div>
                                        <p className="text-stark font-bold text-sm">{item.nombre}</p>
                                        <p className="text-fuschia text-[10px] uppercase font-bold">{item.clave}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-black">{item.stock}</p>
                                        <p className="text-[9px] text-stark/60 uppercase">Quedan</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <Link href="/inventario" className="text-xs font-bold text-fuschia hover:text-stark hover:underline uppercase tracking-widest transition-colors">
                                Ir al inventario para reabastecer →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* GRID DE TARJETAS DE MÓDULOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget, index) => (
                    <div key={index} className="p-6 rounded-2xl border border-jewel/30 bg-gradient-to-br from-void via-jewel/10 to-fuschia/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-fuschia/60 hover:shadow-[0_0_30px_rgba(162,57,202,0.3)] group relative overflow-hidden">
                        
                        {/* LUZ INTERNA: Una "esfera" de luz Fuschia escondida en la esquina superior */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuschia/20 rounded-full blur-[40px] group-hover:bg-fuschia/40 transition-colors duration-500"></div>

                        {/* Contenido del widget */}
                        <div className="text-3xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 origin-left relative z-10">
                            {widget.icon}
                        </div>
                        
                        <h4 className="text-lg font-serif italic mb-2 text-stark relative z-10">
                            {widget.title}
                        </h4>
                        
                        <p className="text-xs mb-6 text-stark/60 relative z-10">
                            {widget.description}
                        </p>
                        
                        {/* 
                            EVALUACIÓN CONDICIONAL: 
                            Si es "Respaldos de Sistema", usamos la etiqueta <a> para forzar la descarga. 
                            Para cualquier otro, usamos <Link> de Inertia.
                        */}
                        {widget.title === 'Respaldos de Sistema' ? (
                            <a 
                                href={widget.href} 
                                download="respaldo_base_de_datos.sql"
                                className="inline-block w-full text-center py-3 rounded-xl font-black text-xs transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] uppercase tracking-wider bg-gradient-to-r from-jewel to-fuschia text-stark group-hover:-translate-y-1 relative z-10"
                            >
                                {widget.buttonText}
                            </a>
                        ) : (
                            <Link 
                                href={widget.href} 
                                className="inline-block w-full text-center py-3 rounded-xl font-black text-xs transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] uppercase tracking-wider bg-gradient-to-r from-jewel to-fuschia text-stark group-hover:-translate-y-1 relative z-10"
                            >
                                {widget.buttonText}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
