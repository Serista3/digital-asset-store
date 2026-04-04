'use client'

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowDownToLine } from "lucide-react";

import { useState } from "react";
import { cn, showNoti } from "@/lib/utils";
import { getProductFileUrl } from "@/action/order";

interface DownloadProductFileButtonProps {
  orderId: string;
  productId: string | null;
  className?: string;
}

export default function DownloadProductFileButton({ orderId, productId, className }: DownloadProductFileButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle Download File
  const handleDowloadFile = async function(){
    if(!productId) return;

    setIsLoading(true)

    const result = await getProductFileUrl(orderId, productId)

    // Download product file
    if(result.success && result.data){
      const link = document.createElement('a');
      link.href = result.data;

      link.setAttribute('download', '');
      document.body.appendChild(link);

      link.click();
      link.remove()
    }
    
    showNoti(result)

    setIsLoading(false)
  }

  return (
    <Button className={cn(className)} onClick={handleDowloadFile} disabled={isLoading}>
      {isLoading && (
        <>
          <Spinner />
          Downloading...
        </>
      )}

      {!isLoading && (
        <>
          <ArrowDownToLine />
          Download File
        </>
      )}
    </Button>
  )
}
