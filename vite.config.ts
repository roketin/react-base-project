/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import i18nTypesPlugin from './src/plugins/i18n/vite-plugin-i18n-types.ts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), i18nTypesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts', './tests/setup-msw.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts?(x)', 'tests/**/*.ts?(x)'],
      exclude: ['tests/render-with-config.tsx'],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          lucide: ['lucide-react'],
          tanstack: ['@tanstack/react-table'],
        },
      },
    },
  },
});
