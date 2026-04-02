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
    .coerce
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
      'application/zip',
      'application/x-zip-compressed',
      'application/vnd.rar',
      'application/x-rar-compressed',

      'application/pdf',
      'application/epub+zip',

      'image/vnd.adobe.photoshop',
      'application/x-photoshop',
      'application/postscript',
      'image/svg+xml',
      'application/octet-stream',

      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ]),
  isAvailable: z.coerce.boolean('Type isAvailable must be Boolean.'),
  categoryId: z.uuid('Type categoryId must be UUID.'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const editProductSchema = productSchema.extend({
  imageUrl: productSchema.shape.imageUrl.optional(),
  fileUrl: productSchema.shape.fileUrl.optional(),
});

// Search Params Schema
export const searchParamsSchema = z.object({
  searchTerm: z.string().trim().optional().default(''),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

// Product Search Params Schema
export const productSearchParamsSchema = z.object({
  sortBy: z.enum(['price_desc', 'price_asc', 'title_desc', 'title_asc', 'newest']).default('newest'),
  title: z.string().trim().toLowerCase().optional().catch(''),
  category: z.string().trim().optional().catch(''),
  price_gte: z.coerce.number().catch(0),
  price_lte: z.coerce.number().catch(1000000),
  isAvailable: z.enum(['true', 'false']).optional(),
});

// Product Id Schema
export const productIdSchema = z.string().min(1, 'Product ID is required');

// Product Category Id Schema
export const productCategoryIdSchema = z.string().min(1, 'Product Category ID is required');

// Stripe Session Id Schema
export const stripeSessionIdSchema = z.string().min(1, 'Stripe Session ID is required');
