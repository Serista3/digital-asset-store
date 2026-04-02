import z from 'zod';
import { OrderStatus } from '@prisma/client';

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

export interface OrderSearchParams extends SearchParams {
  status?: OrderStatus;
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
  cartId: string;
  cart?: Cart;
  productId: string;
  product?: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalPriceInCents: number;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  userId: string;
  user?: User;
  downloadVerifications?: DownloadVerification[];
}

export interface OrderItem {
  id: string;
  title: string;
  description?: string;
  priceInCents: number;
  imageUrl: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: String;
  order?: Order;
}

export interface DownloadVerification {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  orderId: string;
  order?: Order;
}
