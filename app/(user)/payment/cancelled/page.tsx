import StatusCard from '@/components/common/StatusCard';
import Paragraph from '@/components/typography/Paragraph';

export default function PaymentCancelled() {
  return (
    <StatusCard
      status="error"
      title="Payment Cancelled!"
      description={
        <Paragraph className="text-gray-600 text-center">
          คุณได้ทำการยกเลิกชำระเงิน หรือระบบเกิดความขัดข้อง{' '}
          <strong className="font-semibold text-black">
            กรุณากลับมาทำรายการอีกครั้งในภายหลัง
          </strong>
        </Paragraph>
      }
      primaryButtonText="My Purchase Order"
      primaryButtonHref="/orders"
      secondaryButtonText="Home"
      secondaryButtonHref="/"
    />
  );
}
