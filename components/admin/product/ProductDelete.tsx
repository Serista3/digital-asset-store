'use client';

import { Product } from '@prisma/client';
import { AlertDialogDestructive } from '../AlertDialogDestructive';
import { deleteProduct } from '@/action/product';
import { showNoti } from '@/lib/utils';

export default function ProductDelete({ product }: { product: Product }) {
  const handleDelete = async function(){
    const result = await deleteProduct(product.id)
    showNoti(result)
  }

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
      onDelete={handleDelete}
    />
  );
}
