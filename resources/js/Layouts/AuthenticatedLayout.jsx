import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const userName = user?.name || 'Usuario';
    const userRole = user?.role || 'Vendedor'; // <-- Corrección 1: Mayúscula inicial

    // 1. DEFINICIÓN DE MENÚS (Configuración centralizada)
    // <-- Corrección 2: Las llaves ahora coinciden exacto con la DB
    const menuLinks = {
        'Administrador': [
            { label: 'Inicio', href: '/dashboard', icon: '🏠' },
            { label: 'Usuarios', href: '/admin/usuarios', icon: '👥' },
            { label: 'Inventario', href: '/inventario', icon: '📦' },
            { label: 'Gestión de Cortes', href: '/gerencia/cortes', icon: '📊' },
        ],
        'Gerente': [
            { label: 'Inicio', href: '/dashboard', icon: '🏠' },
            { label: 'Inventario', href: '/inventario', icon: '📦' },
            { label: 'Gestión de Cortes', href: '/gerencia/cortes', icon: '📊' },
        ],
        'Vendedor': [
            { label: 'Inicio', href: '/dashboard', icon: '🏠' },
            { label: 'Nueva Venta', href: '/ventas/nueva', icon: '➕' },
            { label: 'Mis Ventas', href: '/ventas/historial', icon: '📜' },
        ]
    };

    // Seleccionamos los links según el rol (si no existe el rol, por defecto Vendedor)
    const currentLinks = menuLinks[userRole] || menuLinks['Vendedor'];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#4a0e2e' }}>
            <nav style={{ backgroundColor: '#4a0e2e', borderBottom: '1px solid #e8dcc8' }} className="p-4 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex gap-8 items-center">
                        <Link href="/dashboard" className="text-2xl font-serif italic" style={{ color: '#e8dcc8' }}>
                            Platería Adrián
                        </Link>
                        
                        {/* 2. RENDERIZADO DINÁMICO DEL MENÚ */}
                        <div className="hidden sm:flex space-x-4">
                            {currentLinks.map((link, index) => (
                                <Link 
                                    key={index} 
                                    href={link.href} 
                                    className="text-sm font-medium px-3 py-1 rounded-md transition-all hover:bg-[#e8dcc8]/10" 
                                    style={{ color: '#e8dcc8' }}
                                >
                                    {link.icon} {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#e8dcc8', opacity: 0.6 }}>
                                {userRole}
                            </p>
                            <p className="text-sm font-serif italic" style={{ color: '#e8dcc8' }}>{userName}</p>
                        </div>
                        <Link href={route('logout')} method="post" as="button" 
                            className="px-5 py-1.5 rounded-full text-xs font-bold border transition-all hover:bg-[#e8dcc8] hover:text-[#4a0e2e]"
                            style={{ borderColor: '#e8dcc8', color: '#e8dcc8' }}>
                            Salir
                        </Link>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="shadow-lg" style={{ backgroundColor: '#e8dcc8' }}>
                    <div className="max-w-7xl mx-auto py-6 px-8">
                        <div style={{ color: '#4a0e2e' }} className="font-serif italic text-2xl">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            <main className="max-w-7xl mx-auto py-10 px-4">
                {children}
            </main>
        </div>
    );
}