import { getStorefrontCategories } from '@/action/category';
import { getStorefrontProducts } from '@/action/product';

import AlertDestructive from '@/components/admin/AlertDestructive';
import Paragraph from '@/components/typography/Paragraph';
import HomeCarousel from '@/components/user/home/HomeCarousel';
import CategoryTabsLine from '@/components/user/home/CategoryTabsLine';

export default async function Home({ searchParams }: { searchParams: { category: string } }) {
  const products = await getStorefrontProducts({});
  const isProducts = 'data' in products;

  const categories = await getStorefrontCategories()
  const isCategories = Array.isArray(categories);

  const { category } = await searchParams

  return (
    <div className='flex flex-col gap-8'>
      {/* Product Carousels */}
      {products instanceof Error && <AlertDestructive error={products} />}
      {isProducts && products.data.length > 0 && (
        <HomeCarousel products={products.data.slice(0, 3)} />
      )}
      {isProducts && products.data.length === 0 && (
        <Paragraph>No products available.</Paragraph>
      )}

      {/* Category Tabs */}
      {categories instanceof Error && <AlertDestructive error={categories} />}
      {isCategories && categories.length > 0 && (
        <CategoryTabsLine categories={categories.slice(0, 7)} category={category} />
      )}
      {isCategories && categories.length === 0 && (
        <Paragraph>No categories available.</Paragraph>
      )}
    </div>
  );
}
