import i18n from '@/plugins/i18n';
import Yup from '@/plugins/yup';

/**
 * Creates a Yup object schema to validate a date range with 'from' and 'to' dates.
 *
 * @param {string} label - The label used in validation messages (default is 'Date Range').
 * @returns {Yup.ObjectSchema} A Yup schema object for validating the date range.
 *
 * The schema includes:
 * - 'from' and 'to' fields, both transformed to handle null values as undefined.
 * - A custom test to ensure that at least one of 'from' or 'to' is provided.
 * - Marked as required and labeled for better error messages.
 */
export const yupDateRangeRequired = (label = 'Date Range') =>
  Yup.object({
    from: Yup.date()
      // Transform function converts null values to undefined to allow Yup to treat them as empty.
      .transform((val) => (val === null ? undefined : val))
      // Sets a label for the 'from' date field for error message clarity.
      .label('From Date'),
    to: Yup.date()
      // Similar transform for the 'to' date field to handle null values.
      .transform((val) => (val === null ? undefined : val))
      // Sets a label for the 'to' date field.
      .label('To Date'),
  })
    .default({})
    // Custom test named 'dateRangeRequired' to check if at least one date is provided.
    .test('dateRangeRequired', function (value) {
      const { from, to } = value || {};
      // If both 'from' and 'to' are missing, create a validation error with a localized message.
      if (!from && !to) {
        return this.createError({
          path: this.path,
          message: i18n.t('validation:required', { label }),
        });
      }
      // If validation passes, return true.
      return true;
    })
    // Marks the entire object as required, so it cannot be null or undefined.
    .required()
    // Sets the label for the whole date range object for error messages.
    .label(label);
