'use client'

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { cn, showNoti } from "@/lib/utils";
import { useState } from "react";
import { updateOrderStatusToCancelled } from "@/action/order";

interface CancelOrderButtonProps {
  orderId: string;
  className?: string;
}

export default function CancelOrderButton({ orderId, className }: CancelOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle Cancel Order
  const handleCancelOrder = async function(){
    setIsLoading(true)

    const result = await updateOrderStatusToCancelled(orderId)

    showNoti(result)

    if(!result.success) setIsLoading(false)
  }

  return (
    <Button 
      variant='outline' 
      className={cn(className)}
      onClick={handleCancelOrder} 
      disabled={isLoading}
    >
      {!isLoading && 'Cancel Order'}
      {isLoading && (
        <>
          <Spinner />
          <span>Cancelling...</span>
        </>
      )}
    </Button>
  )
}
