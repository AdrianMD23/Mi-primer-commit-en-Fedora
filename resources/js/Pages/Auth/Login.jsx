import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

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
        // Contenedor principal: Velvet (#4a0e2e)
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0" style={{ backgroundColor: '#4a0e2e' }}>
            
            <Head title="Bienvenido" />

            {/* Tarjeta de Login: Bone (#e8dcc8) */}
            <div className="w-full sm:max-w-md mt-6 px-8 py-10 shadow-2xl overflow-hidden sm:rounded-2xl" style={{ backgroundColor: '#e8dcc8' }}>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif italic" style={{ color: '#4a0e2e' }}>Bienvenido</h2>
                    <p className="text-xs tracking-widest uppercase font-bold mt-1" style={{ color: '#4a0e2e', opacity: 0.7 }}>
                        Sistema de Gestión
                    </p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="username" value="Nombre de Usuario" style={{ color: '#4a0e2e' }} />
                        <TextInput
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full border-none shadow-inner bg-white/50 focus:ring-2 focus:ring-[#4a0e2e]"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('username', e.target.value)}
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Contraseña" style={{ color: '#4a0e2e' }} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-none shadow-inner bg-white/50 focus:ring-2 focus:ring-[#4a0e2e]"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                style={{ color: '#4a0e2e' }}
                            />
                            <span className="ms-2 text-xs font-bold uppercase tracking-tighter" style={{ color: '#4a0e2e' }}>Recuérdame</span>
                        </label>
                        
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs hover:underline"
                                style={{ color: '#4a0e2e', opacity: 0.6 }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            className="w-full py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
                            style={{ backgroundColor: '#4a0e2e', color: '#e8dcc8' }}
                            disabled={processing}
                        >
                            Entrar al Sistema
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-[10px] tracking-[0.3em] font-bold uppercase" style={{ color: '#e8dcc8' }}>
                    Orgullosamente Artesanal
                </p>
            </div>
        </div>
    );
}