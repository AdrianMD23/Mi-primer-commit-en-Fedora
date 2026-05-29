import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError'; // Mantengo tu componente de errores

export default function Login({ status, canResetPassword }) {
    // Usamos exactamente tu estructura de datos (con 'username')
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex w-full bg-[#F8F9F9] font-sans">
            <Head title="Iniciar Sesión | SILVEART" />

            {/* PANEL IZQUIERDO: Branding Corporativo */}
            <div className="hidden md:flex md:w-1/2 bg-[#03363D] flex-col justify-between p-12 relative overflow-hidden">
                {/* Elementos decorativos sutiles */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#174D4D] opacity-20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Logo / Título superior */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-[#03363D] flex items-center justify-center font-black rounded-sm text-xl shadow-lg">
                        S
                    </div>
                    <span className="text-white tracking-[0.3em] text-sm font-black uppercase">
                        Platería
                    </span>
                </div>

                {/* Mensaje Central */}
                <div className="relative z-10">
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
                        SILVEART
                    </h1>
                    <p className="text-white/70 text-lg max-w-md leading-relaxed font-light">
                        Sistema de gestión integral y punto de venta diseñado para la excelencia operativa y el control preciso de tu negocio.
                    </p>
                </div>

                {/* Pie de página del panel */}
                <div className="relative z-10 text-white/40 text-xs tracking-widest uppercase font-semibold">
                    &copy; {new Date().getFullYear()} Instituto Tecnológico Superior de Valladolid
                </div>
            </div>

            {/* PANEL DERECHO: Formulario de Login */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
                
                <div className="max-w-md w-full space-y-10">
                    
                    {/* Encabezado del Formulario */}
                    <div>
                        {/* Logo visible solo en móvil */}
                        <div className="md:hidden flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-[#03363D] text-white flex items-center justify-center font-black rounded-lg text-2xl shadow-lg">
                                S
                            </div>
                            <span className="text-[#03363D] tracking-tighter text-2xl font-black">
                                SILVEART
                            </span>
                        </div>
                        
                        <h2 className="text-3xl font-black text-[#03363D] tracking-tight">
                            Bienvenido de vuelta
                        </h2>
                        <p className="text-sm text-[#03363D]/60 mt-2 font-medium">
                            Por favor, ingresa tus credenciales para acceder a tu panel de control.
                        </p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* CAMPO USUARIO */}
                        <div>
                            <label htmlFor="username" className="block text-xs font-black tracking-widest text-[#03363D]/80 uppercase mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-[#03363D] placeholder-gray-400 shadow-sm focus:border-[#03363D] focus:ring-[#03363D] transition-colors"
                                autoComplete="username"
                                placeholder="Ingresa tu usuario"
                                autoFocus
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            {/* Usamos tu componente InputError */}
                            <InputError message={errors.username} className="mt-2 text-red-500 font-bold text-xs" />
                        </div>

                        {/* CAMPO CONTRASEÑA */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="block text-xs font-black tracking-widest text-[#03363D]/80 uppercase">
                                    Contraseña
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full rounded-lg border-gray-300 bg-white px-4 py-3 text-[#03363D] placeholder-gray-400 shadow-sm focus:border-[#03363D] focus:ring-[#03363D] transition-colors"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-500 font-bold text-xs" />
                        </div>

                        {/* CHECKBOX RECORDARME */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-[#03363D] shadow-sm focus:ring-[#03363D] transition-colors"
                                />
                                <span className="ml-2 text-sm text-[#03363D]/70 font-medium group-hover:text-[#03363D] transition-colors">
                                    Mantener sesión iniciada
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-bold text-[#03363D]/60 hover:text-[#03363D] transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        {/* BOTÓN DE SUBMIT */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg shadow-[#03363D]/20 text-sm font-black tracking-widest uppercase text-white bg-gradient-to-r from-[#03363D] to-[#174D4D] hover:from-[#02262B] hover:to-[#03363D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03363D] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Autenticando...' : 'Ingresar al Sistema'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}