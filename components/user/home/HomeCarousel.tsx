import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import WideProductCard from '../products/WideProductCard';
import { Product } from '@/types';

interface HomeCarouselProps {
  products: Product[];
}

export default function HomeCarousel({ products }: HomeCarouselProps) {
  return (
    <Carousel className="w-full max-w-275 relative">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id}>
            <WideProductCard product={product} className='sm:h-75 md:h-90' />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className='absolute top-3 right-3 flex items-center gap-2'>
        <CarouselPrevious className='static translate-0' />
        <CarouselNext className='static translate-0' />
      </div>
    </Carousel>
  );
}
