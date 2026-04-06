import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import AlertDestructive from "@/components/admin/AlertDestructive";
import BasicBreadcrumb from "@/components/common/BasicBreadcrumb";
import OrderProductItemCard from "@/components/user/order/OrderProductItemCard";
import OrderSummary from "@/components/user/order/OrderSummary";
import { Badge } from "@/components/ui/badge";

import { getOrder } from "@/action/order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Order Detail',
};

const statusClasses = {
  'PENDING': 'border-yellow-500 text-yellow-500',
  'PAID': 'border-green-500 text-green-500',
  'CANCELLED': 'border-gray-500 text-gray-500',
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Order Detail
  const order = await getOrder(id);

  // Validation Order Detail
  if(!order){
    return <Paragraph className='text-base'>Order not found.</Paragraph>
  }

  if(order instanceof Error){
    return <AlertDestructive error={order} />
  }

  // Prepare order data
  const orderNumber = `#${order.id.slice(0, 8).toUpperCase()}`
  const orderStatus = order.status.toLocaleLowerCase()

  return (
    <div className='flex flex-col gap-12'>
      {/* Header */}
      <header>
        <div className="flex justify-between gap-2 items-center">
          <Heading className='line-clamp-none leading-14'>
            {orderNumber}
          </Heading>
          <Badge
            variant="outline" 
            className={`${statusClasses[order.status]} capitalize font-medium text-base rounded-md`}
          >
            {orderStatus}
          </Badge>
        </div>
        <BasicBreadcrumb
          linkItems={[{ path: '/orders', label: 'Orders' }, { path: '', label: orderNumber }]} 
          className='mt-2' 
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-8">
        {/* Section Product */}
        <section className="flex flex-col gap-4.5 lg:col-span-2">
          <Heading level="2">Products</Heading>
          {/* Product List */}
          {order.items.length > 0 && (
            <div className="grid grid-cols-1 gap-9">
              {order.items.map(item => (
                <OrderProductItemCard key={item.id} orderItem={item} orderStatus={order.status} />
              ))}
            </div>
          )}

          {/* Not found */}
          {order.items.length === 0 && (
            <Paragraph>No items in this order.</Paragraph>
          )}
        </section>

        {/* Order Summary */}
        <OrderSummary order={order} />
      </div>
    </div>
  )
}
