'use client';

import Loading from '@/app/(user)/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '../products/ProductCard';
import Paragraph from '@/components/typography/Paragraph';

import { getStorefrontProducts } from '@/action/product';
import { Product, ProductCategory } from '@/types';
import { useState, useEffect } from 'react';

interface CategoryTabsLineProps {
  categories: ProductCategory[];
}

export default function CategoryTabsLine({
  categories,
}: CategoryTabsLineProps) {
  const firstCategoryId = categories[0]?.id;
  const [selectedTab, setSelectedTab] = useState(firstCategoryId);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async function (selectedTab: string) {
      setIsLoading(true);

      const fetchProduct = await getStorefrontProducts({ categoryId: selectedTab });
      if ('data' in fetchProduct) {
        setProducts([...fetchProduct.data]);
      }

      setIsLoading(false);
    };

    fetchInitialData(selectedTab);
  }, [selectedTab]);

  return (
    <Tabs
      className=""
      value={selectedTab}
      onValueChange={setSelectedTab}
      defaultValue={firstCategoryId}
    >
      <TabsList
        variant="line"
        className="max-w-275 overflow-x-auto overflow-y-hidden"
      >
        {categories.map((category) => (
          <TabsTrigger
            onClick={() => setSelectedTab(category.id)}
            key={category.id}
            value={category.id}
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          {selectedTab === category.id && (
            <>
              {isLoading ? (
                <Loading />
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <Paragraph>No product available.</Paragraph>
              )}
            </>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
