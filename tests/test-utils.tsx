import { prettyDOM, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export function renderWithConfig(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      {ui}
      <Toaster />
    </QueryClientProvider>,
  );
}

export function screenDebugFull(element: HTMLElement = document.body) {
  console.log(prettyDOM(element, Infinity));
}
