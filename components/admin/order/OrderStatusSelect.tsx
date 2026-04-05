'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { OrderStatus } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OrderStatusSelect({ status }: { status: OrderStatus }) {
  const router = useRouter();
  const searchParam = useSearchParams();

  // Set Status
  const handleValueChange = function (value: string) {
    const params = new URLSearchParams(searchParam);

    params.set('page', '1');

    if (value) params.set('status', value);
    else params.delete('status');

    router.replace(`?${params.toString()}`);
  };

  return (
    <Select defaultValue={status} onValueChange={handleValueChange}>
      <SelectTrigger className="max-w-30 w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="PAID">Paid</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
