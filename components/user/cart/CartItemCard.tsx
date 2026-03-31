'use client'

import Heading from "@/components/typography/Heading"
import Paragraph from "@/components/typography/Paragraph"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Trash2 } from "lucide-react"

import Link from "next/link"
import Image from "next/image"
import { CartItem } from "@/types"
import { formattedDateToRead, formattedPrice } from "@/lib/utils"
import { removeProductFromCart } from "@/action/cart"
import { useCart } from "@/store/CartContext"
import { useState } from "react"

export default function CartItemCard({ cartItem }: { cartItem: CartItem }) {
  const { cartItems, removeCartItem } = useCart();
  const isInCart = cartItems.some(pc => pc.productId === cartItem.productId)
  
  const [isLoading, setIsLoading] = useState(false)

  // Delete CartItem
  const handleDelCartItem = async function(productId: string){
    if(!isInCart) return;

    setIsLoading(true)

    const result = await removeProductFromCart(productId);

    // Check Success
    if(result.success) removeCartItem(productId);
    if(!result.success) setIsLoading(false);
  }

  return (
    <Card className="hover:scale-101 transition-all duration-300 relative">
      {/* Product Link */}
      <Link href={`/products/${cartItem.productId}`} className='absolute top-0 left-0 size-full z-2' />

      <CardContent className="flex gap-5">
        {/* Product Image */}
        <div className="w-25 rounded-lg overflow-hidden">
          <Image 
            src={cartItem.product?.imageUrl || '/images/image-empty.png'}
            alt={`${cartItem.product?.title} of Image` || 'No Title of Image'}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-col gap-2.5 w-full">
          {/* Product Header */}
          <div className="flex justify-between gap-2 items-start w-full">
            <Heading level="3">{cartItem.product?.title || 'No Title'}</Heading>
            <Button
              onClick={() => handleDelCartItem(cartItem.productId)}
              disabled={isLoading}
              variant="outline"
              size="icon" 
              className="rounded-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 p-2 relative z-3"
            >
              {isLoading ? <Spinner /> : <Trash2 />}
            </Button>
          </div>

          {/* Product Category */}
          <Badge variant="outline">
            {cartItem.product?.category?.title || 'No Category'}
          </Badge>

          {/* Product Created */}
          <Paragraph className="mt-2 text-gray-600">
            {formattedDateToRead(cartItem.createdAt)}
          </Paragraph>
          
          {/* Product Price */}
          <Paragraph className="font-medium">{formattedPrice(cartItem.product?.priceInCents || 0)}</Paragraph>
        </div>
      </CardContent>
    </Card>
  )
}
