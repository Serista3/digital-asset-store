'use client'

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CirclePlus, CircleX } from "lucide-react";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/CartContext";
import { addProductToCart, removeProductFromCart } from "@/action/cart";
import { cn, showNoti } from "@/lib/utils";

interface AddCartButtonProps {
  productId: string;
  className?: string;
}

export default function AddCartButton({ productId, className }: AddCartButtonProps){
  const pathName = usePathname()
  const { isSignedIn } = useAuth()

  const { cartItems } = useCart();
  const isInCart = cartItems.some(pc => pc.productId === productId)

  const [isLoading, setIsLoading] = useState(false)

  // Operation: Add product to cart
  const handleAddProductToCart = async function(){
    if(isInCart) return;

    setIsLoading(true)

    const result = await addProductToCart(productId, pathName)
    showNoti(result);
    
    setIsLoading(false)
  }

  // Operation: Remove product from cart
  const handleRemoveProductFromCart = async function(){
    if(!isInCart) return;

    setIsLoading(true)

    const result = await removeProductFromCart(productId, pathName)
    showNoti(result);

    setIsLoading(false)
  }

  return (
    <>
      {isSignedIn && (
        <>
          {!isInCart && (
            <Button 
              className={cn("w-full z-3", className)} 
              onClick={handleAddProductToCart} 
              disabled={isLoading}
            >
              {!isLoading && (
                <>
                  <CirclePlus />
                  <span>Add To Cart</span>
                </>
              )}
              {isLoading && (
                <>
                  <Spinner />
                  <span>Adding...</span>
                </>
              )}
            </Button>
          )}
          {isInCart && (
            <Button
              className={cn("w-full z-3", className)} 
              onClick={handleRemoveProductFromCart} 
              disabled={isLoading}
              variant='destructive'
            >
              {!isLoading && (
                <>
                  <CircleX />
                  <span>Remove From Cart</span>
                </>
              )}
              {isLoading && (
                <>
                  <Spinner />
                  <span>Removing...</span>
                </>
              )}
            </Button>
          )}
        </>
      )}
    </>
  )
}
