/**
 * Auto-discovery for faker configs - DEV ONLY
 * Uses import.meta.glob which is tree-shaken in production
 */
import type { TFakerConfig } from '../utils/fake-data-generator';

type TFakerConfigModule = { fakerConfig: TFakerConfig };

// This glob pattern only matches files in dev-tools/faker-configs
// Vite will tree-shake this entire module in production when not imported
const fakerModules = import.meta.glob<TFakerConfigModule>('./*.faker.ts', {
  eager: false,
});

/**
 * Get faker config for a form by name
 * Returns undefined if not found or in production
 */
export async function getFakerConfig(
  formName: string,
): Promise<TFakerConfig | undefined> {
  if (!import.meta.env.DEV) return undefined;

  const modulePath = `./${formName}.faker.ts`;
  const loader = fakerModules[modulePath];

  if (!loader) {
    console.warn(`[DevTools] No faker config found for form: ${formName}`);
    return undefined;
  }

  try {
    const module = await loader();
    return module.fakerConfig;
  } catch (err) {
    console.warn(
      `[DevTools] Failed to load faker config for ${formName}:`,
      err,
    );
    return undefined;
  }
}
