import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ConfiguracionIndex({ auth, configuracion }) {
    const { flash } = usePage().props;

    // Formulario con los datos de tu tienda
    const { data, setData, post, processing, errors } = useForm({
        nombre_tienda: configuracion?.nombre_tienda || 'Platería Adrián Matos',
        rfc: configuracion?.rfc || '',
        direccion: configuracion?.direccion || '',
        telefono: configuracion?.telefono || '',
        mensaje_ticket: configuracion?.mensaje_ticket || '¡Gracias por su compra!',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.configuracion.update'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Configuración del Sistema</span>}>
            <Head title="Configuración Global" />

            <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="mb-8">
                    <h2 className="text-4xl font-serif italic text-stark drop-shadow-md">Configuración Global</h2>
                    <p className="text-sm opacity-60 mt-1 text-stark uppercase tracking-widest font-bold">
                        Ajustes de tickets, datos de la tienda y preferencias.
                    </p>
                </div>

                {/* ALERTAS NEÓN */}
                {flash?.success && (
                    <div className="mb-8 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 p-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] font-black tracking-widest text-xs">
                        ✅ {flash.success}
                    </div>
                )}

                {/* PANEL DE CRISTAL OSCURO */}
                <div className="bg-white/5 backdrop-blur-md border border-jewel/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.15)] relative overflow-hidden group">
                    {/* Brillo de fondo sutil */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-jewel/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-jewel/20 transition-all duration-700"></div>

                    <form onSubmit={submit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Nombre de la Tienda */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">Nombre Comercial *</label>
                                <input 
                                    type="text" 
                                    value={data.nombre_tienda} 
                                    onChange={e => setData('nombre_tienda', e.target.value)}
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-all text-lg font-bold"
                                />
                                {errors.nombre_tienda && <p className="text-fuschia text-xs mt-1 font-bold">{errors.nombre_tienda}</p>}
                            </div>

                            {/* RFC */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">RFC / Identificación Fiscal</label>
                                <input 
                                    type="text" 
                                    value={data.rfc} 
                                    onChange={e => setData('rfc', e.target.value)}
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-all font-mono"
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">Teléfono de Contacto</label>
                                <input 
                                    type="text" 
                                    value={data.telefono} 
                                    onChange={e => setData('telefono', e.target.value)}
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-all"
                                />
                            </div>

                            {/* Dirección */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">Dirección Física</label>
                                <input 
                                    type="text" 
                                    value={data.direccion} 
                                    onChange={e => setData('direccion', e.target.value)}
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-all"
                                />
                            </div>

                            {/* Mensaje del Ticket */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-stark/80 mb-2">Mensaje al pie del Ticket</label>
                                <textarea 
                                    value={data.mensaje_ticket} 
                                    onChange={e => setData('mensaje_ticket', e.target.value)}
                                    rows="3"
                                    className="w-full rounded-xl bg-void/50 border border-jewel/30 text-stark focus:ring-fuschia focus:border-fuschia transition-all italic text-sm"
                                    placeholder="Ej. No se aceptan devoluciones después de 30 días..."
                                ></textarea>
                            </div>
                        </div>

                        {/* BOTÓN AJUSTAR SISTEMA (NEÓN) */}
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-jewel to-fuschia text-stark rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)] hover:-translate-y-1 transition-all disabled:opacity-50"
                            >
                                {processing ? 'Actualizando...' : 'Ajustar Sistema'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}