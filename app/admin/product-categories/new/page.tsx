import ProductCategoryForm from '@/components/admin/product-category/CategoryForm';
import Heading from '@/components/typography/Heading';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { createProductCategory } from '@/action/category';

export default function newProductCategory() {
  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <Heading>New Product Category</Heading>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/admin/product-categories"
                className="hover:text-white"
              >
                Product Categories
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ProductCategoryForm serverAction={createProductCategory} />
    </section>
  );
}
