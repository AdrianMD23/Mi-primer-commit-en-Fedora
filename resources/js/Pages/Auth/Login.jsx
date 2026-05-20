import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
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
        // FONDO: Profundidad absoluta con el color VOID
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#0E0B16] relative overflow-hidden px-4">
            <Head title="Bienvenido" />

            {/* LUCES DE FONDO MÁGICAS (Fuschia y Jewel mezclándose en el fondo) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A239CA] opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#4717F6] opacity-20 rounded-full blur-[100px] pointer-events-none"></div>

            {status && <div className="mb-4 font-bold text-sm text-green-400 z-10">{status}</div>}

            {/* CONTENEDOR PRINCIPAL: Tarjeta color STARK */}
            <div className="bg-[#E7DFDD] rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(71,23,246,0.15)] p-2 relative z-10 w-full max-w-md transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(162,57,202,0.2)]">
                
                {/* MARCO INTERNO */}
                <div className="border border-[#0E0B16]/10 rounded-[1.5rem] p-8 sm:p-10 bg-white/40 backdrop-blur-sm">

                    {/* ENCABEZADO */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif italic text-[#0E0B16] mb-1">Bienvenido</h2>
                        <p className="text-[9px] tracking-[0.3em] uppercase font-black text-[#0E0B16]/50">
                            Sistema de Gestión
                        </p>
                        {/* Ícono de destello usando el color FUSCHIA */}
                        <div className="mt-4 flex justify-center">
                            <span className="text-2xl text-[#A239CA] opacity-60">✧</span>
                        </div>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* INPUT USUARIO */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#0E0B16]/80 mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                className="w-full bg-transparent border-0 border-b-2 border-[#0E0B16]/10 focus:border-[#4717F6] focus:ring-0 px-2 py-2 text-[#0E0B16] placeholder-[#0E0B16]/30 font-bold transition-colors text-sm"
                                placeholder="Ingresa tu usuario"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('username', e.target.value)}
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        {/* INPUT CONTRASEÑA */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#0E0B16]/80 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full bg-transparent border-0 border-b-2 border-[#0E0B16]/10 focus:border-[#4717F6] focus:ring-0 px-2 py-2 text-[#0E0B16] placeholder-[#0E0B16]/30 font-bold transition-colors text-sm"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* RECUÉRDAME Y OLVIDÉ CONTRASEÑA */}
                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    // El checkbox se pinta de JEWEL al seleccionarse
                                    className="rounded border-[#0E0B16]/20 text-[#4717F6] shadow-sm focus:ring-[#4717F6] bg-transparent transition-colors"
                                />
                                <span className="ml-2 text-[10px] font-bold text-[#0E0B16]/60 uppercase tracking-wider group-hover:text-[#4717F6] transition-colors">
                                    Recuérdame
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    // Al pasar el mouse, brilla en FUSCHIA
                                    className="text-[10px] font-bold text-[#0E0B16]/50 hover:text-[#A239CA] underline tracking-wider transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        {/* BOTÓN DE ENTRADA (Degradado Jewel -> Fuschia) */}
                        <div className="pt-6">
                            <button
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-[#4717F6] to-[#A239CA] text-[#E7DFDD] py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_20px_-10px_rgba(162,57,202,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(71,23,246,0.7)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                            >
                                {processing ? 'Autenticando...' : 'Entrar al Sistema'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* TEXTO INFERIOR */}
            <div className="absolute bottom-8 w-full text-center z-10 pointer-events-none">
                <p className="text-[#E7DFDD]/40 text-[10px] font-bold tracking-[0.4em] uppercase">
                    Orgullosamente Artesanal
                </p>
            </div>
        </div>
    );
}