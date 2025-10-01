import {
  COMMON_EXT,
  COMMON_FILE_SIZE,
} from '@/modules/app/constants/app.constant';
import {
  byteToMb,
  formatBytes,
  getFileExtensionFromFile,
} from '@/modules/app/libs/file-utils';
import Yup from '@/plugins/yup';
import type { TestConfig, TestContext } from 'yup';

/**
 * Validate file extensions
 * @param exts
 * @returns
 */
export const fileExtRule = (exts: string[]): TestConfig<unknown> => {
  return {
    name: 'check-file-exts',
    message: ({ path }) => {
      return `${path} that are allowed are only ${exts.join(', ')} extension`;
    },
    test: (value) => {
      return exts.includes(getFileExtensionFromFile(value as File) ?? '');
    },
  };
};

/**
 * Validate file size
 * @param {min: number, max: number}
 * @returns
 */
export const fileSizeRule = ({
  min,
  max,
}: {
  min: number;
  max: number;
}): TestConfig<unknown> => {
  return {
    name: 'check-file-size',
    test: (value, ctx: TestContext) => {
      const fileSize = (value as File).size;

      if (min && max) {
        if (fileSize < byteToMb(min) || fileSize > byteToMb(max)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size min ${formatBytes(min)} and max ${formatBytes(byteToMb(max))}'`,
          });
        }
      } else if (min && !max) {
        if (fileSize < byteToMb(min)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size min ${formatBytes(byteToMb(min))}`,
          });
        }
      } else if (max && !min) {
        if (fileSize > byteToMb(max)) {
          return ctx.createError({
            message: ({ path }) =>
              `${path} only allow file size max ${formatBytes(byteToMb(max))}`,
          });
        }
      }

      return true;
    },
  };
};

/**
 * Validates either a File or a string, with optional checks for allowed extensions, file size, and required flag.
 * @param label - The label for the schema.
 * @param options - Options for allowed file extensions, file size limits, and required flag.
 * @returns A Yup schema for validation.
 */
export const fileOrStringRule = (
  label = 'File',
  options?: {
    allowedExts?: string[];
    size?: { min: number; max: number };
    required?: boolean;
  },
) => {
  const {
    allowedExts = COMMON_EXT.IMAGES,
    size = COMMON_FILE_SIZE,
    required,
  } = options || {};

  let schema = Yup.mixed<File | string>().label(label);

  if (allowedExts) {
    schema = schema.test(fileExtRule(allowedExts));
  }

  if (size) {
    schema = schema.test(fileSizeRule(size));
  }

  if (required) {
    schema = schema.required();
  }

  return schema;
};
