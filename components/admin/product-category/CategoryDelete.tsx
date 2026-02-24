'use client';

import { ProductCategory } from '@/types';
import { AlertDialogDestructive } from '../AlertDialogDestructive';
import { deleteProductCategory } from '@/action/category';

export default function CategoryDelete({
  category,
}: {
  category: ProductCategory;
}) {
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
      onDelete={() => deleteProductCategory(category.id)}
    />
  );
}
