'use client';

import { ProductCategory } from '@prisma/client';
import { AlertDialogDestructive } from '../AlertDialogDestructive';
import { deleteProductCategory } from '@/action/category';
import { showNoti } from '@/lib/utils';

export default function CategoryDelete({ category }: { category: ProductCategory }) {
  const handleDelete = async () => {
    const result = await deleteProductCategory(category.id);
    showNoti(result)
  };

  return (
    <AlertDialogDestructive
      btnText="Delete"
      title="Delete Category"
      description={
        <>
          You are going to delete{' '}
          <span className="text-white">{category.title}</span> category Are you
          sure for that?
        </>
      }
      onDelete={handleDelete}
    />
  );
}
