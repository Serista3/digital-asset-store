"use server";

import db from "@/lib/db";
import { calTotalPages, errorMessage, prepareBaseQueryInfo } from "@/lib/utils";
import { ProductCategoryFormData, productCategorySchema, validateFormData } from "@/lib/validations";
import { ActionState, ProductCategory, ResultItems, SearchParams } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "./user";
import { Prisma } from "@prisma/client";

// Fetch categories for admin
export const getAdminCategories = async function(searchParams: SearchParams): Promise<ResultItems<ProductCategory>>{
  const { searchTerm, skip, limit } = prepareBaseQueryInfo(searchParams)

  const baseWhere: Prisma.ProductCategoryWhereInput = {
    title: {
      contains: searchTerm,
      mode: "insensitive",
    },
  }

  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

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
export const getCategoriesForSelect = async function () {
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
export const getStorefrontCategories = async () => { 
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
export const getProductCategory = async function (id: string): Promise<ProductCategory | null | Error> {
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
  id: string,
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
export const deleteProductCategory = async function (id: string) {
  try {
    if(!await isAdminUser()) throw new Error('You are not Admin!!')

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
