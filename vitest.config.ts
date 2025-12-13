import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests'),
      '@config': path.resolve(__dirname, 'roketin.config.ts'),
      '@feature-flags': path.resolve(__dirname, 'feature-flags.config.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts', './tests/setup-msw.ts'],
    exclude: [...configDefaults.exclude, '**/*.stories.*'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts?(x)', 'tests/**/*.ts?(x)'],
      exclude: ['tests/render-with-config.tsx', '**/*.stories.*'],
    },
  },
});
