'use server'

import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { errorMessage } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { getCurrentUser } from "./user"
import { getProduct } from "./product"

// Fetch All Cart
export const getCarts = async function(){

}

// Add Product To Cart
export const addProductToCart = async function(productId: string, pathName: string){
  try {
    const { isAuthenticated } = await auth()
    if(!isAuthenticated) throw new Error('You are not Login. Please login before add to cart.')
    
    // User Exists
    const user = await getCurrentUser()
    if(!user) throw new Error('User not found.');
    if(user instanceof Error) throw user;

    // Product Exists
    const product = await getProduct(productId);
    if(!product) throw new Error('Product not found.');
    if(product instanceof Error) throw product;

    await db.$transaction(async (tx) => {
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

    revalidatePath(pathName)
    return { success: true, message: "Add product to cart success!!" };
  }catch(err){
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}

// Remove Product From Cart
export const removeProductFromCart = async function(productId: string, pathName: string){
  try {
    const { isAuthenticated } = await auth()
    if(!isAuthenticated) throw new Error('You are not Login. Please login before add to cart.')
    
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

    revalidatePath(pathName)
    return { success: true, message: "Remove product from cart success!!" };
  }catch(err){
    console.error(err);
    return errorMessage('custom', err as Error)
  }
}

// Remove All Product From Cart
export const removeAllProductFromCart = async function(){

}
