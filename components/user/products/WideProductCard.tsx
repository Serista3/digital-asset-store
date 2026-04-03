import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';
import { cn } from '@/lib/utils';

interface WideProductCardProps {
  product: Product;
  className?: string;
}

export default function WideProductCard({ product, className }: WideProductCardProps) {
  return (
    <Card className={cn("relative mx-auto w-full py-0 h-55 rounded-lg overflow-hidden", className)}>
      <div className="h-full w-full absolute shadow-[inset_0_-120px_60px_rgba(0,0,0,0.8)]" />
      <div className="overflow-hidden rounded-lg h-full w-full">
        <Image
          src={product.imageUrl || '/images/image-empty.png'}
          alt={product.title}
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="absolute bottom-5 left-0 w-full text-white px-4 flex flex-col gap-3">
        <CardHeader className="px-0 gap-0">
          <Heading level="4">{product.title}</Heading>
          <Paragraph className="line-clamp-1">{product.description}</Paragraph>
        </CardHeader>
        <CardFooter className="px-0 self-start">
          <Button variant='default' className="w-full border border-gray-600" asChild>
            <Link href={`/products/${product.id}`}>Product Detail</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
