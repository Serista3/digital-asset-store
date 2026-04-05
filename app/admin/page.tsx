import Heading from '@/components/typography/Heading';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import AlertDestructive from '@/components/admin/AlertDestructive';
import CategoryDonutChart from '@/components/admin/dashboard/CategoryDonutChart';
import MonthlyRevenueChart from '@/components/admin/dashboard/MonthlyRevenueChart';
import { ArrowUpDown, Box, CircleDollarSign, Component, UserRound } from 'lucide-react';

import { getUserCount } from '@/action/user';
import { getProductCount } from '@/action/product';
import { getProductCategoryCount } from '@/action/category';
import { getOrderCount, getTotalRevenueByMonthAndYear } from '@/action/order';
import { formattedPrice } from '@/lib/utils';

export default async function Dashboard() {
  const [totalRevenue, productsCount, categoriesCount, usersCount, ordersCount] = await Promise.all([
    getTotalRevenueByMonthAndYear(),
    getProductCount(),
    getProductCategoryCount(),
    getUserCount(),
    getOrderCount('PAID')
  ]);

  return (
    <ExplorerLayout title="Dashboard">
      <div className='grid grid-cols-1 gap-8'>
        {/* Monthy Revenue Chart */}
        <MonthlyRevenueChart />

        <div className='grid grid-cols-2 gap-8'>
          {/* Category Donut Chart */}
          <CategoryDonutChart />

          {/* Total Revenue Stats */}
          {totalRevenue instanceof Error ? (
            <AlertDestructive error={totalRevenue} />
          ) : (
            <DashboardStats
              path="/admin/orders"
              icon={<CircleDollarSign className="size-16" strokeWidth={0.5} />}
              title="Total Revenue"
              description={formattedPrice(totalRevenue)}
            />
          )}
        </div>
      </div>

      {/* All Times */}
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

          {/* Category Stats */}
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
