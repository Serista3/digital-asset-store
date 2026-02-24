'use client';

import { Field } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SearchIcon } from 'lucide-react';

export default function CategorySearch() {
  return (
    <Field className="max-w-sm">
      <InputGroup className="border-gray-600">
        <InputGroupInput id="inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
