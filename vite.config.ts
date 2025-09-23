/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
});
