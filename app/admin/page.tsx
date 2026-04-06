import Heading from '@/components/typography/Heading';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import AlertDestructive from '@/components/admin/AlertDestructive';
import FilterMonthAndYear from '@/components/admin/dashboard/FilterMonthAndYear';
import RevenueBarChart from '@/components/admin/dashboard/RevenueBarChart';
import CategoryDonutChart from '@/components/admin/dashboard/CategoryDonutChart';
import { ArrowUpDown, Box, CircleDollarSign, Component, UserRound } from 'lucide-react';

import { getUserCount } from '@/action/user';
import { getProductCount } from '@/action/product';
import { getProductCategoryCount } from '@/action/category';
import { getDailyRevenue, getOrderCount, getRevenueByCategory, getTotalRevenueByMonthAndYear, getYearlyRevenue } from '@/action/order';
import { formattedPrice } from '@/lib/utils';

interface DashboardProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { month, year } = await searchParams;

  // Fetch Stats Data
  const [totalRevenue, productsCount, categoriesCount, usersCount, ordersCount] = await Promise.all([
    getTotalRevenueByMonthAndYear(month, year),
    getProductCount(),
    getProductCategoryCount(),
    getUserCount(),
    getOrderCount('PAID')
  ]);

  // Calculate Bar Chart Data
  let barChartData;
  let labelType = 'Month';
  
  if(month){
    barChartData = await getDailyRevenue(month, year)
    labelType = 'Date'
  }else {
    barChartData = await getYearlyRevenue(year)
  }

  // Fetch Revenue By Category
  const donutChartData = await getRevenueByCategory(month, year);

  return (
    <ExplorerLayout title="" className='relative'>
      {/* Filter */}
      <FilterMonthAndYear month={month} year={year} className='absolute top-0 right-0' />

      <div className='grid grid-cols-1 gap-8'>
        {/* Revenue Chart */}
        {barChartData instanceof Error ? (
          <AlertDestructive error={barChartData} />
        ) : (
          <RevenueBarChart 
            data={barChartData} 
            labelType={labelType} 
            title='Revenue Overview' 
            description='Summary of your earnings over time.' 
          />
        )}

        <div className='grid grid-cols-2 gap-8'>
          {/* Category Chart */}
          {donutChartData instanceof Error ? (
            <AlertDestructive error={donutChartData} />
          ) : (
            <CategoryDonutChart 
              data={donutChartData.slice(0, 7)}
              title='Revenue Category' 
              description='Distribution of total earnings across different categories.' 
            />
          )}

          {/* Total Revenue Stats */}
          {totalRevenue instanceof Error ? (
            <AlertDestructive error={totalRevenue} />
          ) : (
            <DashboardStats
              path="/admin/orders"
              icon={<CircleDollarSign className="size-16" strokeWidth={0.5} />}
              title="Total Revenue"
              description={formattedPrice(totalRevenue)}
              className='text-emerald-400'
            />
          )}
        </div>
      </div>

      {/* Overview */}
      <section className='flex flex-col gap-12 mt-10'>
        <Heading level='2'>Overview</Heading>
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
              description={`${usersCount} ${usersCount === 1 ? 'user' : 'users'}`}
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
              description={`${ordersCount} ${ordersCount === 1 ? 'order' : 'orders'}`}
            />
          )}
        </div>
      </section>
    </ExplorerLayout>
  );
}
