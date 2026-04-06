import { Metadata } from 'next';
import { getAdminOrders } from '@/action/order';
import { OrderSearchParams } from '@/types';

import ExplorerLayout from '@/components/layout/ExplorerLayout';
import AlertDestructive from '@/components/admin/AlertDestructive';
import OrderSearch from '@/components/admin/order/OrderSearch';
import OrderStatusSelect from '@/components/admin/order/OrderStatusSelect';
import OrderTable from '@/components/admin/order/OrderTable';
import BasicPagination from '@/components/admin/BasicPagination';

export const metadata: Metadata = {
  title: 'Orders',
};

interface OrdersProps {
  searchParams: Promise<OrderSearchParams>;
}

export default async function Orders({ searchParams }: OrdersProps) {
  const { status, search, page } = await searchParams;

  // Query Order
  const orders = await getAdminOrders({ status, search, page });

  const currentPage = Number(page) || 1;

  // Error Occured
  if (orders instanceof Error) {
    return (
      <ExplorerLayout title="Orders">
        <AlertDestructive error={orders} />
      </ExplorerLayout>
    );
  }

  return (
    <ExplorerLayout title="Orders">
      <div>
        {/* Order Search */}
        <div className="flex justify-end mb-6 gap-2">
          <OrderSearch />
          <OrderStatusSelect status={status || 'PENDING'} />
        </div>

        {/* Order Table */}
        <OrderTable orders={orders.data} page={currentPage} />

        {/* Pagination */}
        {orders.totalPages > 1 && currentPage <= orders.totalPages && (
          <BasicPagination totalPages={orders.totalPages} />
        )}
      </div>
    </ExplorerLayout>
  );
}
