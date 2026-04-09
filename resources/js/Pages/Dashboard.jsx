import { Link, Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    // Jalamos los datos compartidos desde Laravel
    const { auth } = usePage().props;
    const user = auth?.user;

    // Esto te ayudará a ver en la consola si los datos llegaron bien
    console.log("Usuario en Dashboard:", user);

    return (
        <AuthenticatedLayout
            user={user}
            header={<span>Panel de Control</span>}
        >
            <Head title="Dashboard" />

            {/* Banner de Bienvenida */}
            <div className="rounded-2xl p-10 mb-10 shadow-2xl flex items-center justify-between" 
                 style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                <div>
                    <h1 className="text-4xl font-serif italic mb-2">
                        Bienvenido, {user?.name || 'Usuario'}
                    </h1>
                    <p className="text-sm tracking-widest uppercase font-bold opacity-70">
                        Estado: En Línea | Rol: {user?.role || 'Cargando...'}
                    </p>
                </div>
                <div className="text-6xl opacity-20 hidden lg:block">✧</div>
            </div>

            {/* Tarjetas de Acción según Rol */}
            {(user?.role === 'admin' || user?.role === 'gerente') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Control de Almacén */}
                    <div className="p-8 rounded-2xl border transition-all hover:translate-y-[-5px]" 
                         style={{ backgroundColor: '#3a0b24', borderColor: '#e8dcc8' }}>
                        <h4 className="text-xl font-serif italic mb-4" style={{ color: '#e8dcc8' }}>Control de Almacén</h4>
                        <p className="text-sm mb-8 opacity-70" style={{ color: '#e8dcc8' }}>
                            Gestión técnica de existencias y flujo de mercancía de platería.
                        </p>
                        <Link href={route('inventario.index')} 
                              className="inline-block w-full text-center py-3 rounded-full font-bold text-sm transition-colors"
                              style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                            Gestionar Stock
                        </Link>
                    </div>

                    {/* Gestión de Cortes */}
                    <div className="p-8 rounded-2xl border transition-all hover:translate-y-[-5px]" 
                         style={{ backgroundColor: '#3a0b24', borderColor: '#e8dcc8' }}>
                        <h4 className="text-xl font-serif italic mb-4" style={{ color: '#e8dcc8' }}>Cierre de Ventas</h4>
                        <p className="text-sm mb-8 opacity-70" style={{ color: '#e8dcc8' }}>
                            Auditoría de notas de vendedor y validación de corte de caja.
                        </p>
                        <Link href={route('gerencia.cortes')} 
                              className="inline-block w-full text-center py-3 rounded-full font-bold text-sm bg-green-800 text-white hover:bg-green-700">
                            Ver Notas Pendientes
                        </Link>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}