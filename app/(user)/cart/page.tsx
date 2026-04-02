import Link from "next/link";
import { getCurrentUserCart } from "@/action/cart";

import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import AlertDestructive from "@/components/admin/AlertDestructive";
import CartItemCard from "@/components/user/cart/CartItemCard";
import CartSummary from "@/components/user/cart/CartSummary";
import { Button } from "@/components/ui/button";

export default async function Cart() {
  const curUserCart = await getCurrentUserCart();

  // Error Occured
  if(curUserCart instanceof Error){
    return <AlertDestructive error={curUserCart} />
  }

  // Check CartItems
  const items = curUserCart?.items || [];
  const hasItems = items.length > 0;

  // Calculate Total Price
  const totalPrice = hasItems 
    ? items.reduce((sum, item) => (sum + (item.product?.priceInCents || 0)), 0) 
    : 0

  return (
    <div className="flex flex-col gap-10">
      <Heading>Carts</Heading>

      {/* Cart Content */}
      <div className="flex flex-col gap-4">
        <Heading level="3" className="font-normal text-gray-600">
          {items.length} {items.length === 1 ? 'item': 'items'}
        </Heading>
        
        {hasItems && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8">
            {/* CartItem List */}
            <div className="flex flex-col gap-8 lg:col-span-2">
              {items.map(cartItem => (
                <CartItemCard key={cartItem.id} cartItem={cartItem} />
              ))}
            </div>
            
            {/* Cart Summary */}
            <CartSummary amount={items.length} totalPrice={totalPrice} />
          </div>
        )}

        {/* No items in cart */}
        {!hasItems && (
          <div className="flex flex-col gap-3">
            <Paragraph>Your cart is empty. Please add some products to your cart.</Paragraph>
            <Button className="self-start" asChild>
              <Link href='/products'>See All Product</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
