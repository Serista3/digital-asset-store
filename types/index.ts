import z from 'zod';

export type ErrorMesg = 'custom' | 'unknown';

export interface ActionState<T> {
  errors?: z.core.$ZodIssue[] | undefined;
  message?: string;
  success?: boolean;
  oldFormData?: T;
}

export type ResultItems<T> =
  | {
      data: T[];
      totalPages: number;
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

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[] | null;
  cart?: Cart | null;
  downloads?: DownloadVerification[] | null;
}

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  priceInCents: number;
  imageUrl: string;
  fileUrl: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: ProductCategory;
  cartItems?: CartItem[];
  downloadVerifications?: DownloadVerification[];
}

export interface ProductCategory {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Cart {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  items?: CartItem[];
  userId: string;
  user?: User;
}

export interface CartItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cartId: String;
  cart?: Cart;
  productId: String;
  product?: Product;
}

export interface Order {}

export interface DownloadVerification {}
