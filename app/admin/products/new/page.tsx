import Heading from '@/components/typography/Heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getProductCategories } from '@/action/category';
import Link from 'next/link';
import ProductForm from '@/components/admin/product/ProductForm';
import AlertDestructive from '@/components/admin/AlertDestructive';
import { createProduct } from '@/action/product';

export default async function NewProduct() {
  const categories = await getProductCategories();

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Heading>New Product</Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {'data' in categories && (
        <ProductForm
          serverAction={createProduct}
          categories={categories.data}
        />
      )}
      {'cause' in categories && <AlertDestructive error={categories} />}
    </section>
  );
}
