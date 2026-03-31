import { getCurrentUserCart } from "@/action/cart";

import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import AlertDestructive from "@/components/admin/AlertDestructive";
import CartItemCard from "@/components/user/cart/CartItemCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Cart() {
  const curUserCart = await getCurrentUserCart();

  // Error Occured
  if(curUserCart instanceof Error){
    return <AlertDestructive error={curUserCart} />
  }

  // Check Cart Items
  const items = curUserCart?.items || [];
  const hasItems = items.length > 0;

  return (
    <div className="flex flex-col gap-10">
      <Heading>Carts</Heading>

      {/* Cart Content */}
      <div className="flex flex-col gap-4">
        <Heading level="3" className="font-normal text-gray-600">
          {items.length} {items.length === 1 ? 'item': 'items'}
        </Heading>

        {/* CartItem List */}
        {hasItems && (
          <div className="flex flex-col gap-8">
            {items.map(cartItem => (
              <CartItemCard key={cartItem.id} cartItem={cartItem} />
            ))}
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
