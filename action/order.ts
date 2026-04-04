'use server'

import db from "@/lib/db"
import { Prisma, Order, OrderStatus } from "@prisma/client";
import { getCurrentUser } from "./user";
import { calTotalPages, errorMessage, prepareBaseQueryInfo } from "@/lib/utils";
import { orderIdSchema, orderSearchParamsSchema, productIdSchema, stripeSessionIdSchema, validateFormData } from "@/lib/validations";
import { ActionState, OrderSearchParams, OrderWithItems, ResultItems } from "@/types";
import { revalidatePath } from "next/cache";
import { createSignedUrlForProductFile } from "@/lib/supabase";

// Fetch order by stripe session id
export const getOrderByStripeSessionId = async function(stripeSessionId: unknown): Promise<Order | Error | null>{
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

// Fetch order for storefront
export const getStorefrontOrders = async function(searchParams: OrderSearchParams): Promise<ResultItems<OrderWithItems>>{
  try {
    const user = await getCurrentUser()

    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    const { skip: rawSkip, limit: rawLimit } = prepareBaseQueryInfo(searchParams)

    // Validation Search Params
    const validation = validateFormData(orderSearchParamsSchema, { ...searchParams, skip: rawSkip, limit: rawLimit })
    if (!validation.success || !validation.data) throw new Error('Invalid search parameters')
    
    const { status, skip, limit } = validation.data

    // Where Conditional
    const whereConditional: Prisma.OrderWhereInput = {
      status,
      userId: user.id
    }

    // Query Order
    const [orders, totalItems] = await db.$transaction([
      db.order.findMany({
        where: whereConditional,
        include: {
          items: true
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),

      db.order.count({ where: whereConditional })
    ]);

    const totalPages = calTotalPages(totalItems);
    return { data: orders, totalPages };
  } catch (err) {
    return err as Error;
  }
}

// Update order status to cancelled
export const updateOrderStatusToCancelled = async function(rawOrderId: unknown){
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

    // Update Status
    const updated = await db.order.updateMany({
      where: {
        id: orderId,
        userId: user.id,
        status: OrderStatus.PENDING
      },
      data: {
        status: OrderStatus.CANCELLED
      }
    })

    if (updated.count === 0) throw new Error('Order not found or cannot be cancelled');

    revalidatePath('/orders', 'layout')
    return { success: true, message: "Order cancelled successfully" };
  } catch (err) {
    console.error(err)
    return errorMessage('custom', err as Error)
  }
}

// Fetch Order Detail
export const getOrder = async function(rawOrderId: unknown): Promise<OrderWithItems | Error | null>{
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
        userId: user.id
      },
      include: {
        items: true
      }
    })

    return order
  } catch (err) {
    return err as Error
  }
}

// Fetch product file url
export const getProductFileUrl = async function(rawOrderId: unknown, rawProductId: unknown): Promise<ActionState<string>>{
  try {
    const user = await getCurrentUser()
      
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation Order Id
    const validationOrderId = validateFormData(orderIdSchema, rawOrderId)

    if (!validationOrderId.success) throw new Error('Invalid order ID format')
    if (!validationOrderId.data) throw new Error('Order id is required')
    
    const orderId = validationOrderId.data

    // Validation Product Id
    const validationProductId = validateFormData(productIdSchema, rawProductId)

    if (!validationProductId.success) throw new Error('Invalid product ID format')
    if (!validationProductId.data) throw new Error('Product id is required')
    
    const productId = validationProductId.data

    // Query Download Verification
    const verification = await db.downloadVerification.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        orderId: orderId
      },
      include: {
        product: { select: { fileUrl: true } }
      }
    });

    if (!verification) throw new Error("You don't have permission to download this file, or your payment hasn't been completed successfully.");
    
    // Create Signed URL
    const result = await createSignedUrlForProductFile(verification.product)

    if (result instanceof Error) throw result;

    return { success: true, message: 'Your download will begin shortly.', data: result.signedUrl };
  } catch (err) {
    console.error(err)
    return errorMessage('custom', err as Error)
  }
}

// Has purchased this product
export const hasPurchasedThisProduct = async function(rawProductId: unknown): Promise<boolean | Error>{
  try {
    const user = await getCurrentUser()
      
    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Validation Product Id
    const validationProductId = validateFormData(productIdSchema, rawProductId)

    if (!validationProductId.success) throw new Error('Invalid product ID format')
    if (!validationProductId.data) throw new Error('Product id is required')
    
    const productId = validationProductId.data

    // Query Download Verification
    const existingVerification = await db.downloadVerification.findFirst({
      where: {
        userId: user.id,
        productId: productId
      }
    });

    return !!existingVerification;
  } catch (err) {
    return err as Error
  }
}
