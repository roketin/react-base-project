import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/modules/app/assets/css/global.css';
import '../src/plugins/i18n';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Components', '*'],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <div className='font-sans antialiased'>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
