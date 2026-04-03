import Heading from "@/components/typography/Heading"
import Paragraph from "@/components/typography/Paragraph"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import Link from "next/link"
import Image from "next/image"
import { OrderItem, OrderStatus } from "@prisma/client"
import { formattedPrice } from "@/lib/utils"

interface OrderProductItemCardProps {
  orderItem: OrderItem;
  orderStatus: OrderStatus;
}

export default function OrderProductItemCard({ orderItem, orderStatus }: OrderProductItemCardProps){
  return (
    <Card className="w-full relative transition-all duration-300 hover:scale-101">
      <Link href={`/products/${orderItem.productId}`} className="absolute top-0 left-0 size-full z-2" />
      
      <CardContent className="flex gap-4">
        {/* Product Image */}
        <div className="w-28 h-full shrink-0 rounded-lg overflow-hidden">
          <Image 
            src={orderItem.imageUrl || '/images/image-empty.png'}
            alt={`${orderItem.title} of Image` || 'No Title of Image'}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col gap-.5">
          {/* Product Title */}
          <Heading level="4">{orderItem.title}</Heading>

          {/* Product Description */}
          <Paragraph className="line-clamp-1 text-gray-600">
            {orderItem.description}
          </Paragraph>

          {/* Product Price */}
          <Paragraph className="font-semibold line-clamp-1 flex items-center gap-2 mt-4">
            Price: 
            <span className="font-normal">{formattedPrice(orderItem.priceInCents)}</span>
          </Paragraph>

          {/* Download File Btn */}
          {orderStatus === 'PAID' && (
            <Button className="self-start mt-2 z-3">
              Download File
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
