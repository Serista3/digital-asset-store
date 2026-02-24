import { Product } from '@/types';
import { Package } from 'lucide-react';
import EmptyStorage from '../EmptyStorage';

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <>
      {products.length === 0 && (
        <EmptyStorage
          title="Product Storage Empty"
          description="Create your product here."
          content="Create Product"
          linkAction="/admin/products/new"
          iconEl={<Package />}
        />
      )}
    </>
  );
}
