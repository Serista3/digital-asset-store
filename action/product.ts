'use server';

import db from '@/lib/db';
import { ActionState, Product, ProductSearchParams, ResultItems, SearchParams } from '@/types';
import { editProductSchema, ProductFormData, productIdSchema, productSchema, productSearchParamsSchema, searchParamsSchema, validateFormData } from '@/lib/validations';
import { redirect } from 'next/navigation';
import { calTotalPages, errorMessage, prepareBaseQueryInfo } from '@/lib/utils';
import { isAdminUser } from './user';
import { deleteProductDigitalFile, deleteProductImage, uploadProductDigitalFile, uploadProductImage } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Fetch products for storefront
export const getStorefrontProducts = async function(searchParams: ProductSearchParams){
  try {
    const { skip, limit } = prepareBaseQueryInfo(searchParams)

    // Validation Product Search Params
    const validation = validateFormData(productSearchParamsSchema, searchParams);
    if (!validation.success || !validation.data) throw new Error("Invalid search parameters");

    const { sortBy, title, category, price_gte, price_lte, isAvailable } = validation.data;

    // Order by
    let orderByCondition: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_desc') orderByCondition = { priceInCents: 'desc' };
    else if (sortBy === 'price_asc') orderByCondition = { priceInCents: 'asc' };
    else if (sortBy === 'title_desc') orderByCondition = { title: 'desc' };
    else if (sortBy === 'title_asc') orderByCondition = { title: 'asc' };

    const whereConditional: Prisma.ProductWhereInput = {
      category: {
        title: { contains: category, mode: 'insensitive' }
      },
      title: { contains: title, mode: 'insensitive' },
      priceInCents: {
        gte: price_gte * 100,
        lte: price_lte * 100
      },
      ...(isAvailable === 'true' && { isAvailable: true }),
      isArchived: false,
    }

    // Query products
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
    return { data: products, totalPages, totalItems };
  } catch (err) {
    return err as Error;
  }
}

// Fetch admin products
export const getAdminProducts = async function (searchParams: SearchParams): Promise<ResultItems<Product>> {
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const { searchTerm: rawSearchTerm, skip: rawSkip, limit: rawLimit } = prepareBaseQueryInfo(searchParams)

    // Validation Search Params
    const validation = validateFormData(searchParamsSchema, { searchTerm: rawSearchTerm, skip: rawSkip, limit: rawLimit })
    if (!validation.success || !validation.data) throw new Error('Invalid search parameters')
    
    const { searchTerm, skip, limit } = validation.data

    const whereConditional: Prisma.ProductWhereInput = {
      title: {
        contains: searchTerm,
        mode: 'insensitive',
      },
      isArchived: false
    }

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
export const getProduct = async function (rawProductId: unknown): Promise<Product | null | Error> {
  try {
    // Validation ID
    const validationId = validateFormData(productIdSchema, rawProductId)

    if (!validationId.success) throw new Error('Invalid product ID format')
    if (!validationId.data) throw new Error('Product id is required')
    
    // Safe Product Id
    const id = validationId.data

    const product = await db.product.findFirst({
      where: {
        id,
      },
      include: {
        category: true
      }
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
  rawProductId: unknown,
  state: ActionState<ProductFormData>,
  formData: FormData,
): Promise<ActionState<ProductFormData>> {
  let success: boolean;

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation ID
    const validationId = validateFormData(productIdSchema, rawProductId)

    if (!validationId.success) throw new Error('Invalid product ID format')
    if (!validationId.data) throw new Error('Product id is required')
    
    // Safe Product Id
    const id = validationId.data

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

    // Validation Form Data
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
export const deleteProduct = async function(rawProductId: unknown){
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation Id
    const validation = validateFormData(productIdSchema, rawProductId)

    if (!validation.success) throw new Error('Invalid product ID format')
    if (!validation.data) throw new Error('Product id is required')
    
    // Safe Product Id
    const id = validation.data

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
