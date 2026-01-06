import type { ObjectSchema, AnyObject } from 'yup';

/**
 * Faker config type for separate file approach
 * Use this to avoid bundling faker in production
 */
export type TFakerConfig = Record<string, (() => unknown) | 'image' | 'skip'>;

/**
 * Auto-detect image fields from field names
 * Looks for patterns like: *_file, *_image, avatar, photo, thumbnail, logo, etc.
 */
export const detectImageFields = (
  fieldNames: string[],
): { field: string; filename: string }[] => {
  const imagePatterns = [
    '_file',
    '_image',
    'avatar',
    'photo',
    'thumbnail',
    'logo',
    'picture',
    'banner',
    'cover',
    'attachment',
  ];

  return fieldNames
    .filter((field) => {
      const name = field.toLowerCase();
      return imagePatterns.some((pattern) => name.includes(pattern));
    })
    .map((field) => ({
      field,
      filename: `${field.replace(/_/g, '-')}-test.png`,
    }));
};

/**
 * Auto-generate fake data from form field names (no-op in production)
 * Returns empty object - actual generation happens via fakerConfig
 */
export const autoGenerateFromFields = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: unknown[]
): Record<string, unknown> => {
  // No-op - faker generation should be done via fakerConfig files
  return {};
};

/**
 * Generate fake data from Yup schema meta (no-op - deprecated)
 * Use fakerConfig approach instead to avoid bundling faker
 */
export const generateFromSchema = <T extends AnyObject>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ..._args: [ObjectSchema<T>]
): {
  testData: Record<string, unknown>;
  imageFields: { field: string; filename: string }[];
} => {
  // No-op - use fakerConfig approach instead
  return { testData: {}, imageFields: [] };
};

/**
 * Generate fake data from a faker config object
 * This allows importing faker config from a separate DEV-only file
 *
 * @example
 * // client-form.faker.ts (DEV only)
 * import { faker } from '@faker-js/faker';
 * export const clientFormFakerConfig = {
 *   email: () => faker.internet.email(),
 *   name: () => faker.company.name(),
 *   avatar: 'image',
 *   role_id: 'skip',
 * };
 *
 * // client-form.tsx
 * import { clientFormFakerConfig } from './client-form.faker';
 * useDevFormRegistry({
 *   name: 'client-form',
 *   form,
 *   fakerConfig: import.meta.env.DEV ? clientFormFakerConfig : undefined,
 * });
 */
export const generateFromFakerConfig = (
  config: TFakerConfig,
): {
  testData: Record<string, unknown>;
  imageFields: { field: string; filename: string }[];
} => {
  const testData: Record<string, unknown> = {};
  const imageFields: { field: string; filename: string }[] = [];

  for (const [fieldName, fakerType] of Object.entries(config)) {
    if (!fakerType || fakerType === 'skip') continue;

    // Handle image type
    if (fakerType === 'image') {
      imageFields.push({
        field: fieldName,
        filename: `${fieldName.replace(/_/g, '-')}-test.png`,
      });
      continue;
    }

    // Handle function
    if (typeof fakerType === 'function') {
      const value = fakerType();
      if (value !== undefined) {
        testData[fieldName] = value;
      }
    }
  }

  return { testData, imageFields };
};
