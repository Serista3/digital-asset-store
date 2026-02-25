import z from 'zod';

export type ActionState = {
  errors?: z.core.$ZodIssue[] | undefined;
  message?: string;
  success?: boolean;
};

export type ResultItems<T> =
  | {
      data: T[];
      totalPages: number;
    }
  | Error;

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[];
  cart?: Cart;
  downloads?: DownloadVerification[];
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
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

export interface Cart {}

export interface CartItem {}

export interface Order {}

export interface DownloadVerification {}
