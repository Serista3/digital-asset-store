import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import ProductCard from '@/components/user/products/ProductCard';
import AddCartButton from '@/components/user/products/AddCartButton';
import AlertDestructive from '@/components/admin/AlertDestructive';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MoveRight } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getStorefrontProducts } from '@/action/product';
import { formattedDateToRead, formattedPrice } from '@/lib/utils';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await getProduct(id);
  const isProduct = !(product instanceof Error);

  const productList = product && isProduct && await getStorefrontProducts({ category: product.category?.title })
  const isProductList = !(productList instanceof Error)

  return (
    <>
      {!product ? (
        <Paragraph className='text-base'>Product not found.</Paragraph>
      ) : ( 
        !isProduct ? <AlertDestructive error={product} /> 
        : (
          <div className='flex flex-col gap-6'>
            <header>
              <Heading className='line-clamp-none leading-14'>
                {product.title}
              </Heading>
              <Breadcrumb className='mt-2'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/products">Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{product.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <Image 
              src={product.imageUrl}
              alt={`Image of ${product.title}`}
              className='rounded-lg'
              width={400}
              height={300}
            />
            <ul className='flex flex-col gap-2'>
              <li className='flex items-center gap-2'>
                <Heading level='5'>หมวดหมู่:</Heading>
                <span>{product.category?.title}</span>
              </li>
              <li className='flex items-center gap-2'>
                <Heading level='5'>วางขายเมื่อ:</Heading>
                <span>{formattedDateToRead(product.createdAt)}</span>
              </li>
              <li className='flex items-center gap-2'>
                <Heading level='5'>แก้ไขสินค้าล่าสุด:</Heading>
                <span>{formattedDateToRead(product.updatedAt)}</span>
              </li>
              <li className='flex items-center gap-2'>
                <Heading level='5'>ราคา:</Heading>
                <span>{formattedPrice(product.priceInCents)}</span>
              </li>
            </ul>
            <Paragraph>{product.description}</Paragraph>
            <AddCartButton className='w-fit' />

            {/* Other Products */}
            <section className='mt-8 flex flex-col gap-8'>
              <Heading level='2'>Other {product.category?.title}</Heading>
              {!isProductList && <AlertDestructive error={productList} />}
              {isProductList && productList && (
                <>
                  <div className='lg:col-span-2'>
                      {/* Products */}
                      {productList.data.length > 0 && (
                          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                              {productList.data.map(p => <ProductCard key={p.id} product={p} />)}
                          </div>
                      )}
  
                      {/* Not Found */}
                      {productList.data.length === 0 && <Paragraph>No products available.</Paragraph>}
                  </div>
                  <Link href={`/products?category=${product.category?.title}`} className='self-end flex items-center gap-2'>
                    All {product.category?.title}
                    <MoveRight />
                  </Link>
                </>
              )}
            </section>
          </div>
        )
      )}
    </>
  );
}
