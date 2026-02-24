import Heading from '@/components/typography/Heading';
import ProductCategoryTable from '@/components/admin/product-category/CategoryTable';
import { getProductCategories } from '@/action/category';
import AlertDestructive from '@/components/admin/AlertDestructive';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProductCategorySearch from '@/components/admin/product-category/CategorySearch';

export default async function ProductCategories() {
  const productCategories = await getProductCategories();

  return (
    <section className="flex flex-col gap-12">
      <Heading>Product Categories</Heading>
      {Array.isArray(productCategories) && (
        <div>
          {/* Action Button */}
          <div className="flex gap-4 items-center justify-end mb-6">
            <ProductCategorySearch />
            <Button asChild variant="outline" className="text-black">
              <Link href="/admin/product-categories/new">
                <Plus />
                <span>New Category</span>
              </Link>
            </Button>
          </div>

          {/* Category Table */}
          <ProductCategoryTable productCategories={productCategories} />
        </div>
      )}
      {'cause' in productCategories && (
        <AlertDestructive error={productCategories} />
      )}
    </section>
  );
}
