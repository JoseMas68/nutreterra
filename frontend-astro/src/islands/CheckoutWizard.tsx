import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, clearCart } from '../stores/cartStore';
import { addresses, type Address } from '../stores/addressStore';
import ProductCard from './ProductCard'; // O uno resumido

interface Props {
    apiUrl: string;
}

type Step = 'address' | 'review' | 'payment' | 'success';

export default function CheckoutWizard({ apiUrl }: Props) {
    const $cartItems = useStore(cartItems);
    const $addresses = useStore(addresses);
    const items = Object.values($cartItems);

    const [step, setStep] = useState<Step>('address');
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        // Seleccionar dirección por defecto si existe
        if ($addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = $addresses.find(a => a.isDefault) || $addresses[0];
            setSelectedAddressId(defaultAddr.id);
        }
    }, [$addresses]);

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // 1. Crear el pedido en el backend
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product?.price })),
                    total: calculateTotal(),
                }),
            });

            if (!response.ok) throw new Error('Error al crear el pedido');
            const order = await response.json();

            setOrderId(order.id);
            setStep('payment');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentComplete = () => {
        clearCart();
        setStep('success');
    };

    if (items.length === 0 && step !== 'success') {
        return (
            <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold mb-4">No hay productos en el carrito</h2>
                <a href="/productos" className="text-primary font-bold hover:underline">Ir a la tienda</a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Indicador de Pasos */}
            <div className="flex bg-gray-50 border-b border-gray-100 p-4 md:p-6 justify-center gap-4 md:gap-12">
                <div className={`flex items-center gap-2 ${step === 'address' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'address' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>1</span>
                    <span className="hidden md:inline">Dirección</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 'review' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'review' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>2</span>
                    <span className="hidden md:inline">Revisión</span>
                </div>
                <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary font-bold' : 'text-gray-400'}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>3</span>
                    <span className="hidden md:inline">Pago</span>
                </div>
            </div>

            <div className="p-6 md:p-10">
                {step === 'address' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Elige tu dirección de envío</h2>
                        {$addresses.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-6">No tienes direcciones guardadas.</p>
                                <a href="/cuenta/perfil" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Añadir Dirección</a>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-8">
                                {$addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-900">{addr.name}</p>
                                                <p className="text-sm text-gray-600">{addr.fullName} - {addr.street}, {addr.city}</p>
                                            </div>
                                            {selectedAddressId === addr.id && (
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                disabled={!selectedAddressId}
                                onClick={() => setStep('review')}
                                className="px-8 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-leaf transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {step === 'review' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Revisa tu pedido</h2>
                        <div className="space-y-4 mb-8">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <div className="flex gap-4 items-center">
                                        <img src={item.product?.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-sm md:text-base">{item.product?.name}</p>
                                            <p className="text-xs md:text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold">{((item.product?.price || 0) * item.quantity).toFixed(2)}€</p>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 text-xl font-black">
                                <span>Total</span>
                                <span className="text-primary">{calculateTotal().toFixed(2)}€</span>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <button onClick={() => setStep('address')} className="px-8 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600">Atrás</button>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="flex-1 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-leaf transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : 'Confirmar y Pagar'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Procesando Pago</h2>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                            Simulando integración con Stripe... En un entorno real, aquí aparecerían los campos de tarjeta.
                        </p>
                        <button
                            onClick={handlePaymentComplete}
                            className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-xl hover:shadow-xl transition-all hover:scale-105"
                        >
                            Simular Pago Exitoso
                        </button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">¡Pedido Completado!</h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
                            Gracias por confiar en NutreTerra. Hemos enviado la confirmación a tu correo electrónico.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <a href="/cuenta/pedidos" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold">Ver mis pedidos</a>
                            <a href="/" className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold">Volver al inicio</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
