'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { MONTHS } from '@/action/constants';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterMonthAndYearProps {
  month?: string;
  year?: string;
  className?: string;
}

export default function FilterMonthAndYear({ month, year, className }: FilterMonthAndYearProps) {
  const router = useRouter();
  const searchParam = useSearchParams();

  // Set Month & Year
  const handleValueChange = function (name: string, value: string) {
    const params = new URLSearchParams(searchParam);

    if (value && value !== 'all') {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.replace(`?${params.toString()}`);
  };

  // Calculate Array Years
  const currentYear = new Date().getFullYear();
  const initYear = 2000;

  const arrYears = Array.from({ length: (currentYear - initYear) + 5 }, (_, i) => initYear + i).reverse();

  return (
    <div className={cn('flex items-center gap-2 justify-end', className)}>
      {/* Month Select */}
      <Select
        defaultValue={month}
        onValueChange={(value) => handleValueChange('month', value)}
      >
        <SelectTrigger className="max-w-35 w-full">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='all'>All Month</SelectItem>
            {MONTHS.map((month, index) => (
              <SelectItem key={month} value={(index + 1).toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Year Select */}
      <Select
        defaultValue={year}
        onValueChange={(value) => handleValueChange('year', value)}
      >
        <SelectTrigger className="max-w-35 w-full">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {arrYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
