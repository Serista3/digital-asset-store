import { LIMIT_RESULT } from '@/action/constants';
import { OrderWithItemsAndUser } from '@/types';
import { formattedDateToRead, formattedPrice } from '@/lib/utils';

import EmptyStorage from '../EmptyStorage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from 'lucide-react';

const statusClasses = {
  PENDING: 'border-yellow-500 text-yellow-500',
  PAID: 'border-green-500 text-green-500',
  CANCELLED: 'border-gray-400 text-gray-400',
};

export default async function OrderTable({
  orders,
  page = 1,
}: {
  orders: OrderWithItemsAndUser[];
  page?: number;
}) {
  return (
    <>
      {/* Order Table */}
      {orders.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              // Prepare final order data
              const orderNo = (page - 1) * LIMIT_RESULT + index + 1;
              const orderNumber = `${order.id.slice(0, 8).toLocaleUpperCase()}`;
              const orderUser = order.user.name;
              const orderStatus = order.status.toLocaleLowerCase();
              const orderItems = order.items.length;
              const orderTotalPrice = formattedPrice(order.totalPriceInCents);
              const orderCreatedAt = formattedDateToRead(order.createdAt);
              const orderUpdatedAt = formattedDateToRead(order.createdAt);

              return (
                <TableRow key={order.id}>
                  <TableCell>{orderNo}</TableCell>
                  <TableCell>{orderNumber}</TableCell>
                  <TableCell>{orderUser}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      variant="outline"
                      className={`${statusClasses[order.status]} capitalize font-medium text-sm rounded-md`}
                    >
                      {orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{orderItems}</TableCell>
                  <TableCell>{orderTotalPrice}</TableCell>
                  <TableCell>{orderCreatedAt}</TableCell>
                  <TableCell>{orderUpdatedAt}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {orders.length === 0 && (
        <EmptyStorage
          title="Order Storage Empty"
          description="No orders found."
          iconEl={<ArrowUpDown />}
        />
      )}
    </>
  );
}
