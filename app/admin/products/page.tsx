import ProductTable from '@/components/admin/product/ProductTable';
import AlertDestructive from '@/components/admin/AlertDestructive';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import BasicPagination from '@/components/admin/BasicPagination';
import ProductSearch from '@/components/admin/product/ProductSearch';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAdminProducts } from '@/action/product';
import { SearchParams } from '@/types';

interface ProductsProps {
  searchParams: Promise<SearchParams>;
}

export default async function Products({ searchParams }: ProductsProps) {
  const { search, page } = await searchParams;
  const products = await getAdminProducts({ search, page });

  return (
    <ExplorerLayout title="Products">
      {'data' in products && (
        <div>
          {/* Call to action */}
          <div className="flex gap-4 items-center justify-end mb-6">
            <ProductSearch />
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus />
                <span>New Product</span>
              </Link>
            </Button>
          </div>

          {/* Product Table */}
          <ProductTable products={products.data} page={Number(page ?? 1)} />

          {/* Pagination */}
          <BasicPagination totalPages={products.totalPages} />
        </div>
      )}
      {'cause' in products && <AlertDestructive error={products} />}
    </ExplorerLayout>
  );
}
