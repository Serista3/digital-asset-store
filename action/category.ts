'use server';

import db from '@/lib/db';
import { ProductCategorySchema, validateFormData } from '@/lib/validations';
import { ActionState, ProductCategory, ResultItems } from '@/types';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Fetch Product Categories
export const getProductCategories = async function (
  search?: string,
  currentPage: number = 1,
): Promise<ResultItems<ProductCategory>> {
  // Prepare Data
  const searchTerm = search?.trim().toLocaleLowerCase() || '';
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  // Fetch data from database by search & page
  try {
    const [data, totalItems] = await db.$transaction([
      // Filter search & page
      db.productCategory.findMany({
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: skip,
      }),

      // Count category
      db.productCategory.count({
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Category Detail
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
