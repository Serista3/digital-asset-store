import { cn } from '@/lib/utils';

interface ParagraphProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Paragraph({ className, children }: ParagraphProps) {
  return (
    <p
      className={cn(
        'font-light text-sm line-clamp-4 leading-7 break-after-all',
        className,
      )}
    >
      {children}
    </p>
  );
}
