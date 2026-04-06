import Heading from '@/components/typography/Heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import ProductForm from '@/components/admin/product/ProductForm';
import AlertDestructive from '@/components/admin/AlertDestructive';

import Link from 'next/link';
import { getCategoriesForSelect } from '@/action/category';
import { getProduct, updateProduct } from '@/action/product';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product',
};

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const updateActionWithId = updateProduct.bind(null, id);
  const categories = await getCategoriesForSelect();

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Heading>Edit Product</Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {Array.isArray(categories) && product && 'title' in product && (
        <ProductForm
          formData={product}
          serverAction={updateActionWithId}
          categories={categories}
        />
      )}
      {'cause' in categories && <AlertDestructive error={categories} />}
      {product && 'cause' in product && <AlertDestructive error={product} />}
    </section>
  );
}
