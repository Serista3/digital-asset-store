'use server';

import db from '@/lib/db';
import { ProductCategory } from '@/types';

// Get All Product Category
export const getProductCategories = async function (): Promise<
  ProductCategory[] | Error
> {
  try {
    const productCategories = await db.productCategory.findMany({
      orderBy: {
        createdAt: 'desc'
      },
    });

    return productCategories;
  } catch (err) {
    return err as Error;
  }
};

// Get Product Category Detail
export const getProductCategory = async function (
  id: string,
): Promise<ProductCategory | null | Error> {
  try {
    const productCategory = await db.productCategory.findFirst({
      where: {
        id,
      },
    });

    return productCategory;
  } catch (err) {
    return err as Error;
  }
};
