import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Catalogo({ auth, productos, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('catalogo.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Consulta de Precios</span>}>
            <Head title="Catálogo de Joyería" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* BUSCADOR ESTILIZADO (Cristal Oscuro) */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-serif italic mb-6 text-stark drop-shadow-md">Catálogo de Piezas</h2>
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                        {/* Resplandor de fondo para el buscador */}
                        <div className="absolute inset-0 bg-jewel/20 rounded-full blur-[20px] group-hover:bg-fuschia/20 transition-all duration-500"></div>
                        
                        <input 
                            type="text" 
                            placeholder="Buscar por clave o nombre de joya..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full py-4 px-8 border border-jewel/30 bg-void/80 backdrop-blur-md shadow-[0_0_30px_rgba(71,23,246,0.15)] text-lg text-stark focus:ring-2 focus:ring-fuschia focus:border-fuschia placeholder-stark/30 transition-all relative z-10"
                        />
                        <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-gradient-to-r from-jewel to-fuschia text-stark font-black uppercase tracking-widest shadow-[0_0_15px_rgba(162,57,202,0.5)] hover:shadow-[0_0_25px_rgba(162,57,202,0.8)] hover:scale-105 transition-all z-20">
                            Buscar
                        </button>
                    </form>
                </div>

                {/* GRID DE PRODUCTOS (Vitrinas de Cristal) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productos.data.map((producto) => (
                        <div key={producto.id} className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(71,23,246,0.1)] bg-white/5 backdrop-blur-md border border-jewel/20 hover:border-fuschia/50 hover:shadow-[0_0_40px_rgba(162,57,202,0.2)] transition-all duration-500 hover:-translate-y-2 group flex flex-col">
                            
                            {/* --- ZONA DE IMAGEN DE LA JOYA --- */}
                            <div className="w-full h-56 bg-void/50 border-b border-jewel/30 relative overflow-hidden flex-shrink-0">
                                {producto.imagen ? (
                                    <img 
                                        src={`/storage/${producto.imagen}`} 
                                        alt={producto.nombre} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                                        <span className="text-5xl mb-2 drop-shadow-lg">📷</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stark">Sin Imagen</span>
                                    </div>
                                )}
                                {/* Gradiente oscuro en la parte inferior de la foto para que resalte el texto de abajo */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-void/90 to-transparent"></div>
                            </div>

                            {/* --- DETALLES DE LA JOYA --- */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    {/* Clave Neón */}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-jewel/20 text-[#8B5CF6] border border-jewel/50 shadow-[0_0_10px_rgba(71,23,246,0.3)]">
                                        {producto.clave}
                                    </span>
                                    
                                    {/* Stock */}
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${producto.stock > 0 ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}>
                                        {producto.stock > 0 ? `Disp: ${producto.stock}` : 'Agotado'}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-serif italic text-stark mb-2 leading-tight flex-grow drop-shadow-md">
                                    {producto.nombre}
                                </h3>
                                
                                <p className="text-[10px] opacity-50 text-stark font-black mb-4 uppercase tracking-widest">
                                    {producto.categoria?.nombre || 'General'} • {producto.talla || 'Unitalla'} • {producto.peso_gramos}g
                                </p>

                                <div className="pt-4 border-t border-stark/10 flex justify-between items-end mt-auto">
                                    <span className="text-3xl font-black text-stark drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        ${Number(producto.precio_venta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                    </span>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl text-fuschia drop-shadow-[0_0_8px_rgba(162,57,202,0.6)] group-hover:animate-pulse">
                                        ✨
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MENSAJE SI NO HAY RESULTADOS */}
                {productos.data.length === 0 && (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-jewel/20 shadow-[0_0_30px_rgba(71,23,246,0.1)]">
                        <div className="text-6xl mb-4 opacity-50 drop-shadow-lg">🔍</div>
                        <p className="text-stark font-serif italic text-2xl drop-shadow-md">No se encontraron piezas con ese nombre o clave.</p>
                        <p className="text-stark/50 text-sm mt-2 uppercase tracking-widest font-bold">Intenta con otros términos de búsqueda.</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}