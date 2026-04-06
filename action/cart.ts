'use server'

import db from "@/lib/db"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { errorMessage } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { getCurrentUser } from "./user"
import { getProduct } from "./product"
import { productIdSchema, validateFormData } from "@/lib/validations"
import { CartWithItems } from "@/types"
import { hasPurchasedThisProduct } from "./order"

// Fetch Current User Cart
export const getCurrentUserCart = async function(): Promise<CartWithItems | Error | null>{
  try {
    const user = await getCurrentUser()

    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Query user cart
    const cart = await db.cart.findFirst({
      where: {
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            },
          }
        }
      }
    })

    return cart;
  } catch(err) {
    console.error(err);
    return err as Error;
  }
}

// Add Product To Cart
export const addProductToCart = async function(rawProductId: unknown){
  try {
    const { isAuthenticated } = await auth()
    if(!isAuthenticated) throw new Error('You are not Login. Please login before add product to cart.')

    // Check if the product has already been purchased
    const hasPurchased = await hasPurchasedThisProduct(rawProductId);

    if (hasPurchased instanceof Error) throw hasPurchased;
    if (hasPurchased === true) throw new Error('You already own this product. Please go to your downloads.')

    // Validation Id
    const validationId = validateFormData(productIdSchema, rawProductId)

    if (!validationId.success) throw new Error('Invalid product ID format')
    if (!validationId.data) throw new Error('Product id is required')
    
    // Safe Product Id
    const productId = validationId.data
    
    // User Exists
    const user = await getCurrentUser()
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Product Exists
    const product = await getProduct(productId);
    if(!product) throw new Error('Product not found.');
    if(product instanceof Error) throw product;
    if(!product.isAvailable) throw new Error('This product is currently unavailable and cannot be added to your cart.');

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // If user doesn't have cart then create new
      const cart = await tx.cart.upsert({
        where: { 
          userId: user.id 
        },
        update: {},
        create: { 
          userId: user.id 
        },
      });

      // Add product to cart
      await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: productId,
          }
        },
        update: {},
        create: {
          cartId: cart.id,
          productId: productId,
        },
      });
    });

    revalidatePath('/', 'layout');
    return { success: true, message: "Item added to your cart" };
  }catch(err){
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}

// Remove Product From Cart
export const removeProductFromCart = async function(rawProductId: unknown){
  try {
    const { isAuthenticated } = await auth()
    if(!isAuthenticated) throw new Error('You are not Login. Please login before remove product from cart.')
    
    // Validation Id
    const validationId = validateFormData(productIdSchema, rawProductId)

    if (!validationId.success) throw new Error('Invalid product ID format')
    if (!validationId.data) throw new Error('Product id is required')
    
    // Safe Product Id
    const productId = validationId.data
    
     // User Exists
    const user = await getCurrentUser()
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Product Exists
    const product = await getProduct(productId);
    if(!product) throw new Error('Product not found.');
    if(product instanceof Error) throw product;

    // User Cart Exists
    const cart = await db.cart.findUnique({
      where: { userId: user.id }
    });

    // Remove product from cart
    if (cart) {
      await db.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: productId,
        }
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, message: "Product removed from cart" };
  }catch(err){
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}

// Remove All Product From Cart
export const removeAllProductFromCart = async function(){
  try {
    const user = await getCurrentUser()

    // If no user or not login
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Delete all cart item
    await db.cartItem.deleteMany({
      where: {
        cart: {
          userId: user.id
        }
      },
    })

    revalidatePath('/cart');
    return { success: true, message: "All product removed from cart" };
  } catch(err) {
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}
