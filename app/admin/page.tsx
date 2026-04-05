import Heading from '@/components/typography/Heading';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import AlertDestructive from '@/components/admin/AlertDestructive';
import { ArrowUpDown, Box, Component, UserRound } from 'lucide-react';

import { getUserCount } from '@/action/user';
import { getOrderCount } from '@/action/order';
import { getProductCount } from '@/action/product';
import { getProductCategoryCount } from '@/action/category';

export default async function Dashboard() {
  const [productsCount, categoriesCount, usersCount, ordersCount] = await Promise.all([
    getProductCount(),
    getProductCategoryCount(),
    getUserCount(),
    getOrderCount('PAID')
  ]);

  return (
    <ExplorerLayout title="Dashboard">
      <section className='flex flex-col gap-12'>
        <Heading level='2'>All Times</Heading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {/* Product Stats */}
          {productsCount instanceof Error ? (
            <AlertDestructive error={productsCount} />
          ) : (
            <DashboardStats
              path="/admin/products"
              icon={<Box className="size-16" strokeWidth={0.5} />}
              title="product"
              description={`${productsCount} ${productsCount === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* Product Category Stats */}
          {categoriesCount instanceof Error ? (
            <AlertDestructive error={categoriesCount} />
          ) : (
            <DashboardStats
              path="/admin/product-categories"
              icon={<Component className="size-16" strokeWidth={0.5} />}
              title="category"
              description={`${categoriesCount} ${categoriesCount === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* User Stats */}
          {usersCount instanceof Error ? (
            <AlertDestructive error={usersCount} />
          ) : (
            <DashboardStats
              path="/admin/users"
              icon={<UserRound className="size-16" strokeWidth={0.5} />}
              title="user"
              description={`${usersCount} ${usersCount === 1 ? 'item' : 'items'}`}
            />
          )}

          {/* Order Stats */}
          {ordersCount instanceof Error ? (
            <AlertDestructive error={ordersCount} />
          ) : (
            <DashboardStats
              path="/admin/orders"
              icon={<ArrowUpDown className="size-16" strokeWidth={0.5} />}
              title="order"
              description={`${ordersCount} ${ordersCount === 1 ? 'item' : 'items'}`}
            />
          )}
        </div>
      </section>
    </ExplorerLayout>
  );
}
