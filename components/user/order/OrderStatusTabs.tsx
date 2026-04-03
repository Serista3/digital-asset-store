'use client'

import Paragraph from "@/components/typography/Paragraph"
import AlertDestructive from "@/components/admin/AlertDestructive"
import OrderItemCard from "./OrderItemCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { OrderWithItems, ResultItems } from "@/types"
import { OrderStatus } from "@prisma/client"
import Link from "next/link"

interface OrderStatusTabsProps {
  orders: ResultItems<OrderWithItems>;
  status: OrderStatus;
}

export default function OrderStatusTabs({ orders, status }: OrderStatusTabsProps) {
  const isOrders = !(orders instanceof Error);

  return (
    <Tabs defaultValue={status}>
      <TabsList className="h-12 py-5">
        <TabsTrigger value="PENDING" className="p-4 text-base" asChild>
          <Link href='?status=PENDING'>Pending</Link>
        </TabsTrigger>
        <TabsTrigger value="PAID" className="p-4 text-base" asChild>
          <Link href='?status=PAID'>Paid</Link>
        </TabsTrigger>
        <TabsTrigger value="CANCELLED" className="p-4 text-base" asChild>
          <Link href='?status=CANCELLED'>Cancelled</Link>
        </TabsTrigger>
      </TabsList>

      {/* Order List */}
      {isOrders && (
        <TabsContent value={status} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          {orders.data.length > 0 && orders.data.map(item => (
            <OrderItemCard key={item.id} status={status} order={item} />
          ))}

          {/* Not Found */}
          {orders.data.length === 0 && <Paragraph>You have no orders with the status "{status}".</Paragraph>}
        </TabsContent>
      )}

      {/* Error Occured */}
      {!isOrders && <AlertDestructive error={orders} />}
    </Tabs>
  )
}
