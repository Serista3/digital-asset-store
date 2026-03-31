'use server'

import db from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { getCurrentUser } from "./user"
import { errorMessage } from "@/lib/utils"
import { CartItem } from "@/types"

export const createCheckoutSession = async function(totalPriceInCents: number, cartItems: CartItem[]){
  let checkoutUrl: string | null = null;

  try {
    const user = await getCurrentUser()
  
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Create order with pending status
    const order = await db.order.create({
      data: {
        userId: user.id,
        totalPriceInCents,
      }
    });

    // Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: `Order #${order.id.slice(0, 8)}`,
            },
            unit_amount: totalPriceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      metadata: {
        orderId: order.id,
      },
    });

    // Update strip session id
    if (session.url) {
      await db.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });
      checkoutUrl = session.url;
    }

  } catch(err) {
    console.error(err);
    return errorMessage('custom', err as Error)
  }

  // Redirect url base on success checkout
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}
