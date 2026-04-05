import Heading from '@/components/typography/Heading';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import AlertDestructive from '@/components/admin/AlertDestructive';
import { ArrowUpDown, Box, Component, UserRound } from 'lucide-react';

import { getUsers } from '@/action/user';
import { getAdminOrders } from '@/action/order';
import { getAdminProducts } from '@/action/product';
import { getAdminCategories } from '@/action/category';

export default async function Dashboard() {
  const products = await getAdminProducts({});
  const categories = await getAdminCategories({});
  const users = await getUsers({});
  const orders = await getAdminOrders({ status: 'PAID' });

  return (
    <ExplorerLayout title="Dashboard">
      <section className='flex flex-col gap-12'>
        <Heading level='2'>All Times</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* Product Stats */}
          {products instanceof Error ? (
            <AlertDestructive error={products} />
          ) : (
            <DashboardStats
              path="/admin/products"
              icon={<Box className="size-16" strokeWidth={0.5} />}
              title="product"
              description={`${products.totalItems} ${products.totalItems === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* Product Category Stats */}
          {categories instanceof Error ? (
            <AlertDestructive error={categories} />
          ) : (
            <DashboardStats
              path="/admin/product-categories"
              icon={<Component className="size-16" strokeWidth={0.5} />}
              title="category"
              description={`${categories.totalItems} ${categories.totalItems === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* User Stats */}
          {users instanceof Error ? (
            <AlertDestructive error={users} />
          ) : (
            <DashboardStats
              path="/admin/users"
              icon={<UserRound className="size-16" strokeWidth={0.5} />}
              title="user"
              description={`${users.totalItems} ${users.totalItems === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* Order Stats */}
          {orders instanceof Error ? (
            <AlertDestructive error={orders} />
          ) : (
            <DashboardStats
              path="/admin/orders"
              icon={<ArrowUpDown className="size-16" strokeWidth={0.5} />}
              title="order"
              description={`${orders.totalItems} ${orders.totalItems === 1 ? 'item' : 'items'}`}
            />
          )}
        </div>
      </section>
    </ExplorerLayout>
  );
}
