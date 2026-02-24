import { z } from 'zod';

// Validate
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

// Schema
export const ProductCategorySchema = z.object({
  title: z
    .string({
      message: 'Title must be a string.',
    })
    .trim()
    .min(4, { message: 'Title length must be greater than 3.' }),
});
