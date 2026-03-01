import Heading from '@/components/typography/Heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WebLogo({ href = '/', className }: { href?: string, className?: string }) {
  return (
    <Link href={href} className={cn(className)}>
      <Heading level="2">
        <span>DigiDrop</span>
      </Heading>
    </Link>
  );
}
