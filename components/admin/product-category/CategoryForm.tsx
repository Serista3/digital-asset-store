'use client';

import FormError from '@/components/form/FormError';
import SubmitButton from '@/components/form/SubmitButton';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ActionState, ProductCategory } from '@/types';
import { useActionState } from 'react';

interface CategoryFormProps {
  formData?: ProductCategory;
  serverAction: (
    state: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
}

export default function CategoryForm({
  formData,
  serverAction,
}: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(serverAction, {
    errors: [],
    message: '',
  });

  return (
    <form action={formAction}>
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Type word..."
          className="border-gray-600"
          defaultValue={formData?.title || ''}
          required
          disabled={isPending}
        />
        <FieldDescription>
          Choose a title for product category.
        </FieldDescription>
      </Field>
      <SubmitButton btnText={formData ? 'Save' : 'Create'} />
      {state.errors && state.errors.length > 0 && <FormError state={state} />}
    </form>
  );
}
