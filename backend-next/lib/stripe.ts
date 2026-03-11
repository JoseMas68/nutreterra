import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    // En desarrollo, si no existe la clave, usamos una dummy para evitar que el servidor pete al importar
    // Importante: No funcionará ningún pago real hasta que se configure la clave
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2024-12-18.acacia' as any, // Forzar la versión más reciente compatible
    typescript: true,
});
