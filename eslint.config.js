// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginQuery from '@tanstack/eslint-plugin-query';
import sonarjs from 'eslint-plugin-sonarjs';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'storybook-static']),
  {
    ignores: [
      '**/*.stories.tsx',
      '**/*.stories.ts',
      '**/*.test.tsx',
      '**/*.test.ts',
      '**/__tests__/**',
      'tests/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended'],
      sonarjs.configs.recommended,
    ],
    rules: {
      // Nested ternary is common pattern in React JSX
      'sonarjs/no-nested-conditional': 'off',
      // Random for IDs is safe
      'sonarjs/pseudo-random': 'off',
      // Type aliases are useful for readability
      'sonarjs/redundant-type-aliases': 'off',
      // Cognitive complexity limit is too strict for complex UI components
      'sonarjs/cognitive-complexity': ['error', 25],
      // Table primitives don't need headers - they're composed
      'sonarjs/table-header': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
