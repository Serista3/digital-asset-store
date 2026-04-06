import { getStorefrontCategories } from '@/action/category';
import { getStorefrontProducts } from '@/action/product';
import { ProductSearchParams } from '@/types';
import { Metadata } from 'next';

import AlertDestructive from '@/components/admin/AlertDestructive';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import FilterControls from '@/components/user/products/FilterControls';
import Paragraph from '@/components/typography/Paragraph';
import ProductCard from '@/components/user/products/ProductCard';
import BasicPagination from '@/components/admin/BasicPagination';
import Heading from '@/components/typography/Heading';

export const metadata: Metadata = {
  title: 'Products',
};

export default async function Products({ searchParams }: { searchParams: Promise<ProductSearchParams>; }) {
  const params = await searchParams;

  const products = await getStorefrontProducts({ ...params });
  const isProducts = !(products instanceof Error);

  const categories = await getStorefrontCategories();
  const isCategories = !(categories instanceof Error);

  return (
    <ExplorerLayout title="Products">
        <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3'>
            {/* Filter Panel */}
            {!isCategories && <AlertDestructive error={categories} />}
            {isCategories && <FilterControls categories={categories} />}

            {/* Filter Results */}
            {!isProducts && <AlertDestructive error={products} />}
            {isProducts && (
                <div className='lg:col-span-2'>
                    {/* Heading */}
                    <div className='flex gap-2 items-end mb-8'>
                        <Heading level='3'>Result{products.totalItems !== 1 && 's'}</Heading>
                        <Paragraph>({products.totalItems} item{products.totalItems !== 1 && 's'})</Paragraph>
                    </div>

                    {/* Products */}
                    {products.data.length > 0 && (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {products.data.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}

                    {/* Not Found */}
                    {products.data.length === 0 && <Paragraph>No products available.</Paragraph>}

                    {/* Pagination */}
                    {products.totalPages > 1 && <BasicPagination totalPages={products.totalPages} />}
                </div>
            )}
        </div>
    </ExplorerLayout>
  );
}
