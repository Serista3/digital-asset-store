import Heading from '@/components/typography/Heading';
import ProductCategoryTable from '@/components/admin/product-category/ProductCategoryTable';
import { getProductCategories } from '@/action/category';
import AlertDestructive from '@/components/admin/AlertDestructive';

export default async function ProductCategories() {
  const productCategories = await getProductCategories();

  return (
    <section className="flex flex-col gap-12">
      <Heading>Product Categories</Heading>
      {Array.isArray(productCategories) && (
        <div>
          <ProductCategoryTable productCategories={productCategories} />
        </div>
      )}
      {'cause' in productCategories && (
        <AlertDestructive error={productCategories} />
      )}
    </section>
  );
}
