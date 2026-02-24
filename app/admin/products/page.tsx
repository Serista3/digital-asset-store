import Heading from '@/components/typography/Heading';

import { getProducts } from '@/action/product';
import ProductTable from '@/components/admin/product/ProductTable';
import AlertDestructive from '@/components/admin/AlertDestructive';

export default async function Products() {
  const products = await getProducts();

  return (
    <section className="flex flex-col gap-12">
      <Heading>Products</Heading>
      {Array.isArray(products) && (
        <div>
          <ProductTable products={products} />
        </div>
      )}
      {'cause' in products && <AlertDestructive error={products} />}
    </section>
  );
}
