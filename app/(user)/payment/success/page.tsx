import { redirect } from 'next/navigation';
import { getOrderByStripeSessionId } from '@/action/order';
import { formattedDateToRead } from '@/lib/utils';

import StatusCard from '@/components/common/StatusCard';
import Paragraph from '@/components/typography/Paragraph';
import AlertDestructive from '@/components/admin/AlertDestructive';

interface PaymentSuccessProps {
  searchParams: Promise<{
    sessionId?: string;
  }>;
}

export default async function PaymentSuccess({ searchParams }: PaymentSuccessProps) {
  const { sessionId } = await searchParams;

  // Redirect to home page if no sessionId
  if (!sessionId)
    return redirect("/");

  const order = await getOrderByStripeSessionId(sessionId)

  // Check Order
  if(!order) 
    return <Paragraph>Not found order.</Paragraph>

  if(order instanceof Error) 
    return <AlertDestructive error={order} />

  return (
      <StatusCard
        status="success"
        title="Payment Success!"
        description={
          <Paragraph className="text-gray-600 text-center">
            คุณได้ชำระเงินสำเร็จแล้ว เมื่อ {formattedDateToRead(order.updatedAt)}{' '}
            <strong className="font-semibold text-black">
              หมายเลขคำสั่งซื้อ: #{order.id.slice(0, 8).toUpperCase()}
            </strong>
          </Paragraph>
        }
        primaryButtonText="Order Detail"
        primaryButtonHref={`/orders/${order.id}`}
        secondaryButtonText="My Purchase Order"
        secondaryButtonHref="/orders"
      />
    );
}
