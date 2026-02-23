import { cn } from '@/lib/utils';

interface HeadingProps {
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  className?: string;
  children?: React.ReactNode;
}

const levelClasses = {
  '1': 'text-4xl',
  '2': 'text-3xl',
  '3': 'text-2xl',
  '4': 'text-xl',
  '5': 'text-lg',
  '6': 'text-base',
};

export default function Heading({
  level = '1',
  className,
  children,
}: HeadingProps) {
  const HeadingEl = `h${level}` as React.ElementType;

  return (
    <HeadingEl
      className={cn(
        'font-semibold line-clamp-1 leading-5',
        levelClasses[level],
        className,
      )}
    >
      {children}
    </HeadingEl>
  );
}
