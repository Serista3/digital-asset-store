'use server'

import db from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { getCurrentUser } from "./user"
import { errorMessage } from "@/lib/utils"
import { checkoutSchema, validateFormData } from "@/lib/validations"
import { removeAllProductFromCart } from "./cart"

export const createCheckoutSession = async function(cartItems: { productId: string }[]){
  let checkoutUrl: string | null = null;

  try {
    const user = await getCurrentUser()
  
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation CartItem Param
    const validationParam = validateFormData(checkoutSchema, { cartItems })
    if (!validationParam.success || !validationParam.data) throw new Error("Invalid cart data")
    
    const validParamData = validationParam.data
    const productIds = validParamData.cartItems.map(item => item.productId);

    // Fetch Products
    const products = await db.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length === 0) throw new Error("Products not found");

    // Calculate Total Price
    let calculatedTotalPrice = 0;
    const orderItemsData = products.map((product) => {
      calculatedTotalPrice += product.priceInCents;
      
      return {
        title: product.title,
        description: product.description,
        priceInCents: product.priceInCents,
        imageUrl: product.imageUrl,
        fileUrl: product.fileUrl,
      };
    });

    // Create order with pending status
    const order = await db.order.create({
      data: {
        userId: user.id,
        totalPriceInCents: calculatedTotalPrice,
        items: {
          create: orderItemsData
        }
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
            unit_amount: calculatedTotalPrice,
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

    // Remove All Cart
    await removeAllProductFromCart()

  } catch(err) {
    console.error(err);
    return errorMessage('custom', err as Error)
  }

  // Redirect url base on success checkout
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}
