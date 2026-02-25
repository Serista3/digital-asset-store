import Heading from '@/components/typography/Heading';
import ProductCategoryTable from '@/components/admin/category/CategoryTable';
import AlertDestructive from '@/components/admin/AlertDestructive';
import ProductCategorySearch from '@/components/admin/category/CategorySearch';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProductCategories } from '@/action/category';
import BasicPagination from '@/components/admin/BasicPagination';

interface ProductCategoriesProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function ProductCategories({
  searchParams,
}: ProductCategoriesProps) {
  const { search, page } = await searchParams;
  const productCategories = await getProductCategories(search, page);

  return (
    <section className="flex flex-col gap-12">
      <Heading>Product Categories</Heading>
      {'data' in productCategories && (
        <div>
          {/* Action Button */}
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
          <ProductCategoryTable productCategories={productCategories.data} />

          {/* Category Pagination */}
          <BasicPagination totalPages={productCategories.totalPages} />
        </div>
      )}
      {'cause' in productCategories && (
        <AlertDestructive error={productCategories} />
      )}
    </section>
  );
}
