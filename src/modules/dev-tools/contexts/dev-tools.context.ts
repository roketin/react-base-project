import { createContext } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type TImageField = {
  field: string;
  filename?: string;
  width?: number;
  height?: number;
};

export type TFakerConfigEntry = Record<
  string,
  (() => unknown) | 'image' | 'skip'
>;

export type TDevFormEntry<T extends FieldValues = FieldValues> = {
  name: string;
  form: UseFormReturn<T>;
  testData?: Partial<T>;
  /** Faker config - functions called on each fill for fresh data */
  fakerConfig?: TFakerConfigEntry;
  imageFields?: TImageField[];
  /** Custom fill handler for complex fields like remote selects */
  onFill?: (form: UseFormReturn<T>) => void | Promise<void>;
};

export type TDevToolsContext = {
  // Form registry
  forms: Map<string, TDevFormEntry>;
  activeFormName: string | null;
  registerForm: <T extends FieldValues>(entry: TDevFormEntry<T>) => void;
  unregisterForm: (name: string) => void;
  setActiveForm: (name: string | null) => void;
  fillActiveForm: () => Promise<void>;
  clearActiveForm: () => void;
  // Grid overlay
  showGrid: boolean;
  toggleGrid: () => void;
  // Animation state
  lastAction: 'fill' | 'clear' | null;
  setLastAction: (action: 'fill' | 'clear' | null) => void;
};

export const DevToolsContext = createContext<TDevToolsContext | null>(null);
