'use server';

import db from '@/lib/db';
import { ActionState, Product, ProductSearchParams, ResultItems, SearchParams } from '@/types';
import { editProductSchema, ProductFormData, productSchema, validateFormData } from '@/lib/validations';
import { redirect } from 'next/navigation';
import { calTotalPages, errorMessage, prepareBaseQueryInfo } from '@/lib/utils';
import { isAdminUser } from './user';
import { deleteProductDigitalFile, deleteProductImage, uploadProductDigitalFile, uploadProductImage } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Fetch products for storefront
export const getStorefrontProducts = async function(searchParams: ProductSearchParams){
  const { skip, limit } = prepareBaseQueryInfo(searchParams)

  // Order by
  let orderByCondition: Prisma.ProductOrderByWithRelationInput = { 
    createdAt: 'desc'
  };

  if (searchParams.sortBy === 'price_desc') {
    orderByCondition = { priceInCents: 'desc' };
  }else if (searchParams.sortBy === 'price_asc') {
    orderByCondition = { priceInCents: 'asc' };
  }else if (searchParams.sortBy === 'title_desc') {
    orderByCondition = { title: 'desc' };
  }else if (searchParams.sortBy === 'title_asc') {
    orderByCondition = { title: 'asc' };
  }

  // Filter by
  const finalTitle = searchParams.title?.toLocaleLowerCase().trim() || ''
  const finalCategory = searchParams.category?.trim() || ''
  const finalPriceGte = Number(searchParams.price_gte ?? 0) * 100
  const finalPriceIte = Number(searchParams.price_lte ?? 1000000) * 100

  const isAvailableParam = searchParams.isAvailable;
  const finalIsAvailable = isAvailableParam === 'true' ? true : undefined;

  const whereConditional: Prisma.ProductWhereInput = {
    category: {
      title: {
        contains: finalCategory,
        mode: 'insensitive'
      }
    },
    title: {
      contains: finalTitle,
      mode: 'insensitive'
    },
    priceInCents: {
      gte: finalPriceGte,
      lte: finalPriceIte
    },
    ...(finalIsAvailable !== undefined && { isAvailable: finalIsAvailable }),
    isArchived: false,
  }

  try {
    const [products, totalItems] = await db.$transaction([
      db.product.findMany({
        where: whereConditional,
        skip,
        take: limit,
        orderBy: orderByCondition,
        include: { category: true }
      }),

      db.product.count({ where: whereConditional }),
    ]);

    const totalPages = calTotalPages(totalItems);
    return { data: products, totalPages };
  } catch (err) {
    return err as Error;
  }
}

// Fetch admin products
export const getAdminProducts = async function (searchParams: SearchParams): Promise<ResultItems<Product>> {
  const { searchTerm, skip, limit } = prepareBaseQueryInfo(searchParams)

  const whereConditional: Prisma.ProductWhereInput = {
    title: {
      contains: searchTerm,
      mode: 'insensitive',
    },
    isArchived: false
  }

  try {
    const [products, totalItems] = await db.$transaction([
      db.product.findMany({
        where: whereConditional,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
      }),

      db.product.count({ where: whereConditional })
    ]);

    const totalPages = calTotalPages(totalItems);
    return { data: products, totalPages };
  } catch (err) {
    return err as Error;
  }
};

// Fetch product detail
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

// Create product
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

    // Validation
    const validation = validateFormData(productSchema, {
      ...data,
      isAvailable,
      priceInCents,
    });
    
    if (!validation.success)
      return {
        errors: validation.errors,
        success: false,
        oldFormData: oldFormData,
      };
    
    // Uploade file to bucket storage
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
    return errorMessage('custom', err as Error)
  }

  if (success) redirect('/admin/products');

  return errorMessage('unknown');
};

// Update product
export const updateProduct = async function (
  id: string,
  state: ActionState<ProductFormData>,
  formData: FormData,
): Promise<ActionState<ProductFormData>> {
  let success: boolean;

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const product = await getProduct(id)

    if(!product) throw new Error('Not found product.')
    if(product instanceof(Error)) throw new Error(product.message)

    const data = Object.fromEntries(formData.entries());
    const priceInCents = Number(formData.get('priceInCents'));
    const isAvailable = formData.get('isAvailable') === 'on' ? true : false;

    const imageFile = formData.get('imageUrl') as File;
    const digitalFile = formData.get('fileUrl') as File;

    // Prepare old form data
    const oldFormData: ProductFormData = {
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      priceInCents: priceInCents,
      imageUrl: imageFile,
      fileUrl: digitalFile,
      isAvailable: isAvailable,
      categoryId: String(data.categoryId),
    };

    // Validation
    const validationData: Record<string, unknown> = {
      ...data,
      isAvailable,
      priceInCents,
    }

    if (imageFile && imageFile.size === 0) delete validationData.imageUrl;
    if (digitalFile && digitalFile.size === 0) delete validationData.fileUrl;

    const validation = validateFormData(editProductSchema, validationData);

    if (!validation.success)
      return {
        errors: validation.errors,
        success: false,
        oldFormData: oldFormData,
      };

    let finalImageUrl = product.imageUrl
    let finalDigitalFileUrl = product.fileUrl;
    
    // Delete old image file
    if (imageFile && imageFile.size > 0) {
      if (product.imageUrl) {
        await deleteProductImage(product.imageUrl);
      }
      finalImageUrl = await uploadProductImage(imageFile);
    }

    // Delete old digital file
    if (digitalFile && digitalFile.size > 0) {
      if (product.fileUrl) {
        await deleteProductDigitalFile(product.fileUrl);
      }
      finalDigitalFileUrl = await uploadProductDigitalFile(digitalFile);
    }
    
    // Save in DB
    await db.product.update({
      where: {
        id
      },
      data: {
        title: validation.data?.title ?? '',
        description: validation.data?.description ?? '',
        priceInCents: Math.round((validation.data?.priceInCents ?? 10) * 100) ,
        imageUrl: finalImageUrl,
        fileUrl: finalDigitalFileUrl,
        isAvailable: validation.data?.isAvailable ?? false,
        categoryId: validation.data?.categoryId ?? ''
      },
    });

    success = true;
  } catch (err) {
    return errorMessage('custom', err as Error)
  }

  if (success) redirect('/admin/products');

  return errorMessage('unknown');
};

// Delete product
export const deleteProduct = async function(id: string){
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Save result in DB
    await db.product.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
        isAvailable: false
      }
    })

    revalidatePath('/admin/products')
    return { success: true, message: "Delete product success!!" };
  }catch(err){
    return errorMessage('custom', err as Error)
  }
}
