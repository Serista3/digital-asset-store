import { getProductCategory, updateProductCategory } from '@/action/category';
import AlertDestructive from '@/components/admin/AlertDestructive';
import ProductCategoryForm from '@/components/admin/category/CategoryForm';
import Heading from '@/components/typography/Heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Product Category',
};

export default async function EditProductCategory({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const productCategory = await getProductCategory(id);
  const updateActionWithId = updateProductCategory.bind(null, id);

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Heading>Edit Product Category</Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/product-categories">Product Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {productCategory && 'title' in productCategory && (
        <ProductCategoryForm
          formData={productCategory}
          serverAction={updateActionWithId}
        />
      )}
      {productCategory && 'cause' in productCategory && (
        <AlertDestructive error={productCategory} />
      )}
    </section>
  );
}
