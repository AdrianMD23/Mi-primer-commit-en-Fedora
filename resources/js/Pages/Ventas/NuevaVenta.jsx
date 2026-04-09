import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function NuevaVenta({ auth }) {
    // Estado para guardar lo que vamos metiendo al ticket
    const [carrito, setCarrito] = useState([]);
    
    // Calculamos el total de la venta automáticamente
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<span>Punto de Venta</span>}
        >
            <Head title="Nueva Venta" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
                
                {/* Panel Izquierdo: Buscador y Catálogo */}
                <div className="w-full md:w-2/3 rounded-2xl shadow-xl p-8" style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                    <h2 className="text-3xl font-serif italic mb-6">Catálogo de Productos</h2>
                    
                    <input 
                        type="text" 
                        placeholder="Buscar por clave o nombre (Ej. AN-001)" 
                        className="w-full p-4 rounded-xl border-2 mb-8 focus:outline-none focus:ring-0 transition-colors"
                        style={{ borderColor: 'rgba(74, 14, 46, 0.2)', backgroundColor: 'transparent' }}
                    />
                    
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl opacity-60" style={{ borderColor: 'rgba(74, 14, 46, 0.3)' }}>
                        <span className="text-4xl mb-4">🔍</span>
                        <p className="font-serif italic text-lg">
                            Busca una joya, prenda o artesanía para agregarla al ticket.
                        </p>
                    </div>
                </div>

                {/* Panel Derecho: El Ticket / Carrito */}
                <div className="w-full md:w-1/3 rounded-2xl shadow-2xl p-8 flex flex-col justify-between" style={{ backgroundColor: '#3a0b24', color: '#e8dcc8' }}>
                    <div>
                        <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'rgba(232, 220, 200, 0.2)' }}>
                            <h2 className="text-2xl font-serif italic">Ticket Actual</h2>
                            <span className="text-xs font-bold px-2 py-1 rounded bg-[#e8dcc8] text-[#4a0e2e] uppercase tracking-widest">
                                Folio: PENDIENTE
                            </span>
                        </div>

                        {carrito.length === 0 ? (
                            <div className="text-center py-12 opacity-70">
                                <p className="italic">El carrito está vacío</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {/* Aquí se dibujarán los productos que Marco seleccione más adelante */}
                            </ul>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t" style={{ borderColor: 'rgba(232, 220, 200, 0.2)' }}>
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-lg opacity-80 uppercase tracking-widest text-[10px] font-bold">Total a Cobrar</span>
                            <span className="text-4xl font-serif italic">${total.toFixed(2)}</span>
                        </div>
                        
                        <button className="w-full py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg"
                                style={{ backgroundColor: '#e8dcc8', color: '#4a0e2e' }}>
                            Generar Nota de Venta
                        </button>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}