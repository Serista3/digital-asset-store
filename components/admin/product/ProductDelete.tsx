'use client';

import { Product } from '@/types';
import { AlertDialogDestructive } from '../AlertDialogDestructive';
import { deleteProduct } from '@/action/product';

export default function ProductDelete({
  product,
}: {
  product: Product;
}) {
  return (
    <AlertDialogDestructive
      btnText="Delete"
      title="Delete Product"
      description={
        <>
          You are going to delete{' '}
          <span className="text-white">{product.title}</span> product. Are you
          sure for that?
        </>
      }
      onDelete={() => deleteProduct(product.id)}
    />
  );
}
