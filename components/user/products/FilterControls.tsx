'use client';

import SubmitButton from '@/components/form/SubmitButton';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface FilterControlsProps {
  categories: { id: string; title: string }[];
}

export default function FilterControls({ categories }: FilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Default Value
  const sortByVal = searchParams.get('sortBy') || undefined;
  const titleVal = searchParams.get('title') ?? undefined;
  const categoryVal = searchParams.get('category') ?? undefined;
  const priceGte = searchParams.get('price_gte')
    ? Number(searchParams.get('price_gte'))
    : 0;
  const priceLte = searchParams.get('price_lte')
    ? Number(searchParams.get('price_lte'))
    : 5000;
  const [priceVal, setPriceVal] = useState([priceGte, priceLte]);
  const isAvailableVal = searchParams.get('isAvailable')
    ? searchParams.get('isAvailable') === 'true'
    : false;

  // Filter Product
  const handleForm = function (e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    const formData = new FormData(e.currentTarget);
    const isAvailable = formData.get('isAvailable');

    // Set Search Params
    formData.entries().forEach(([key, value]) => {
      if (key.includes('price')) return;

      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    if (isAvailable) {
      params.set('isAvailable', 'true');
    } else {
      params.delete('isAvailable');
    }

    params.delete('page');

    params.set('price_gte', priceVal[0].toString());
    params.set('price_lte', priceVal[1].toString());

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Clear Filter
  const handleClear = () => {
    startTransition(() => {
      setPriceVal([0, 5000]);

      router.push('?', { scroll: false });
    });
  };

  return (
    <div className="w-full border-gray-200 border rounded-lg p-6 shadow-lg self-start">
      <form onSubmit={handleForm} key={searchParams.toString()}>
        <FieldGroup>
          <div className="flex flex-col gap-3.5">
            {/* Sort */}
            <Heading level="3">Sort By</Heading>
            <Paragraph className="text-gray-500">
              เรียงสินค้าตามที่คุณเลือก เช่น A-Z, Z-A, Price (high to low),
              Price (low to high)
            </Paragraph>
            {/* Sort Select */}
            <Select name="sortBy" defaultValue={sortByVal} disabled={isPending}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select sort value." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="title_asc">A-Z</SelectItem>
                  <SelectItem value="title_dsc">Z-A</SelectItem>
                  <SelectItem value="price_desc">
                    Price (High to Low)
                  </SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <FieldSeparator />

          {/* Filter */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Heading level="3">Filter By</Heading>
              <Paragraph className="text-gray-500">
                กรองสินค้าตามที่คุณเลือก เช่น title, category เป็นต้น
              </Paragraph>
            </div>
            <FieldGroup>
              {/* Field Title  */}
              <Field>
                <FieldLabel htmlFor="title" className="text-base">
                  Title
                </FieldLabel>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter product title."
                  defaultValue={titleVal}
                  disabled={isPending}
                  className=" placeholder:text-gray-500 font-light text-sm"
                />
              </Field>

              {/* Field Category  */}
              <Field>
                <FieldLabel htmlFor="category" className="text-base">
                  Category
                </FieldLabel>
                <Select
                  name="category"
                  defaultValue={categoryVal}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.title}>
                            {category.title}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Field Price  */}
              <Field orientation="horizontal">
                <div className="grid w-full gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="price" className="text-base">
                      Price
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {priceVal.join(', ')}
                    </span>
                  </div>
                  <Slider
                    id="price"
                    name="price"
                    value={priceVal}
                    onValueChange={setPriceVal}
                    min={0}
                    max={10000}
                    step={500}
                    disabled={isPending}
                  />
                </div>
              </Field>

              {/* Field Available */}
              <Field orientation="horizontal">
                <Checkbox
                  id="isAvailable"
                  name="isAvailable"
                  defaultChecked={isAvailableVal}
                  disabled={isPending}
                />
                <FieldLabel htmlFor="isAvailable" className="font-normal">
                  available
                </FieldLabel>
              </Field>
            </FieldGroup>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <SubmitButton btnText="Apply Filter" />
            <Button
              variant="outline"
              type="button"
              disabled={isPending}
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
