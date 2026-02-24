import { ProductCategory } from '@/types';
import { Library } from 'lucide-react';
import EmptyStorage from '../EmptyStorage';

interface ProductCategoryTableProps {
  productCategories: ProductCategory[];
}

export default function ProductCategoryTable({
  productCategories,
}: ProductCategoryTableProps) {
  return (
    <>
      {productCategories.length === 0 && (
        <EmptyStorage
          title="roduct Category Storage Empty"
          description="Create your product category here."
          content="Create Product Category"
          linkAction="/admin/product-categories/new"
          iconEl={<Library />}
        />
      )}
    </>
  );
}
