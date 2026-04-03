'use client'

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CreditCard } from "lucide-react";

import { useState } from "react";
import { cn, showNoti } from "@/lib/utils";
import { createCheckoutSessionFromOrder } from "@/action/checkout";

interface PayOrderButtonProps {
  orderId: string;
  className?: string;
}

export default function PayOrderButton({ orderId, className }: PayOrderButtonProps){
  const [isLoading, setIsLoading] = useState(false);

  // Handle Payment
  const handlePayment = async function(){
    setIsLoading(true)

    const result = await createCheckoutSessionFromOrder(orderId)

    if(result) {
      showNoti(result)
      setIsLoading(false)
    } 
  }

  return (
    <Button
      className={cn(className)}
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading 
        ? (
          <>
            <Spinner />
            <span>Redirecting...</span>
          </>
        )
        : (
          <>
            <CreditCard />
            <span>Pay Now</span> 
          </>
        )
      }
    </Button>
  )
}
