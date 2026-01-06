import { useContext, useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import {
  DevToolsContext,
  type TImageField,
} from '../contexts/dev-tools.context';
import type { TFakerConfig } from '../utils/fake-data-generator';

/**
 * Hook to access dev tools context
 */
export const useDevTools = () => {
  const context = useContext(DevToolsContext);

  // Return no-op functions if not in dev mode or no provider
  if (!context) {
    return {
      forms: new Map(),
      activeFormName: null,
      registerForm: () => {},
      unregisterForm: () => {},
      setActiveForm: () => {},
      fillActiveForm: async () => {},
      clearActiveForm: () => {},
      showGrid: false,
      toggleGrid: () => {},
      lastAction: null,
      setLastAction: () => {},
    };
  }

  return context;
};

type TUseDevFormRegistryOptions<T extends FieldValues> = {
  name: string;
  form: UseFormReturn<T>;
  /** Faker config - functions called on each fill for fresh data */
  fakerConfig?: TFakerConfig;
  /** Static test data (fallback if no fakerConfig) */
  testData?: Partial<T>;
  /** Image fields config */
  imageFields?: TImageField[];
  /** Custom fill handler for complex fields like remote selects */
  onFill?: (form: UseFormReturn<T>) => void | Promise<void>;
};

/**
 * Hook to register a form with dev tools
 * Automatically registers on mount and unregisters on unmount
 *
 * @example
 * ```tsx
 * const form = useForm<TClientFormSchema>();
 *
 * useDevFormRegistry({
 *   name: 'client-form',
 *   form,
 *   testData: {
 *     name: 'Test Client',
 *     email: 'test@example.com',
 *   },
 *   imageFields: [
 *     { field: 'avatar', filename: 'avatar.png' },
 *   ],
 *   // For remote select fields
 *   onFill: async (form) => {
 *     const roles = await fetchRoles({ limit: 1 });
 *     form.setValue('role_id', roles[0]?.id);
 *   },
 * });
 * ```
 */
export const useDevFormRegistry = <T extends FieldValues>({
  name,
  form,
  fakerConfig,
  testData,
  imageFields,
  onFill,
}: TUseDevFormRegistryOptions<T>) => {
  const { registerForm, unregisterForm } = useDevTools();

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    registerForm({
      name,
      form,
      fakerConfig, // Pass config directly - functions called on each fill
      testData,
      imageFields,
      onFill,
    });

    return () => {
      unregisterForm(name);
    };
  }, [
    name,
    form,
    fakerConfig,
    testData,
    imageFields,
    onFill,
    registerForm,
    unregisterForm,
  ]);
};
