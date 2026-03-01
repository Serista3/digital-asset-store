import Heading from '@/components/typography/Heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formattedPrice } from '@/lib/utils';
import { Product } from '@/types';
import { CirclePlus } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="relative w-full max-w-125 pt-0 overflow-hidden hover:scale-101 transition-all duration-300">
      <Image
        src={product.imageUrl}
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
      <CardFooter>
        <Button className="w-full">
          <CirclePlus />
          <span>Add To Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
