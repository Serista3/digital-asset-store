'use client';

import FormError from '@/components/form/FormError';
import SubmitButton from '@/components/form/SubmitButton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormData } from '@/lib/validations';
import { ActionState, Product } from '@/types';
import { ProductCategory } from '@prisma/client';
import Link from 'next/link';
import { useActionState } from 'react';

interface ProductFormProps {
  formData?: Product;
  serverAction: (
    state: ActionState<ProductFormData>,
    formData: FormData,
  ) => Promise<ActionState<ProductFormData>>;
  categories: ProductCategory[];
}

export default function ProductForm({
  formData,
  serverAction,
  categories,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(serverAction, {
    errors: [],
    message: '',
  });

  return (
    <form action={formAction}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldDescription>
            The basic information for product.
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Type word..."
              defaultValue={state.oldFormData?.title || formData?.title || ''}
              required
              disabled={isPending}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="categoryId">Category</FieldLabel>
            <Select
              disabled={isPending}
              defaultValue={
                state.oldFormData?.categoryId || formData?.category?.id
              }
              name="categoryId"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Type description about product..."
              defaultValue={
                state.oldFormData?.description || formData?.description || ''
              }
              disabled={isPending}
            />
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Media & Assets</FieldLegend>
          <FieldDescription>
            Choose media or asset for product.
          </FieldDescription>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="imageUrl">Image</FieldLabel>
              <Input
                id="imageUrl"
                type="file"
                name="imageUrl"
                placeholder="Choose image for product..."
                accept="image/jpeg,image/png,image/webp"
                required={!formData}
                disabled={isPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="fileUrl">File</FieldLabel>
              <Input
                id="fileUrl"
                type="file"
                name="fileUrl"
                placeholder="Choose file for product..."
                accept=".zip,.rar,.pdf,.epub,.psd,.ai,.fig,.svg,.xlsx,.pptx,.docx"
                required={!formData}
                disabled={isPending}
              />
            </Field>
          </div>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Pricing & Availability</FieldLegend>
          <FieldDescription>
            Pricing and availability for product.
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="priceInCents">Price</FieldLabel>
            <Input
              id="priceInCents"
              type="number"
              name="priceInCents"
              placeholder="Type price for product..."
              defaultValue={
                state.oldFormData?.priceInCents || formData?.priceInCents || ''
              }
              required
              disabled={isPending}
              className="max-w-70"
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="isAvailable"
              name="isAvailable"
              key={String(
                state.oldFormData?.isAvailable ??
                  formData?.isAvailable ??
                  false,
              )}
              defaultChecked={
                state.oldFormData?.isAvailable ?? formData?.isAvailable ?? false
              }
              disabled={isPending}
            />
            <FieldLabel htmlFor="isAvailable">Is Available</FieldLabel>
          </Field>
        </FieldSet>
        <Field
          orientation="horizontal"
          className="flex items-center gap-3 justify-start mt-10"
        >
          <SubmitButton
            btnText={formData ? 'Save' : 'Create'}
            className="mt-0"
          />
          <Button
            variant="outline"
            type="button"
            asChild={!isPending}
            disabled={isPending}
          >
            <div>
              {!isPending && <Link href="/admin/products">Cancel</Link>}
              {isPending && 'Cancel'}
            </div>
          </Button>
        </Field>
      </FieldGroup>
      {state.errors && state.errors.length > 0 && <FormError state={state} />}
    </form>
  );
}
