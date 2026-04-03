import Heading from '@/components/typography/Heading';
import AddCartButton from './AddCartButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

import { formattedPrice } from '@/lib/utils';
import { ProductWithCategory } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="relative w-full max-w-125 pt-0 overflow-hidden hover:scale-101 transition-all duration-300">
      <Link href={`/products/${product.id}`} className='absolute top-0 left-0 size-full z-2' />
      <Image
        src={product.imageUrl || '/images/image-empty.png'}
        alt={product.title}
        width={300}
        height={300}
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <Heading level='4'>{product.title}</Heading>
        <Badge variant="outline">{product.category?.title}</Badge>
        <CardDescription>
          {product.description}
        </CardDescription>
        <div>
          {formattedPrice(product.priceInCents)}
        </div>
      </CardHeader>
      <CardFooter className='mt-auto relative z-3'>
        {product.isAvailable && <AddCartButton productId={product.id} />}
        {!product.isAvailable && <Button disabled>Not Available</Button>}
      </CardFooter>
    </Card>
  );
}
