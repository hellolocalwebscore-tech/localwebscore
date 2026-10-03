import { NextResponse } from "next/server";
import Stripe from "stripe";

// Inicializamos Stripe con tu clave secreta del .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    // 1. Detectamos la URL real donde está alojada la web ANTES de llamar a Stripe
    const origin = req.headers.get("origin") || "https://localwebscore.vercel.app";

    // 2. Creamos la sesión de pago RECURRENTE (Suscripción B2B)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1UMQa9BkIEzLSsw4SLSxqF7l", // <-- Tu ID de suscripción de 19€/mes
          quantity: 1,
        },
      ],
      mode: "subscription", // Magia: Esto automatiza el cobro mes a mes
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}