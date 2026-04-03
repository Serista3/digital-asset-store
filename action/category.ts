"use server";

import db from "@/lib/db";
import { calTotalPages, errorMessage, prepareBaseQueryInfo } from "@/lib/utils";
import { ProductCategoryFormData, productCategoryIdSchema, productCategorySchema, searchParamsSchema, validateFormData } from "@/lib/validations";
import { ActionState, ProductCategoryOnlyIdAndTitle, ProductCategoryWithProducts, ResultItems, SearchParams } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "./user";
import { Prisma, ProductCategory } from "@prisma/client";

// Fetch categories for admin
export const getAdminCategories = async function(searchParams: SearchParams): Promise<ResultItems<ProductCategoryWithProducts>>{
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const { searchTerm: rawSearchTerm, skip: rawSkip, limit: rawLimit } = prepareBaseQueryInfo(searchParams)

    // Validation Search Params
    const validation = validateFormData(searchParamsSchema, { searchTerm: rawSearchTerm, skip: rawSkip, limit: rawLimit })
    if (!validation.success || !validation.data) throw new Error('Invalid search parameters')
    
    const { searchTerm, skip, limit } = validation.data

    const baseWhere: Prisma.ProductCategoryWhereInput = {
      title: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }

    const [data, totalItems] = await db.$transaction([
      db.productCategory.findMany({
        where: baseWhere,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
        include: {
          products: {
            where: { isArchived: false }
          }
        }
      }),

      db.productCategory.count({ where: baseWhere })
    ]);

    const totalPages = calTotalPages(totalItems);
    return { data, totalPages };
  } catch (err) {
    return err as Error;
  }
}

// Fetch categories for dropdown (select)
export const getCategoriesForSelect = async function (): Promise<ProductCategoryOnlyIdAndTitle[] | Error> {
  try {
    return await db.productCategory.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: "asc" }
    })
  } catch (err) {
    return err as Error;
  }
};

// Fetch categories for storefront
export const getStorefrontCategories = async function(): Promise<ProductCategory[] | Error> { 
  try {
    return await db.productCategory.findMany({
      where: {
        products: {
          some: {
            isAvailable: true,
            isArchived: false,
          }
        }
      },
      orderBy: { title: "asc" }
    })
  } catch (err) {
    return err as Error;
  }
}

// Fetch product category detail
export const getProductCategory = async function (rawCategoryId: unknown): Promise<ProductCategory | null | Error> {
  try {
    // Validation ID
    const validation = validateFormData(productCategoryIdSchema, rawCategoryId)

    if (!validation.success) throw new Error('Invalid product ID format')
    if (!validation.data) throw new Error('Product Category id is required')
    
    // Safe Product Category Id
    const id = validation.data

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

// Create product category
export const createProductCategory = async function (
  state: ActionState<ProductCategoryFormData>,
  formData: FormData,
): Promise<ActionState<ProductCategoryFormData>> {
  let success: boolean;

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    const title = formData.get("title");
    const oldFormData = {
      title: String(formData.get("title") || '')
    }

    // Validation
    const validation = validateFormData(productCategorySchema, { title });

    if (!validation.success)
      return { errors: validation.errors, success: false, oldFormData };

    // Save in DB
    await db.productCategory.create({
      data: {
        title: validation.data?.title as string,
      },
    });

    success = true;
  } catch (err) {
    return errorMessage('custom', err as Error)
  }

  if (success) redirect("/admin/product-categories");

  return errorMessage('unknown');
};

// Update product category
export const updateProductCategory = async function (
  rawCategoryId: unknown,
  state: ActionState<ProductCategoryFormData>,
  formData: FormData,
): Promise<ActionState<ProductCategoryFormData>> {
  let success: boolean;

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation ID
    const validationId = validateFormData(productCategoryIdSchema, rawCategoryId)

    if (!validationId.success) throw new Error('Invalid product ID format')
    if (!validationId.data) throw new Error('Product Category id is required')
    
    // Safe Product Category Id
    const id = validationId.data

    const title = formData.get("title");
    const oldFormData = {
      title: String(formData.get("title") || '')
    }

    // Validation Form Data
    const validation = validateFormData(productCategorySchema, { title });
    
    if (!validation.success)
      return { errors: validation.errors, success: false, oldFormData };

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
    return errorMessage('custom', err as Error)
  }

  if (success) redirect("/admin/product-categories");

  return errorMessage('unknown');
};

// Delete product category
export const deleteProductCategory = async function (rawCategoryId: unknown) {
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

    // Validation ID
    const validation = validateFormData(productCategoryIdSchema, rawCategoryId)

    if (!validation.success) throw new Error('Invalid product ID format')
    if (!validation.data) throw new Error('Product Category id is required')
    
    // Safe Product Category Id
    const id = validation.data

    await db.productCategory.delete({
      where: {
        id,
      },
    });

    // Clear cache
    revalidatePath("/admin/product-categories");

    // Success Notify
    return {success: true, message: 'Delete product category success!!'}
  } catch (err) {
    return errorMessage('custom', err as Error)
  }
};
