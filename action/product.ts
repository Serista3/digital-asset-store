'use server';

import db from '@/lib/db';
import { ActionState, Product, ResultItems } from '@/types';
import { LIMIT_RESULT } from './constants';
import {
  ProductFormData,
  productSchema,
  validateFormData,
} from '@/lib/validations';
import { redirect } from 'next/navigation';

// Fetch Products
export const getProducts = async function ({
  search = '',
  page = 1,
}: {
  search?: string;
  page?: number;
}): Promise<ResultItems<Product>> {
  const searchTerm = search.trim().toLocaleLowerCase();
  const skip = (page - 1) * LIMIT_RESULT;

  try {
    const [products, totalItems] = await db.$transaction([
      db.product.findMany({
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        skip,
        take: LIMIT_RESULT,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      db.product.count({
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / LIMIT_RESULT);
    return {
      data: products,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Detail
export const getProduct = async function (
  id: string,
): Promise<Product | null | Error> {
  try {
    const product = await db.product.findFirst({
      where: {
        id,
      },
    });

    return product;
  } catch (err) {
    return err as Error;
  }
};

// Create Product Detail
export const createProduct = async function (
  state: ActionState<ProductFormData>,
  formData: FormData,
): Promise<ActionState<ProductFormData>> {
  let success: boolean;

  try {
    const data = Object.fromEntries(formData.entries());
    const priceInCents = Number(formData.get('priceInCents'));
    const isAvailable = formData.get('isAvailable') === 'on' ? true : false;

    // Prepare old form data
    const oldFormData: ProductFormData = {
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      priceInCents: priceInCents,
      imageUrl: formData.get('imageUrl') as File,
      fileUrl: formData.get('fileUrl') as File,
      isAvailable: isAvailable,
      categoryId: String(data.categoryId),
    };

    const validation = validateFormData(productSchema, {
      ...data,
      isAvailable,
      priceInCents,
    });

    // Validation
    if (!validation.success)
      return {
        errors: validation.errors,
        success: false,
        oldFormData: oldFormData,
      };

    // Save in DB
    // await db.productCategory.create({-
    //   data: {
    //     title: validation.data?.title as string,
    //   },
    // });

    success = true;
  } catch (err) {
    return {
      message: (err as Error).message || 'Some thing went wrong',
      success: false,
    };
  }

  if (success) redirect('/admin/products');

  return { success: false, message: 'Unknown error occurred' };
};
