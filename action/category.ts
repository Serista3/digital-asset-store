'use server';

import db from '@/lib/db';
import { ProductCategorySchema, validateFormData } from '@/lib/validations';
import { ActionState, ProductCategory } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { success } from 'zod';

// Get All Product Category
export const getProductCategories = async function (): Promise<
  ProductCategory[] | Error
> {
  try {
    const productCategories = await db.productCategory.findMany({
      orderBy: {
        createdAt: 'desc',
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

// Create Product Category
export const createProductCategory = async function (
  state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let success: boolean;

  try {
    const title = formData.get('title');
    const validation = validateFormData(ProductCategorySchema, { title });

    // Validation
    if (!validation.success)
      return { errors: validation.errors, success: false };

    // Save in DB
    await db.productCategory.create({
      data: {
        title: validation.data?.title as string,
      },
    });

    success = true;
  } catch (err) {
    return {
      message: (err as Error).message || 'Some thing went wrong',
      success: false,
    };
  }

  if (success) redirect('/admin/product-categories');

  return { success: false, message: 'Unknown error occurred' };
};

// Update Product Category
export const updateProductCategory = async function (
  id: string,
  state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let success: boolean;

  try {
    const title = formData.get('title');
    const validation = validateFormData(ProductCategorySchema, { title });

    // Validation
    if (!validation.success)
      return { errors: validation.errors, success: false };

    // Save in DB
    await db.productCategory.update({
      where: {
        id,
      },
      data: {
        title: validation.data?.title as string,
      },
    });

    success = true;
  } catch (err) {
    return {
      message: (err as Error).message || 'Some thing went wrong',
      success: false,
    };
  }

  if (success) redirect('/admin/product-categories');

  return { success: false, message: 'Unknown error occurred' };
};

// Delete Product Category
export const deleteProductCategory = async function (id: string) {
  try {
    await db.productCategory.delete({
      where: {
        id,
      },
    });

    // Clear cache
    revalidatePath('/admin/product-categories');

    return { success: true, message: 'Delete product category success!!' };
  } catch (err) {
    return {
      message: (err as Error).message || 'Some thing went wrong',
      success: false,
    };
  }
};
