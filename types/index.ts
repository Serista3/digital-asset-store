import z from 'zod';

export type ActionState = {
  errors?: z.core.$ZodIssue[] | undefined;
  message?: string;
  success?: boolean;
};

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

export interface CartItem {}

export interface DownloadVerification {}
