'use client'

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { ReceiptText } from "lucide-react"

import { useState } from "react"
import { cn, showNoti } from "@/lib/utils";
import { getStripeReceiptUrl } from "@/action/checkout";

interface ViewReceiptButtonProps {
  orderId: string;
  className?: string;
}

export default function ViewReceiptButton({ orderId, className }: ViewReceiptButtonProps){
  const [isLoading, setIsLoading] = useState(false);

  // Handle View Receipt
  const handleViewReceipt = async function(){
    setIsLoading(true)

    const result = await getStripeReceiptUrl(orderId);

    // Redirect to receipt page
    if(result.success && result.data){
      window.open(result.data, '_blank')
    }

    if(!result.success) showNoti(result)

    setIsLoading(false)
  }

  return (
    <Button className={cn(className)} onClick={handleViewReceipt} disabled={isLoading}>
      {isLoading && (
        <>
          <Spinner />
          Redirecting...
        </>
      )}

      {!isLoading && (
        <>
          <ReceiptText />
          View Receipt
        </>
      )}
    </Button>
  )
}
