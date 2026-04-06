import ProductCategoryTable from '@/components/admin/category/CategoryTable';
import AlertDestructive from '@/components/admin/AlertDestructive';
import ProductCategorySearch from '@/components/admin/category/CategorySearch';
import BasicPagination from '@/components/admin/BasicPagination';
import ExplorerLayout from '@/components/layout/ExplorerLayout';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAdminCategories } from '@/action/category';
import { SearchParams } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Categories',
};

interface ProductCategoriesProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductCategories({ searchParams }: ProductCategoriesProps) {
  const { search, page } = await searchParams;
  const productCategories = await getAdminCategories({ search, page });

  return (
    <ExplorerLayout title="Product Categories">
      <>
        {'data' in productCategories && (
          <div>
            {/* Call to action */}
            <div className="flex gap-4 items-center justify-end mb-6">
              <ProductCategorySearch />
              <Button asChild>
                <Link href="/admin/product-categories/new">
                  <Plus />
                  <span>New Category</span>
                </Link>
              </Button>
            </div>

            {/* Category Table */}
            <ProductCategoryTable productCategories={productCategories.data} page={Number(page ?? 1)} />

            {/* Pagination */}
            <BasicPagination totalPages={productCategories.totalPages} />
          </div>
        )}
        {'cause' in productCategories && (
          <AlertDestructive error={productCategories} />
        )}
      </>
    </ExplorerLayout>
  );
}
