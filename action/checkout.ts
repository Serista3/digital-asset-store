'use server'

import db from "@/lib/db"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { getCurrentUser } from "./user"
import { errorMessage } from "@/lib/utils"
import { removeAllProductFromCart } from "./cart"
import { orderIdSchema, validateFormData } from "@/lib/validations"
import { OrderStatus } from "@prisma/client"
import { ActionState } from "@/types"

// Create checkout session from cart
export const createCheckoutSessionFromCart = async function(){
  let checkoutUrl: string | null = null;

  try {
    const user = await getCurrentUser()
  
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // User Cart Exists
    if(!user.cart || !user.cart.items || user.cart.items.length === 0) throw new Error('Your cart is empty')
    
    const productIds = user.cart.items.map(item => item.productId);

    // Fetch Products
    const products = await db.product.findMany({
      where: { 
        id: { 
          in: productIds 
        } 
      }
    });

    if (products.length === 0) throw new Error("Products not found");

    // Calculate Total Price
    let calcTotalPrice = 0;
    const orderItemsData = products.map((product) => {
      calcTotalPrice += product.priceInCents;
      
      return {
        title: product.title,
        description: product.description,
        priceInCents: product.priceInCents,
        imageUrl: product.imageUrl,
        fileUrl: product.fileUrl,
        productId: product.id
      };
    });

    // Create order with pending status
    const order = await db.order.create({
      data: {
        userId: user.id,
        totalPriceInCents: calcTotalPrice,
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
            unit_amount: calcTotalPrice,
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
        where: { 
          id: order.id 
        },
        data: { 
          stripeSessionId: session.id 
        },
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

// Create checkout session from order
export const createCheckoutSessionFromOrder = async function(rawOrderId: unknown){
  let checkoutUrl: string | null = null;

  try {
    const user = await getCurrentUser()
  
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation Id
    const validation = validateFormData(orderIdSchema, rawOrderId)

    if (!validation.success) throw new Error('Invalid order ID format')
    if (!validation.data) throw new Error('Order id is required')
    
    const orderId = validation.data

    // Query Order
    const order = await db.order.findFirst({
      where: { 
        id: orderId,
        userId: user.id,
        status: OrderStatus.PENDING
      }
    });

    if (!order) throw new Error("Order not found or cannot be paid");

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
            unit_amount: order.totalPriceInCents,
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
        where: { 
          id: order.id 
        },
        data: { 
          stripeSessionId: session.id 
        },
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

// Fetch stripe receipt url
export const getStripeReceiptUrl = async function(rawOrderId: unknown): Promise<ActionState<string>>{
  try {
    const user = await getCurrentUser()
  
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation Id
    const validation = validateFormData(orderIdSchema, rawOrderId)

    if (!validation.success) throw new Error('Invalid order ID format')
    if (!validation.data) throw new Error('Order id is required')
    
    const orderId = validation.data

    // Query Order
    const order = await db.order.findFirst({
      where: { 
        id: orderId,
        userId: user.id,
        status: OrderStatus.PAID
      }
    });

    if (!order || !order.stripeSessionId) {
      throw new Error("Order or Payment Session not found");
    }

    // Query Stripe Receipt Url
    const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId, {
      expand: ['payment_intent.latest_charge'],
    });

    // Reteive Receipt Url
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const latestCharge = paymentIntent?.latest_charge as Stripe.Charge;
    const receiptUrl = latestCharge?.receipt_url;

    if (!receiptUrl) throw new Error("Receipt URL not generated yet");

    return { success: true, message: 'Receipt url reteived successfully', data: receiptUrl };
  } catch (err) {
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}
