import ProductTable from '@/components/admin/product/ProductTable';
import AlertDestructive from '@/components/admin/AlertDestructive';
import ExplorerLayout from '@/components/layout/ExplorerLayout';
import BasicPagination from '@/components/admin/BasicPagination';
import ProductSearch from '@/components/admin/product/ProductSearch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getProducts } from '@/action/product';
import Link from 'next/link';

interface ProductsProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function Products({ searchParams }: ProductsProps) {
  const { search, page } = await searchParams;
  const products = await getProducts({ search, page: Number(page ?? 1) });

  return (
    <ExplorerLayout title="Products">
      {'data' in products && (
        <div>
          {/* Product Action */}
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
          <ProductTable products={products.data} />

          {/* Pagination */}
          <BasicPagination totalPages={products.totalPages} />
        </div>
      )}
      {'cause' in products && <AlertDestructive error={products} />}
    </ExplorerLayout>
  );
}
