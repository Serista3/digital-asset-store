import ExplorerLayout from '@/components/layout/ExplorerLayout';
import OrderStatusTabs from '@/components/user/order/OrderStatusTabs';
import BasicPagination from '@/components/admin/BasicPagination';

import { OrderSearchParams } from '@/types';
import { getStorefrontOrders } from '@/action/order';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
};

export default async function Orders({ searchParams }: { searchParams: Promise<OrderSearchParams> }) {
  const { status } = await searchParams;
  
  // Fetch Orders
  const orders = await getStorefrontOrders({ status });
  const isOrders = !(orders instanceof Error);

  return (
    <ExplorerLayout title="Orders">
      {/* Order Status Tabs */}
      <OrderStatusTabs orders={orders} status={status || 'PENDING'} />
      
      {/* Pagination */}
      {isOrders && orders.totalPages > 1 && <BasicPagination totalPages={orders.totalPages} />}
    </ExplorerLayout>
  );
}
