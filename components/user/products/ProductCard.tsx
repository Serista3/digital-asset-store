import Heading from '@/components/typography/Heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

import { formattedPrice } from '@/lib/utils';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import AddCartButton from './AddCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="relative w-full max-w-125 pt-0 overflow-hidden hover:scale-101 transition-all duration-300">
      <Link href={`/products/${product.id}`} className='absolute top-0 left-0 size-full z-2' />
      <Image
        src={product.imageUrl}
        alt={product.title}
        width={300}
        height={300}
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <Heading level='4' className='z-3 w-fit'>{product.title}</Heading>
        <Badge variant="outline" className='z-3'>{product.category?.title}</Badge>
        <CardDescription className='z-3 w-fit'>
          {product.description}
        </CardDescription>
        <div className='z-3 w-fit'>
          {formattedPrice(product.priceInCents)}
        </div>
      </CardHeader>
      <CardFooter>
        <AddCartButton />
      </CardFooter>
    </Card>
  );
}
