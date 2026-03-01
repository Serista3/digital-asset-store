"use server";

import db from "@/lib/db";
import { calTotalPages, errorMessage, prepareQueryInfo } from "@/lib/utils";
import { ProductCategoryFormData, productCategorySchema, validateFormData } from "@/lib/validations";
import { ActionState, ProductCategory, ResultItems, SearchParams } from "@/types";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "./user";
import { Prisma } from "@prisma/client";

// Fetch All Categories for Dropdown (Select)
export const getAllCategoriesForSelect = async function () {
  try {
    const categories = await db.productCategory.findMany({
      orderBy: {
        title: "asc",
      },
    });

    return categories;
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Categories
export const getProductCategories = async function (searchParams: SearchParams): Promise<ResultItems<ProductCategory>> {
  const { searchTerm, skip, limit } = prepareQueryInfo(searchParams)

  const baseWhere: Prisma.ProductCategoryWhereInput = {
    title: {
      contains: searchTerm,
      mode: "insensitive",
    },
  }

  try {
    const [data, totalItems] = await db.$transaction([
      db.productCategory.findMany({
        where: baseWhere,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
        include: {
          products: true
        }
      }),
      db.productCategory.count({
        where: baseWhere
      }),
    ]);

    const totalPages = calTotalPages(totalItems);

    return {
      data,
      totalPages,
    };
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Category Detail
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

// Create Product Category
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

// Update Product Category
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

// Delete Product Category
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
