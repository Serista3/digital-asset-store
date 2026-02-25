'use server';

import db from '@/lib/db';
import { Product } from '@/types';

// Fetch Products
export const getProducts = async function (): Promise<Product[] | Error> {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  } catch (err) {
    return err as Error;
  }
};

// Fetch Product Detail
export const getProduct = async function (
  id: string,
): Promise<Product | null | Error> {
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
