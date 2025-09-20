type ErrorObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function collectErrorMessages(errors: ErrorObject): string[] {
  const messages: string[] = [];

  for (const key in errors) {
    if (!errors?.[key]) continue;

    const value = errors[key];

    if (value && typeof value === 'object' && 'message' in value) {
      messages.push((value as { message: string }).message);
    } else if (value && typeof value === 'object') {
      messages.push(...collectErrorMessages(value));
    }
  }

  return messages;
}
