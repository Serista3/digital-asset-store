import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import ProductCard from '@/components/user/products/ProductCard';
import AddCartButton from '@/components/user/products/AddCartButton';
import AlertDestructive from '@/components/admin/AlertDestructive';
import BasicBreadcrumb from '@/components/common/BasicBreadcrumb';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getStorefrontProducts } from '@/action/product';
import { formattedDateToRead, formattedPrice } from '@/lib/utils';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Product Detail
  const product = await getProduct(id);

  // Validation Product Detail
  if(!product){
    return <Paragraph className='text-base'>Product not found.</Paragraph>
  }

  if(product instanceof Error){
    return <AlertDestructive error={product} />
  }

  const isPurchased = product.downloadVerifications.some(v => v.productId === product.id)

  // Other Products
  const productList = await getStorefrontProducts({ category: product.category?.title })
  const isProductList = !(productList instanceof Error)

  const filteredOtherProducts = isProductList && productList 
    ? productList.data.filter(p => p.id !== product.id) 
    : [];

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <header>
        <Heading className='line-clamp-none leading-14'>
          {product.title}
        </Heading>
        <BasicBreadcrumb 
          linkItems={[{ path: '/products', label: 'Products' }, { path: '', label: product.title }]} 
          className='mt-2' 
        />
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Banner Image */}
        <div className='rounded-lg overflow-hidden'>
          <Image 
            src={product.imageUrl || '/images/image-empty.png'}
            alt={`Image of ${product.title}`}
            className='w-full h-50 sm:h-full object-cover'
            width={400}
            height={300}
          />
        </div>
        
        <div className='flex flex-col gap-4 border p-6 rounded-lg'>
          {/* General Info */}
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

          {/* Product Description */}
          <Paragraph className='mb-6 sm:mb-auto text-gray-600'>{product.description}</Paragraph>

          {/* Action Button */}
          {isPurchased ? (
            <Button disabled className="w-fit">Purchased</Button>
          ) : !product.isAvailable ? (
            <Button disabled className='w-fit'>Not Available</Button>
          ) : (
            <AddCartButton className='w-fit' productId={product.id} />
          )}
        </div>
      </div>

      {/* Other Products */}
      <section className='mt-12 flex flex-col gap-8'>
        <Heading level='2'>Other {product.category?.title}</Heading>
        {!isProductList && <AlertDestructive error={productList} />}
        {isProductList && productList && (
          <>
            <div className='lg:col-span-2'>
                {/* Products */}
                {filteredOtherProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {filteredOtherProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}

                {/* Not Found */}
                {filteredOtherProducts.length === 0 && <Paragraph>No other products available in this category.</Paragraph>}
            </div>
            <Link href={`/products?category=${product.category?.title}`} className='self-end flex items-center gap-2'>
              All {product.category?.title}
              <MoveRight />
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
