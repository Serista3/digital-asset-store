import Heading from '@/components/typography/Heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function WebLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn(className)}>
      <Heading level="2">
        <span>DigiDrop</span>
      </Heading>
    </Link>
  );
}
