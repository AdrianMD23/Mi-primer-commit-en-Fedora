import React, { useState, useMemo, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function NuevaVenta({ auth, productos }) {
    const [codigo, setCodigo] = useState('');
    const [carrito, setCarrito] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef(null);

    const { data, setData, post, processing } = useForm({
        carrito: [],
        metodo_pago: 'Efectivo',
        total: 0
    });

    const handleBuscarAgregar = (e) => {
        e.preventDefault();
        if (!codigo.trim()) return;
        const productoEncontrado = productos.find(p => p.clave.toUpperCase() === codigo.toUpperCase());
        if (productoEncontrado) {
            if (productoEncontrado.stock <= 0) {
                setErrorMsg(`⚠️ PRODUCTO AGOTADO: "${productoEncontrado.nombre}"`);
                setTimeout(() => setErrorMsg(''), 4000);
            } else {
                agregarAlCarrito(productoEncontrado);
                setCodigo('');
                setErrorMsg('');
            }
        } else {
            setErrorMsg(`No se encontró la clave: "${codigo.toUpperCase()}"`);
            setTimeout(() => setErrorMsg(''), 3000);
        }
        if (inputRef.current) inputRef.current.focus();
    };

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id === producto.id);
            if (existe) {
                if (existe.cantidad >= producto.stock) {
                    setErrorMsg(`Stock agotado para ${producto.clave}`);
                    return prev;
                }
                return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const cambiarCantidad = (id, nueva) => {
        if (nueva < 1) return setCarrito(prev => prev.filter(i => i.id !== id));
        setCarrito(prev => prev.map(item => {
            if (item.id === id) {
                if (nueva > item.stock) {
                    setErrorMsg(`⚠️ LÍMITE ALCANZADO: Solo quedan ${item.stock} unidades`);
                    setTimeout(() => setErrorMsg(''), 3000);
                    return item;
                }
                return { ...item, cantidad: nueva };
            }
            return item;
        }));
    };

    const totalCarrito = useMemo(() => {
        return carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);
    }, [carrito]);

    useEffect(() => {
        setData(prev => ({ ...prev, carrito: carrito, total: totalCarrito }));
    }, [carrito, totalCarrito]);

    const procesarCobro = (e) => {
        e.preventDefault();
        if (carrito.length === 0 || processing) return;
        post(route('ventas.store'), {
            onSuccess: () => { setCarrito([]); setCodigo(''); setErrorMsg(''); },
            onError: (errores) => { setErrorMsg(errores.error || errores.carrito || errores.total || "Error"); }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span className="font-bold text-gray-500 uppercase text-xs">Punto de Venta</span>}>
            <Head title="Nueva Venta" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* CABECERA Y BOTÓN VOLVER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-[#03363D]">Punto de Venta</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Gestión de transacciones y salida de inventario.</p>
                    </div>
                    <Link href="/dashboard" className="text-xs font-bold text-gray-400 hover:text-[#03363D] transition-colors uppercase tracking-widest flex items-center gap-2">
                        <span>←</span> Volver al Panel
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* IZQUIERDA: LECTOR */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                        <h3 className="font-black text-gray-800 mb-6 uppercase tracking-widest text-xs">Escáner de Productos</h3>
                        <form onSubmit={handleBuscarAgregar}>
                            <input ref={inputRef} type="text" placeholder="SKU / CLAVE" value={codigo} onChange={(e) => setCodigo(e.target.value)}
                                   className="w-full text-center text-xl font-black py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#03363D] focus:ring-0 uppercase" autoFocus />
                        </form>
                        {errorMsg && <p className="text-red-600 text-[10px] font-bold mt-4 text-center">{errorMsg}</p>}
                        <Link href="/catalogo" className="block text-center mt-8 text-[10px] font-black text-gray-400 hover:text-[#03363D] uppercase tracking-widest transition-colors">
                            Ver catálogo completo
                        </Link>
                    </div>

                    {/* DERECHA: CARRITO Y COBRO */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 font-black text-gray-800 uppercase tracking-widest text-xs">Detalle de Venta</div>
                        
                        <div className="flex-1 p-6 space-y-3 max-h-[400px] overflow-y-auto">
                            {carrito.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 font-medium italic">Esperando productos...</div>
                            ) : (
                                carrito.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <p className="font-bold text-sm text-[#03363D]">{item.nombre}</p>
                                            <p className="text-[10px] text-gray-400 font-black uppercase">{item.clave}</p>
                                        </div>
                                        <div className="flex items-center gap-4 mx-6">
                                            <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} className="text-gray-400 hover:text-red-500 font-black">-</button>
                                            <span className="font-bold text-gray-800">{item.cantidad}</span>
                                            <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} className="text-gray-400 hover:text-emerald-500 font-black">+</button>
                                        </div>
                                        <p className="font-black text-[#03363D] w-20 text-right">${(item.precio_venta * item.cantidad).toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-black text-gray-500 uppercase tracking-widest text-xs">Total Neto</span>
                                <span className="text-4xl font-black text-[#03363D] tracking-tight">${totalCarrito.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>
                            <form onSubmit={procesarCobro} className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                                        <button key={m} type="button" onClick={() => setData('metodo_pago', m)}
                                                className={`py-3 text-[10px] font-black uppercase rounded-lg border transition-all ${data.metodo_pago === m ? 'bg-[#03363D] text-white border-[#03363D]' : 'bg-white border-gray-200 text-gray-500'}`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                                <button type="submit" disabled={carrito.length === 0 || processing}
                                        className="w-full py-4 bg-[#03363D] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#174D4D] transition-all disabled:opacity-50">
                                    {processing ? 'Procesando...' : 'Finalizar Cobro'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}