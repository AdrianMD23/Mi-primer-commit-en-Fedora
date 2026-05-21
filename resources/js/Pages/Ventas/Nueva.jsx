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
            // Evaluamos si el producto existe PERO su stock es 0 (o menor)
            if (productoEncontrado.stock <= 0) {
                setErrorMsg(`⚠️ PRODUCTO AGOTADO: "${productoEncontrado.nombre}"`);
                setTimeout(() => setErrorMsg(''), 4000); // Lo dejamos 4 segs para que lo lean
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
        // 1. Si presionan el botón "-" hasta llegar a 0, lo quitamos del carrito
        if (nueva < 1) return setCarrito(prev => prev.filter(i => i.id !== id));

        // 2. Si quieren aumentar, verificamos el stock antes de actualizar
        setCarrito(prev => prev.map(item => {
            if (item.id === id) {
                // EL CANDADO: Si el nuevo número supera el stock real...
                if (nueva > item.stock) {
                    setErrorMsg(`⚠️ LÍMITE ALCANZADO: Solo quedan ${item.stock} unidades de ${item.nombre}`);
                    setTimeout(() => setErrorMsg(''), 3000); // Mostramos la alerta neón por 3 segundos
                    return item; // Cancelamos el aumento y lo dejamos con el número que ya tenía
                }
                
                // Si todo está bien, actualizamos la cantidad
                return { ...item, cantidad: nueva };
            }
            return item;
        }));
    };

    const totalCarrito = useMemo(() => {
        return carrito.reduce((acc, item) => acc + (item.precio_venta * item.cantidad), 0);
    }, [carrito]);

    // --- NUEVO: Sincroniza el carrito de React con el formulario de Inertia automáticamente ---
    useEffect(() => {
        setData(prev => ({
            ...prev,
            carrito: carrito,
            total: totalCarrito
        }));
    }, [carrito, totalCarrito]);

   const procesarCobro = (e) => {
        e.preventDefault();
        
        if (carrito.length === 0 || processing) return;

        post(route('ventas.store'), {
            onSuccess: () => {
                setCarrito([]);
                setCodigo('');
                setErrorMsg('');
            },
            onError: (errores) => {
                console.error("Error oculto:", errores);
                // Aquí atrapamos el error exacto y lo mandamos a la alerta roja
                const mensajeReal = errores.error || errores.carrito || errores.total || "Error desconocido";
                setErrorMsg(mensajeReal);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<span>Punto de Venta Premium</span>}>
            <Head title="Nueva Venta" />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
                    
                    {/* LADO IZQUIERDO: LECTOR (CRISTAL OSCURO + NEÓN) */}
                    <div className="lg:w-1/2 flex flex-col justify-center items-center rounded-3xl shadow-[0_0_40px_rgba(71,23,246,0.15)] p-10 border border-jewel/30 bg-white/5 backdrop-blur-md relative overflow-hidden group">
                        
                        {/* Brillo de fondo sutil */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-jewel/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-jewel/20 transition-all duration-700"></div>
                        
                        <div className="text-center w-full max-w-md relative z-10">
                            <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(71,23,246,0.6)]">💎</div>
                            <h3 className="text-3xl font-serif italic mb-6 text-stark drop-shadow-md">Escáner de Joyería</h3>

                            <form onSubmit={handleBuscarAgregar} className="relative">
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    placeholder="ESCANEAR CLAVE..." 
                                    value={codigo} 
                                    onChange={(e) => setCodigo(e.target.value)}
                                    className="w-full rounded-2xl bg-void/80 border-2 border-jewel/50 py-5 px-6 shadow-inner text-3xl font-black text-center uppercase tracking-widest focus:ring-4 focus:ring-fuschia/30 focus:border-fuschia text-fuschia placeholder-stark/20 transition-all"
                                    autoFocus
                                />
                                {errorMsg && (
                                    <div className="absolute -bottom-12 left-0 right-0 text-red-400 font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce text-xs">
                                        {errorMsg}
                                    </div>
                                )}
                            </form>
                            <Link href="/catalogo" className="mt-12 inline-block text-stark/50 hover:text-fuschia text-xs uppercase tracking-widest font-black transition-colors">
                                Ver catálogo completo
                            </Link>
                        </div>
                    </div>

                    {/* LADO DERECHO: TICKET (CRISTAL TRANSLÚCIDO) */}
                    <div className="lg:w-1/2 flex flex-col rounded-3xl shadow-[0_0_30px_rgba(162,57,202,0.1)] p-8 bg-white/5 backdrop-blur-md border border-jewel/20">
                        
                        <h3 className="text-xl font-serif italic mb-6 border-b border-stark/10 pb-4 flex justify-between items-center text-stark">
                            <span>Detalle de Venta</span>
                            <span className="text-[10px] font-sans font-black text-fuschia uppercase tracking-widest">ID: {auth.user.id}</span>
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
                            {carrito.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-40 italic text-stark font-bold">
                                    <p>Esperando productos...</p>
                                </div>
                            ) : (
                                carrito.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-void/50 p-4 rounded-2xl border border-jewel/20 hover:border-fuschia/50 transition-colors group">
                                        <div className="flex-1">
                                            <p className="font-black text-[10px] text-fuschia uppercase tracking-widest">{item.clave}</p>
                                            <p className="text-sm font-bold text-stark opacity-90 drop-shadow-sm">{item.nombre}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mx-4">
                                            <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} className="w-8 h-8 rounded-full border border-stark/30 text-stark flex items-center justify-center font-bold hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_10px_rgba(162,57,202,0.6)] transition-all">-</button>
                                            <span className="font-black text-stark text-lg">{item.cantidad}</span>
                                            <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} className="w-8 h-8 rounded-full border border-stark/30 text-stark flex items-center justify-center font-bold hover:bg-fuschia hover:border-fuschia hover:shadow-[0_0_10px_rgba(162,57,202,0.6)] transition-all">+</button>
                                        </div>
                                        <p className="font-black text-lg text-stark drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">${(item.precio_venta * item.cantidad).toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-stark/20">
                            <div className="flex justify-between items-end mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-stark/60">Total Neto</span>
                                <span className="text-5xl font-black text-stark drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">${totalCarrito.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>

                            <form onSubmit={procesarCobro}>
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                                        <button key={m} type="button" 
                                                onClick={() => setData('metodo_pago', m)}
                                                className={`py-3 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
                                                    data.metodo_pago === m 
                                                    ? 'bg-jewel/30 text-stark border-jewel shadow-[0_0_15px_rgba(71,23,246,0.5)]' 
                                                    : 'bg-void/30 border-stark/10 text-stark/50 hover:border-stark/30 hover:text-stark/80'
                                                }`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                                <button type="submit" disabled={carrito.length === 0 || processing}
                                        className="w-full py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 uppercase tracking-widest bg-gradient-to-r from-jewel to-fuschia text-stark shadow-[0_10px_20px_-10px_rgba(71,23,246,0.6)] hover:shadow-[0_15px_25px_-5px_rgba(162,57,202,0.8)]">
                                    {processing ? 'Registrando...' : 'Finalizar Cobro'}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}