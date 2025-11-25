import { nameToPath } from '@/modules/app/hooks/use-named-route';

/**
 * Navigate helper that can be used in module configs
 * This uses a global navigation function that will be set by the app
 */
let globalNavigate: ((path: string) => void) | null = null;

export function setGlobalNavigate(navigate: (path: string) => void) {
  globalNavigate = navigate;
}

export function navigateToRoute(
  routeName: string,
  queryParams?: Record<string, string>,
) {
  try {
    const path = nameToPath(routeName);
    const url = queryParams
      ? `${path}?${new URLSearchParams(queryParams).toString()}`
      : path;

    if (globalNavigate) {
      globalNavigate(url);
    } else {
      // Fallback to window.location if navigate not set
      window.location.href = url;
    }
  } catch (error) {
    console.error('Failed to navigate:', error);
  }
}
