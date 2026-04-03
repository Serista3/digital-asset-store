'use client';

import Loading from '@/app/(user)/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '../products/ProductCard';
import Paragraph from '@/components/typography/Paragraph';

import { getStorefrontProducts } from '@/action/product';
import { ProductCategory } from '@prisma/client';
import { ProductWithCategory } from '@/types';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CategoryTabsLineProps {
  categories: ProductCategory[];
  category?: string;
}

export default function CategoryTabsLine({
  categories,
  category,
}: CategoryTabsLineProps) {
  const firstCategory = categories[0]?.title;
  const finalCategory = category ?? firstCategory
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  // Fetch product base on category param
  useEffect(() => {
    const fetchInitialData = async function () {
      try {
        setIsLoading(true);

      const fetchProduct = await getStorefrontProducts({ category: finalCategory });

      if ('data' in fetchProduct) {
        setProducts([...fetchProduct.data]);
      }

      } catch(err) {
        toast.error((err as Error).message, { position: 'top-center' })
        setProducts([])
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [finalCategory]);

  return (
    <Tabs value={finalCategory}>
      <div className="max-w-275 overflow-x-auto overflow-y-hidden">
        <TabsList variant="line">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.title} 
              onClick={() => router.push(`?category=${cat.title}`, { scroll: false })}
            >
              {cat.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Render Products */}
      {categories.map((cat) => (
        <TabsContent key={cat.id} value={cat.title}>
          {isLoading ? (
            <Loading />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 mt-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Paragraph>No product available.</Paragraph>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
