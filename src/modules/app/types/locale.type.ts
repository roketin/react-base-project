import type { CustomTypeOptions } from 'i18next';

export type TLocale = {
  [N in keyof CustomTypeOptions['resources']]: {
    [K in keyof CustomTypeOptions['resources'][N]]: `${N & string}:${K & string}`;
  }[keyof CustomTypeOptions['resources'][N]];
}[keyof CustomTypeOptions['resources']] extends infer A
  ? A extends string
    ? A
    : never
  : never;
