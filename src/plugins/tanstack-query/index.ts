import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Don't retry on error
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Don't retry mutations on error
    },
  },
});
