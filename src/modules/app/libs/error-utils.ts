type ErrorObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * Recursively collects all error messages from a nested error object.
 *
 * @param {ErrorObject} errors - An object containing error details which may be nested.
 * @returns {string[]} An array of error message strings extracted from the error object.
 */
export function collectErrorMessages(errors: ErrorObject): string[] {
  const messages: string[] = [];

  // Iterate over each key in the error object
  for (const key in errors) {
    // Skip if the value is falsy (null, undefined, false, etc.)
    if (!errors?.[key]) continue;

    const value = errors[key];

    // Check if the value is an object containing a 'message' property
    if (value && typeof value === 'object' && 'message' in value) {
      // Extract and add the message string to the messages array
      messages.push((value as { message: string }).message);
    } else if (value && typeof value === 'object') {
      // If the value is an object but has no direct 'message', recursively collect messages from nested objects
      messages.push(...collectErrorMessages(value));
    }
  }

  // Return the collected array of error messages
  return messages;
}
