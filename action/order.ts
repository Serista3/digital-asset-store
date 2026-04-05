'use server'

import db from "@/lib/db"
import { Prisma, Order, OrderStatus } from "@prisma/client";
import { getCurrentUser, isAdminUser } from "./user";
import { calTotalPages, errorMessage, getDateRange, prepareBaseQueryInfo } from "@/lib/utils";
import { monthAndYearSchema, orderIdSchema, orderSearchParamsSchema, orderStatusSchema, productIdSchema, stripeSessionIdSchema, validateFormData, yearSchema } from "@/lib/validations";
import { ActionState, OrderSearchParams, OrderWithItems, OrderWithItemsAndUser, ResultItems, RevenueByCategory, YearlyRevenue } from "@/types";
import { revalidatePath } from "next/cache";
import { createSignedUrlForProductFile } from "@/lib/supabase";
import { MONTHS } from "./constants";

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
    if(!user) return false;
    if(user instanceof Error) return false;

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

// Fetch Admin Orders
export const getAdminOrders = async function(searchParams: OrderSearchParams): Promise<ResultItems<OrderWithItemsAndUser>>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const { searchTerm: rawSearchTerm, skip: rawSkip, limit: rawLimit } = prepareBaseQueryInfo(searchParams)

    // Validation Search Params
    const validation = validateFormData(orderSearchParamsSchema, { 
      status: searchParams.status, 
      searchTerm: rawSearchTerm, 
      skip: rawSkip, 
      limit: rawLimit
    })
    if (!validation.success || !validation.data) throw new Error('Invalid search parameters')
    
    const { status, searchTerm, skip, limit } = validation.data

    const whereConditional: Prisma.OrderWhereInput = {
      id: {
        contains: searchTerm,
        mode: 'insensitive',
      },
      status,
    }
    
    // Query Order
    const [orders, totalItems] = await db.$transaction([
      db.order.findMany({
        where: whereConditional,
        skip,
        take: limit,
        orderBy: { 
          updatedAt: 'desc' 
        },
        include: { 
          items: true,
          user: true
        }
      }),

      db.order.count({ where: whereConditional })
    ]);

    const totalPages = calTotalPages(totalItems);
    return { data: orders, totalPages, totalItems };
  } catch (err) {
    return err as Error;
  }
}

// Fetch Order Count
export const getOrderCount = async function(rawStatus?: unknown): Promise<number | Error>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation Status
    const validationStatus = validateFormData(orderStatusSchema, rawStatus)

    if (!validationStatus.success) throw new Error('Invalid order status format')
    
    const status = validationStatus.data
    
    // Query Order Count
    return await db.order.count({ 
      where: status ? { status } : undefined
    });

  } catch (err){
    return err as Error;
  }
}

// Fetch total revenue by month and year
export const getTotalRevenueByMonthAndYear = async function(rawMonth?: unknown, rawYear?: unknown): Promise<number | Error>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation Month And Year
    const validation = validateFormData(monthAndYearSchema, { month: rawMonth, year: rawYear })

    if (!validation.success || !validation.data) throw new Error('Invalid month or year format')

    const { year, month } = validation.data

    // Retieve Date
    const { startDate, endDate } = getDateRange(month, year);

    // Query Total Revenue
    const totalRevenue = await db.order.aggregate({
      _sum: {
        totalPriceInCents: true
      },
      where: {
        status: OrderStatus.PAID,
        ...(startDate || endDate ? {
          updatedAt: {
            gte: startDate,
            lt: endDate,
          }
        } : {})
      }
    })

    // Calculate Final Total Revenue
    const finalTotalRevenue = totalRevenue._sum.totalPriceInCents || 0;

    return finalTotalRevenue;
  } catch (err){
    return err as Error;
  }
}

// Fetch Yearly Revenue
export const getYearlyRevenue = async function(rawYear: unknown): Promise<YearlyRevenue[] | Error>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')
    
    // Validation Year
    const validation = validateFormData(yearSchema, { year: rawYear })

    if (!validation.success || !validation.data) throw new Error('Invalid year format')

    const { year } = validation.data
    
    // Map month with revenues
    const monthWithRevenues = MONTHS.map(async (monthName, index) => {
      const monthNumber = index + 1;
      const revenueInCents = await getTotalRevenueByMonthAndYear(monthNumber, year);

      if(revenueInCents instanceof Error) throw revenueInCents;
      
      const finalRevenue = revenueInCents / 100;

      return {
        month: monthName,
        revenue: finalRevenue
      };
    });

    const yearlyRevenue = await Promise.all(monthWithRevenues);

    return yearlyRevenue;
  } catch (err) {
    return err as Error
  }
}

// Fetch Revenue By Category
export const getRevenueByCategory = async function(rawMonth?: unknown, rawYear?: unknown): Promise<RevenueByCategory[] | Error>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation Month And Year
    const validation = validateFormData(monthAndYearSchema, { month: rawMonth, year: rawYear })

    if (!validation.success || !validation.data) throw new Error('Invalid month or year format')

    const { year, month } = validation.data

    // Retieve Date
    const { startDate, endDate } = getDateRange(month, year);

    // Query Category
    const categories = await db.productCategory.findMany({
      select: {
        title: true,
        products: {
          select: {
            orderItems: {
              where: {
                order: {
                  status: OrderStatus.PAID,
                  ...(startDate || endDate ? {
                    updatedAt: {
                      gte: startDate,
                      lt: endDate,
                    }
                  } : {})
                },
              },
              select: {
                priceInCents: true,
              }
            }
          }
        }
      }
    })

    // Formatted revenue by category data
    const revenueByCategory = categories.map(category => {

      // Calculate total revenue all product in one category
      const totalRevenueInCents = category.products.reduce((accProduct, product) => {

        // Calculate one product revenue
        const productRevenue = product.orderItems.reduce((accItem, item) => {
          return accItem + item.priceInCents
        }, 0)

        return accProduct + productRevenue
      }, 0)

      return {
        title: category.title,
        value: totalRevenueInCents / 100
      }
    })

    const finalData = revenueByCategory.filter(item => item.value > 0);

    return finalData;
  } catch (err){
    return err as Error
  }
}
