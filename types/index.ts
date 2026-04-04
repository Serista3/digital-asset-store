import z from 'zod';
import { OrderStatus, Prisma } from '@prisma/client';

export type ErrorMesg = 'custom' | 'unknown';

export interface ActionState<T> {
  errors?: z.core.$ZodIssue[] | undefined;
  message?: string;
  success?: boolean;
  oldFormData?: T;
  data?: T;
}

export type ResultItems<T> =
  | {
      data: T[];
      totalPages: number;
      totalItems?: number;
    }
  | Error;

export interface SearchParams {
  search?: string;
  page?: string;
}

export interface ProductSearchParams extends SearchParams {
  category?: string;

  // Filter Controls
  sortBy?: 'title_asc' | 'title_desc' | 'price_desc' | 'price_asc';
  title?: string;
  price_gte?: string;
  price_lte?: string;
  isAvailable?: string;
}

export interface OrderSearchParams extends SearchParams {
  status?: OrderStatus;
}

export type UserWithCartAndItems = Prisma.UserGetPayload<{
  include: {
    cart: {
      include: {
        items: true;
      };
    };
  };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: true;
  },
}>;

export type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            category: true
          }
        },
      }
    }
  }
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        category: true;
      }
    }
  }
}>;

export type ProductCategoryWithProducts = Prisma.ProductCategoryGetPayload<{
  include: {
    products: {
      where: { isArchived: false }
    }
  }
}>

export type ProductCategoryOnlyIdAndTitle = Prisma.ProductCategoryGetPayload<{
  select: {
    id: true,
    title: true,
  },
}>

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { 
    category: true 
  }
}>
