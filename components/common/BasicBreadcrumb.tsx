import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MoveLeft } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Fragment } from 'react';
import Link from 'next/link';

interface BasicBreadcrumbProps {
  linkItems: { path: string, label: string }[]
  className?: string;
}

export default function BasicBreadcrumb({ linkItems = [], className }: BasicBreadcrumbProps) {
  return (
    <>
      {linkItems.length > 0 && (
        <Breadcrumb className={cn(className)}>
          <BreadcrumbList>
            {linkItems.map((item, index) => (
              <Fragment key={item.label}>
                {index + 1 !== linkItems.length ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={item.path}>{item.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {linkItems.length === 0 && (
        <Link
          href=".."
          className={cn(
            'mb-4 text-sm text-gray-500 flex items-center gap-1',
            className,
          )}
        >
          <MoveLeft />
          Back
        </Link>
      )}
    </>
  );
}
