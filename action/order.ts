'use server'

import db from "@/lib/db"
import { getCurrentUser } from "./user";
import { stripeSessionIdSchema, validateFormData } from "@/lib/validations";

// Fetch Order By StripeSessionId
export const getOrderByStripeSessionId = async function(stripeSessionId: unknown){
  try {
    const user = await getCurrentUser()
      
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation Stripe Session Id
    const validation = validateFormData(stripeSessionIdSchema, stripeSessionId)

    if (!validation.success) throw new Error('Invalid stripe session ID format')
    if (!validation.data) throw new Error('Stripe session ID is required')

    // Query Order
    const order = await db.order.findFirst({
      where: {
        stripeSessionId: validation.data,
        userId: user.id
      }
    })

    return order
  } catch(err){
    return err as Error
  }
}
