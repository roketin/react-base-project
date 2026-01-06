import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import {
  DevToolsContext,
  type TDevFormEntry,
  type TImageField,
} from './dev-tools.context';
import type { TFakerConfig } from '../utils/fake-data-generator';

// Lazy load faker configs only in DEV mode
const loadFakerConfig = async (
  formName: string,
): Promise<TFakerConfig | undefined> => {
  if (!import.meta.env.DEV) return undefined;

  try {
    const { getFakerConfig } = await import('../faker-configs');
    return getFakerConfig(formName);
  } catch {
    return undefined;
  }
};

type TDevToolsProviderProps = {
  children: ReactNode;
};

/**
 * Generate a dummy image File from placeholder service
 */
const generateDummyImage = async (
  filename: string = 'test-image.png',
  width: number = 400,
  height: number = 300,
): Promise<File> => {
  const url = `https://placehold.co/${width}x${height}/png`;
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
};

export const DevToolsProvider = ({ children }: TDevToolsProviderProps) => {
  if (!import.meta.env.DEV) {
    return <>{children}</>;
  }

  return <DevToolsProviderInner>{children}</DevToolsProviderInner>;
};

const DevToolsProviderInner = ({ children }: TDevToolsProviderProps) => {
  const formsRef = useRef<Map<string, TDevFormEntry>>(new Map());
  const [activeFormName, setActiveFormName] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [lastAction, setLastAction] = useState<'fill' | 'clear' | null>(null);
  const [, setFormsVersion] = useState(0);

  const registerForm = useCallback(
    <T extends FieldValues>(entry: TDevFormEntry<T>) => {
      formsRef.current.set(entry.name, entry as TDevFormEntry);
      setActiveFormName(entry.name);
      setFormsVersion((v) => v + 1);
    },
    [],
  );

  const unregisterForm = useCallback((name: string) => {
    formsRef.current.delete(name);
    setActiveFormName((current) => (current === name ? null : current));
    setFormsVersion((v) => v + 1);
  }, []);

  const setActiveForm = useCallback((name: string | null) => {
    setActiveFormName(name);
  }, []);

  const fillActiveForm = useCallback(async () => {
    if (!activeFormName) return;

    const entry = formsRef.current.get(activeFormName);
    if (!entry) return;

    const {
      form,
      testData,
      fakerConfig: providedFakerConfig,
      imageFields = [],
      onFill,
    } = entry;

    console.log('[DevTools] Fill action triggered');
    setLastAction('fill');
    setTimeout(() => setLastAction(null), 1500);

    // Try to load faker config from auto-discovery first, then fall back to provided config
    const fakerConfig =
      providedFakerConfig || (await loadFakerConfig(activeFormName));

    // Generate fresh data from fakerConfig (functions called each time)
    if (fakerConfig) {
      const imageFieldsFromConfig: TImageField[] = [];

      for (const [key, value] of Object.entries(fakerConfig)) {
        if (value === 'skip' || value === undefined) continue;

        if (value === 'image') {
          imageFieldsFromConfig.push({
            field: key,
            filename: `${key.replace(/_/g, '-')}-test.png`,
          });
          continue;
        }

        if (typeof value === 'function') {
          const generatedValue = value();
          if (generatedValue !== undefined) {
            form.setValue(key as Path<FieldValues>, generatedValue, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }
      }

      // Handle image fields from fakerConfig
      if (imageFieldsFromConfig.length > 0) {
        const imagePromises = imageFieldsFromConfig.map(async (img) => {
          const file = await generateDummyImage(
            img.filename,
            img.width,
            img.height,
          );
          form.setValue(img.field as Path<FieldValues>, file, {
            shouldValidate: true,
            shouldDirty: true,
          });
        });
        await Promise.all(imagePromises);
      }
    }

    // Fill static test data (fallback)
    if (testData) {
      Object.entries(testData).forEach(([key, value]) => {
        form.setValue(key as Path<FieldValues>, value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }

    // Handle explicit image fields
    if (imageFields.length > 0) {
      const imagePromises = imageFields.map(async (img: TImageField) => {
        const file = await generateDummyImage(
          img.filename,
          img.width,
          img.height,
        );
        form.setValue(img.field as Path<FieldValues>, file, {
          shouldValidate: true,
          shouldDirty: true,
        });
      });

      await Promise.all(imagePromises);
    }

    // Call custom onFill handler for complex fields (e.g., remote selects)
    if (onFill) {
      try {
        await onFill(form);
      } catch (error) {
        console.error('[DevTools] onFill handler error:', error);
      }
    }
  }, [activeFormName]);

  const clearActiveForm = useCallback(() => {
    if (!activeFormName) return;

    const entry = formsRef.current.get(activeFormName);
    if (!entry) return;

    console.log('[DevTools] Clear action triggered');
    setLastAction('clear');
    setTimeout(() => setLastAction(null), 1500);

    entry.form.reset();
  }, [activeFormName]);

  const toggleGrid = useCallback(() => {
    setShowGrid((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      forms: formsRef.current,
      activeFormName,
      registerForm,
      unregisterForm,
      setActiveForm,
      fillActiveForm,
      clearActiveForm,
      showGrid,
      toggleGrid,
      lastAction,
      setLastAction,
    }),
    [
      activeFormName,
      registerForm,
      unregisterForm,
      setActiveForm,
      fillActiveForm,
      clearActiveForm,
      showGrid,
      toggleGrid,
      lastAction,
    ],
  );

  return (
    <DevToolsContext.Provider value={value}>
      {children}
      {showGrid && (
        <div className='fixed inset-0 z-9999 pointer-events-none'>
          <div
            className='w-full h-full opacity-20'
            style={{
              backgroundImage: `
                linear-gradient(to right, #ef4444 1px, transparent 1px),
                linear-gradient(to bottom, #ef4444 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px',
            }}
          />
        </div>
      )}
    </DevToolsContext.Provider>
  );
};
