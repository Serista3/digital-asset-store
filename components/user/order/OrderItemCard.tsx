'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import Paragraph from "@/components/typography/Paragraph";

import { OrderStatus } from "@prisma/client";
import { OrderWithItems } from "@/types";
import { formattedDateToRead, formattedPrice } from "@/lib/utils";
import Link from "next/link";

interface OrderItemCardProps {
  status: OrderStatus;
  order: OrderWithItems;
}

const statusClasses = {
  'PENDING': 'border-yellow-500 text-yellow-500',
  'PAID': 'border-green-500 text-green-500',
  'CANCELLED': 'border-gray-500 text-gray-500',
}

export default function OrderItemCard({ status, order }: OrderItemCardProps) {
  const orderNumber = `#${order.id.slice(0, 8).toUpperCase()}`;
  const orderStatus = status.toLocaleLowerCase();
  const orderDate = formattedDateToRead(order.updatedAt);
  const orderItems = order.items.slice(0, 3);
  const orderTotalPrice = formattedPrice(order.totalPriceInCents);

  return (
    <Card className="w-full md:max-w-lg rounded-lg bg-white">
      <CardContent className="flex flex-col gap-1 flex-1">
        {/* Order Number & Status */}
        <div className="flex justify-between items-center gap-2">
          <Paragraph className="font-semibold text-base flex gap-2 items-center flex-wrap">
            หมายเลขคำสั่งซื้อ:
            <span className="text-gray-600 font-normal">{orderNumber}</span>
          </Paragraph>
          <Badge
            variant="outline" 
            className={`${statusClasses[status]} capitalize font-medium text-sm rounded-md`}
          >
            {orderStatus}
          </Badge>
        </div>

        {/* Date */}
        <Paragraph className="font-semibold text-base flex gap-2 items-center flex-wrap">
          Date:
          <span className="text-gray-600 font-normal">{orderDate}</span>
        </Paragraph>

        {/* Order Item List */}
        <div className="mb-6">
          <div className="font-semibold mb-2">รายการ:</div>
          <ol className="list-decimal list-inside pl-4 space-y-1 text-gray-600">
            {orderItems.map(item => (
              <li key={item.id}>{item.title}</li>
            ))}
            {order.items.length > 3 && <Paragraph className="text-black font-semibold">...</Paragraph>}
          </ol>
        </div>
        
        {/* Total Price */}
        <Paragraph className="font-semibold text-base mt-auto mb-3 flex gap-2 items-center flex-wrap">
          Total Price:
          <span className="text-gray-600 font-normal">{orderTotalPrice}</span>
        </Paragraph>

        {/* Payment Btn & Cancel Order Btn */}
        {status === 'PENDING' && (
          <div className="self-start flex items-center gap-2.5">
            <Button>
              <CreditCard />
              Payment
            </Button>
            <Button variant='outline'>
              Cancel Order
            </Button>
          </div>
        )}

        {/* Order Detail Btn */}
        {status !== 'PENDING' && (
          <Button className="self-start" asChild>
            <Link href={`/orders/${order.id}`}>Order Detail</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
