import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStorageProps {
  title: string;
  description: string;
  content?: string;
  linkAction?: string;
  iconEl: React.ReactNode;
}

export default function EmptyStorage({
  title,
  description,
  content,
  linkAction,
  iconEl,
}: EmptyStorageProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">{iconEl}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {linkAction && (
        <EmptyContent>
          <Button size="sm">
            <Link href={linkAction}>{content}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
