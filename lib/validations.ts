import { z } from 'zod';

// Validation
export const validateFormData = function <T>(
  schema: z.ZodType<T>,
  data: unknown,
) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues,
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

// Category Schema
export const productCategorySchema = z.object({
  title: z
    .string({
      message: 'Title must be a string.',
    })
    .trim()
    .min(4, { message: 'Title length must be greater than 3.' }),
});

export type ProductCategoryFormData = z.infer<typeof productCategorySchema>;

// Product Schema
export const productSchema = z.object({
  title: z
    .string('Type title must be String.')
    .trim()
    .min(6, 'Title length must be greater than 5.')
    .max(200, 'Title length must be less than equal to 200.'),
  description: z
    .string('Type description must be String.')
    .trim()
    .max(200, 'Description length must be less than equal to 200.'),
  priceInCents: z
    .number('Type price must be Int.')
    .positive('Price must greater than 0.')
    .gte(10, 'Price must greater than equal to 10')
    .lte(10000000, 'Price must less than equal to 10000000'),
  imageUrl: z
    .file(`It's not type file.`)
    .min(10_240, 'File size minimun must greater than 10KB.') // 10KB
    .max(5_242_880, 'File size minimun must less than 5MB.') // 5MB
    .mime(['image/jpeg', 'image/png', 'image/webp']),
  fileUrl: z
    .file(`It's not type file.`)
    .min(1_240, 'File size minimun must greater than 1KB.') // 1KB
    .max(52_428_800, 'File size minimun must less than 50MB.') // 50MB
    .mime([
      'application/pdf',
      'application/zip',
      'application/javascript',
      'application/json',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
    ]),
  isAvailable: z.boolean('Type isAvailable must be Boolean.'),
  categoryId: z.uuid('Type categoryId must be UUID.'),
});

export type ProductFormData = z.infer<typeof productSchema>;
