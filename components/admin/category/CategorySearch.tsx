'use client';

import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategorySearch() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathName = usePathname();

  const [value, setValue] = useState(searchParam.get('search') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParam);

      if (value) params.set('search', value);
      else params.delete('search');

      router.replace(`${pathName}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
