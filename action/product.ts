'use server';

import db from '@/lib/db';
import { ActionState, Product, ResultItems, SearchParams } from '@/types';
import {
  ProductFormData,
  productSchema,
  validateFormData,
} from '@/lib/validations';
import { redirect } from 'next/navigation';
import { calTotalPages, prepareQueryInfo } from '@/lib/utils';
import { isAdminUser } from './user';
import { uploadProductDigitalFile, uploadProductImage } from '@/lib/supabase';

// Fetch Products
export const getProducts = async function (searchParams: SearchParams): Promise<ResultItems<Product>> {
  const { searchTerm, skip, limit } = prepareQueryInfo(searchParams)

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
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true
        }
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

    const totalPages = calTotalPages(totalItems);
    return {
      data: products,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Detail
export const getProduct = async function (id: string,): Promise<Product | null | Error> {
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
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

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
    
    // uploade file to bucket storage
    const [productImageUrl, productDigitalFile] = await Promise.all([
      uploadProductImage(validation.data!.imageUrl),
      uploadProductDigitalFile(validation.data!.fileUrl)
    ]);
    
    // Save in DB
    await db.product.create({
      data: {
        title: validation.data?.title ?? '',
        description: validation.data?.description ?? '',
        priceInCents: Math.round((validation.data?.priceInCents ?? 10) * 100) ,
        imageUrl: productImageUrl,
        fileUrl: productDigitalFile,
        isAvailable: validation.data?.isAvailable ?? false,
        categoryId: validation.data?.categoryId ?? ''
      },
    });

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
