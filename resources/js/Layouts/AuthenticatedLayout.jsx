import { Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Authenticated({ user, header, children }) {
    const userName = user?.name || 'Usuario';
    const userRole = user?.role || 'Vendedor'; 

    return (
        // FONDO PRINCIPAL: Profundidad VOID
        <div className="min-h-screen bg-void text-stark">
            
            {/* BARRA DE NAVEGACIÓN: Oscura con un borde neón sutil de Fuschia */}
            <nav className="p-4 shadow-[0_10px_30px_-15px_rgba(162,57,202,0.3)] bg-void/90 backdrop-blur-md border-b border-fuschia/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    <div className="flex items-center gap-4">
    <ThemeToggle /> {/* Aquí aparecerá el botón */}
    {/* ... resto de tu menú ... */}
</div>
                    {/* LOGO */}
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-2xl font-serif italic transition-all duration-300 hover:text-fuschia hover:drop-shadow-[0_0_10px_rgba(162,57,202,0.8)] text-stark">
                            Platería Adrián Matos
                        </Link>
                    </div>

                    {/* PERFIL Y BOTÓN DE SALIR */}
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stark/50">
                                {userRole}
                            </p>
                            <p className="text-sm font-serif italic text-stark">{userName}</p>
                        </div>
                        {/* Botón Salir (Efecto borde Jewel que se llena al pasar el mouse) */}
                        <Link href={route('logout')} method="post" as="button" 
                            className="px-5 py-1.5 rounded-full text-xs font-bold border border-jewel/50 text-stark transition-all duration-300 hover:bg-jewel hover:border-jewel hover:shadow-[0_0_15px_rgba(71,23,246,0.5)] hover:scale-105">
                            Salir
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HEADER (Título de la página) */}
            {header && (
                <header className="bg-void/50 border-b border-jewel/10">
                    <div className="max-w-7xl mx-auto py-6 px-8">
                        <div className="font-serif italic text-2xl tracking-wide text-stark drop-shadow-md">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-7xl mx-auto py-10 px-4 relative">
                {/* Luces de fondo sutiles para darle vida al cuerpo de la página */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-fuschia opacity-[0.03] rounded-full blur-[80px] pointer-events-none -z-10"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-jewel opacity-[0.03] rounded-full blur-[100px] pointer-events-none -z-10"></div>
                
                {children}
            </main>
        </div>
    );
}