'use client';

import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useSearch } from '@/hooks/useSearch';
import { SearchIcon } from 'lucide-react';

export default function OrderSearch() {
  const { value, setValue } = useSearch();

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupInput
          id="inline-start-input"
          placeholder="Search order number..."
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
