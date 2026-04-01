'use client'

import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard } from "lucide-react";

import { CartItem } from "@/types";
import { formattedPrice, showNoti } from "@/lib/utils";
import { removeAllProductFromCart } from "@/action/cart";
import { createCheckoutSession } from "@/action/checkout"; 
import { useCart } from "@/store/CartContext";
import { useState } from "react";

interface CartSummaryProps {
  amount: number;
  totalPrice: number;
  cartItems: CartItem[];
}

export default function CartSummary({ amount, totalPrice, cartItems }: CartSummaryProps){
  const { removeAllCartItem } = useCart()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckoutLoading, setCheckoutLoading] = useState(false)

  // Delete all cart item
  const handleDelAllCartItem = async function(){
    setIsLoading(true)

    const result = await removeAllProductFromCart();

    // Check Success
    if(result.success) removeAllCartItem();
    if(!result.success) setIsLoading(false);

    // Notify to user
    showNoti(result)
  }

  // Operation: Checkout
  const handleCheckout = async function(){
    setCheckoutLoading(true)

    const result = await createCheckoutSession(cartItems)

    if(result) {
      showNoti(result)
      setCheckoutLoading(false)
    } 
  }

  return (
    <div className="p-6 rounded-lg border shadow-sm flex flex-col gap-4 lg:self-start lg:sticky">
      <Heading level="3">Total Price</Heading>
      <div className="flex justify-between items-center gap-2">
        {/* CartItem Amount */}
        <Paragraph className="text-gray-600">
          x{amount} {amount === 1 ? 'item': 'items'}
        </Paragraph>

        {/* Total Price */}
        <Paragraph className="font-semibold">{formattedPrice(totalPrice)}</Paragraph>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {/* Payment Button */}
        <Button onClick={handleCheckout} disabled={isCheckoutLoading}>
          <CreditCard />
            {isCheckoutLoading 
              ? (
                  <>
                    <Spinner />
                    <span>Paymenting...</span>
                  </>
              )
              : <span>Payment</span> 
            }
        </Button>

        {/* Remove All CartItem Button */}
        <Button variant='outline' disabled={isLoading} onClick={handleDelAllCartItem}>
          {isLoading && (
            <>
              <Spinner />
              <span>Removing...</span>
            </>
          )}
          {!isLoading && 'Remove All Cart'}
        </Button>
      </div>
    </div>
  )
}
