import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'eur', metadata } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: 'Monto requerido' }, { status: 400 });
        }

        // Crear el Payment Intent en Stripe
        // El monto debe estar en céntimos
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            metadata: metadata || {},
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('Stripe PaymentIntent error:', error);
        return NextResponse.json(
            { error: error.message || 'Error al crear el intento de pago' },
            { status: 500 }
        );
    }
}
