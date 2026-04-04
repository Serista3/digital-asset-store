import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import PayOrderButton from "./PayOrderButton";
import CancelOrderButton from "./CancelOrderButton";
import ViewReceiptButton from "./ViewReceiptButton";
import { Separator } from "@/components/ui/separator";

import { OrderWithItems } from "@/types";
import { formattedDateToRead, formattedPrice } from "@/lib/utils";

interface OrderSummaryProps {
  order: OrderWithItems;
}

export default function OrderSummary({ order }: OrderSummaryProps){
  const status = order.status
  const date = formattedDateToRead(order.updatedAt)
  const amount = order.items.length;
  const totalPrice = order.totalPriceInCents;

  return (
    <div className="p-6 rounded-lg border shadow-sm flex flex-col gap-4 lg:self-start">
      {/* General Info */}
      <ul className="flex flex-col gap-4">
        <li className="flex flex-col">
          <Heading level="4">Order Date:</Heading>
          <Paragraph className="text-gray-600">{date}</Paragraph>
        </li>
        <li className="flex flex-col">
          <Heading level="4">Payment Method:</Heading>
          <Paragraph className="text-gray-600">
            {status === 'PAID' ? 'Credit Card' : '-'}
          </Paragraph>
        </li>
      </ul>

      <Separator />

      <div className="flex flex-col gap-2">
        <Heading level="3">Total Price</Heading>
        <div className="flex justify-between items-center gap-2">
          {/* OrderItem Amount */}
          <Paragraph className="text-gray-600">
            x{amount} {amount === 1 ? 'item': 'items'}
          </Paragraph>

          {/* Total Price */}
          <Paragraph className="font-semibold">{formattedPrice(totalPrice)}</Paragraph>
        </div>
      </div>
      
      {/* View Receipt Btn */}
      {status === 'PAID' && <ViewReceiptButton orderId={order.id} className="mt-4" />}

      {/* Payment Btn & Cancel Order Btn */}
      {status === 'PENDING' && (
        <div className="flex flex-col gap-2 mt-4">
          <PayOrderButton orderId={order.id} />
          <CancelOrderButton orderId={order.id} />
        </div>
      )}
    </div>
  )
}
