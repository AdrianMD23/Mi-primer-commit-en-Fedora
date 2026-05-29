import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';

export default function Catalogo({ auth, productos, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('catalogo.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold tracking-tight text-gray-500 uppercase text-xs">Catálogo de Joyería</span>}>
            <Head title="Catálogo de Joyería" />

            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA CON BOTÓN VOLVER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Catálogo de Piezas</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Consulta de precios y existencias en tiempo real.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                {/* BUSCADOR */}
                <div className="mb-12 max-w-xl mx-auto">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Buscar por clave o nombre..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 rounded-xl border-gray-200 bg-white py-3 px-4 text-sm focus:ring-[#03363D] focus:border-[#03363D] shadow-sm"
                        />
                        <button type="submit" className="px-6 py-3 bg-[#03363D] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#174D4D] transition-all">
                            Buscar
                        </button>
                    </form>
                </div>

                {/* GRID DE PRODUCTOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productos.data.map((producto) => (
                        <div key={producto.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                            <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                                {producto.imagen ? (
                                    <img src={`/storage/${producto.imagen}`} alt={producto.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{producto.clave}</span>
                                    <span className={`text-[9px] font-black uppercase ${producto.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'}
                                    </span>
                                </div>
                                
                                <h3 className="font-bold text-gray-800 text-sm mb-1">{producto.nombre}</h3>
                                <p className="text-[10px] text-gray-500 mb-4 uppercase tracking-widest font-medium">
                                    {producto.categoria?.nombre || 'General'} • {producto.peso_gramos}g
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xl font-black text-[#03363D]">
                                        ${Number(producto.precio_venta).toLocaleString('es-MX', {minimumFractionDigits: 2})}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {productos.data.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 font-bold text-lg">No se encontraron piezas con ese nombre o clave.</p>
                        <button onClick={() => { setSearch(''); router.get(route('catalogo.index')); }} className="text-[#03363D] font-black underline mt-2 text-xs uppercase">Limpiar búsqueda</button>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}