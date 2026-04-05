import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  path: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function DashboardStats({
  path,
  icon,
  title,
  description,
  className,
}: DashboardStatsProps) {
  return (
    <div
      className={cn(
        'border border-gray-700 rounded-lg px-10 py-6 flex flex-col gap-4 items-center relative transition-all duration-300 hover:scale-101',
        className,
      )}
    >
      <Link href={path} className="absolute top-0 left-0 w-full h-full" />
      {icon}
      <Heading level="3" className="capitalize">
        {title}
      </Heading>
      <Paragraph className="text-gray-400 text-base">{description}</Paragraph>
    </div>
  );
}
