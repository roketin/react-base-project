# 🤖 Agents Documentation

> Comprehensive guide for AI agents working with React Base Project

This document serves as the primary reference for AI coding agents (Claude, Cursor, Gemini, Copilot, etc.) to understand the project architecture, conventions, and workflows.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack Summary](#-tech-stack-summary)
3. [Configuration Files](#-configuration-files)
4. [Module Architecture](#-module-architecture)
5. [Base Components](#-base-components)
6. [CLI Tools](#-cli-tools)
7. [Common Workflows](#-common-workflows)
8. [Rules & Conventions](#-rules--conventions)

---

## 🧭 Project Overview

**React Base Project** is a batteries-included dashboard scaffold using the Roketin design system. It provides:

- Authenticated layouts and route guards
- 80+ reusable UI components prefixed with `R` (e.g., `RBtn`, `RInput`, `RDataTable`)
- Feature flag system for toggling modules
- Module-based architecture with auto-discovery
- CLI tools for scaffolding new modules

### Key Directories

```
react-base-project/
├── roketin.config.ts          # App branding, sidebar, routes config
├── feature-flags.config.ts    # Feature flag definitions
├── bin/roketin/               # CLI tools for module generation
├── src/
│   ├── modules/               # Feature modules (app, auth, config, etc.)
│   └── plugins/               # Custom Vite plugins
└── tests/                     # Test setup and utilities
```

---

## 🛠 Tech Stack Summary

| Category      | Technology                           |
| ------------- | ------------------------------------ |
| **Framework** | React 19 + Vite 7                    |
| **State**     | Zustand, React Query, Immer          |
| **Routing**   | React Router v7                      |
| **Styling**   | Tailwind CSS 4 (`@tailwindcss/vite`) |
| **Forms**     | React Hook Form, Yup                 |
| **Testing**   | Vitest, Testing Library, MSW         |
| **Quality**   | ESLint, Prettier, Husky, Commitlint  |
| **Storybook** | Storybook v10                        |

### Key Commands

```bash
pnpm dev           # Start dev server (port 5177)
pnpm build         # Production build
pnpm test          # Run tests
pnpm lint          # Lint codebase
pnpm roketin       # CLI for module scaffolding
pnpm storybook     # Run Storybook (port 6006)
```

---

## 🔧 Configuration Files

### 1. `roketin.config.ts`

The central application configuration for branding, sidebar, routes, filters, and languages.

```typescript
import { defineRoketinConfig } from './src/modules/app/types/app.type';

export default defineRoketinConfig({
  app: {
    name: 'R-Skeleton', // Full app name
    shortName: 'RSkeleton', // Short name for UI
    tagline: 'Roketin App Skeleton',
  },

  sidebar: {
    settings: {
      stateStorage: { type: 'local-storage', key: 'sidebar_state' },
      width: '16rem',
      widthMobile: '20rem',
      widthIcon: '4rem',
      keyboardShortcut: 'b', // ⌘/Ctrl + B toggles sidebar
    },
  },

  filters: {
    persistence: {
      enabled: true,
      strategy: 'local-storage',
      keyPrefix: 'filter_',
      debounceMs: 200,
    },
  },

  routes: {
    admin: { basePath: '/r-admin' }, // Admin route prefix
  },

  languages: {
    enabled: true,
    debug: false,
    supported: [
      { code: 'en', label: 'English', isDefault: true },
      { code: 'id', label: 'Bahasa Indonesia' },
    ],
  },
});
```

### 2. `feature-flags.config.ts`

Defines all feature flags used to toggle modules/features.

```typescript
import { defineFeatureFlags } from './feature-flags.config';

const featureFlags = defineFeatureFlags({
  DASHBOARD: {
    env: 'VITE_FEATURE_DASHBOARD',
    description: 'Dashboard module visibility.',
    defaultEnabled: true,
  },
  SAMPLE_FORM: {
    env: 'VITE_FEATURE_SAMPLE_FORM',
    description: 'Sample form module visibility.',
    defaultEnabled: true,
  },
  CONFIG: { env: 'VITE_FEATURE_CONFIG', defaultEnabled: true },
  CONFIG_USER: { env: 'VITE_FEATURE_CONFIG_USER', defaultEnabled: true },
  CONFIG_ROLE: { env: 'VITE_FEATURE_CONFIG_ROLE', defaultEnabled: true },
});
```

**Usage in code:**

```typescript
import { isFeatureEnabled, useFeatureFlag } from '@/modules/app/libs/feature-flag';

// Synchronous check
if (isFeatureEnabled('DASHBOARD')) { ... }

// Hook for components
const isEnabled = useFeatureFlag('SAMPLE_FORM');
```

### 3. `.env.example`

```bash
VITE_API_URL=                    # Backend API URL
VITE_CRYPTO_SECRET="..."         # Secret for token encryption

# Feature flags (set to 'true' or 'false')
VITE_FEATURE_DASHBOARD=true
VITE_FEATURE_SAMPLE_FORM=true
```

### 4. `vite.config.ts`

Key aliases for imports:

```typescript
alias: {
  '@': path.resolve(__dirname, 'src'),
  '@tests': path.resolve(__dirname, 'tests'),
  '@config': path.resolve(__dirname, 'roketin.config.ts'),
  '@feature-flags': path.resolve(__dirname, 'feature-flags.config.ts'),
}
```

---

## 📦 Module Architecture

### Current Modules

| Module              | Path                              | Description                                     |
| ------------------- | --------------------------------- | ----------------------------------------------- |
| **app**             | `src/modules/app`                 | Core shell, layouts, base components, utilities |
| **auth**            | `src/modules/auth`                | Authentication, login, guards                   |
| **dashboard**       | `src/modules/dashboard`           | Dashboard page                                  |
| **sample-form**     | `src/modules/sample-form`         | Form examples, widgets                          |
| **config**          | `src/modules/config`              | Configuration parent module                     |
| **config/user**     | `src/modules/config/modules/user` | User management (child of config)               |
| **config/role**     | `src/modules/config/modules/role` | Role management (child of config)               |
| **adaptive-search** | `src/modules/adaptive-search`     | Global search system                            |

### Module Config Pattern

Each module has a `<module>.config.ts` file:

```typescript
// src/modules/dashboard/dashboard.config.ts
import { House } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const dashboardModuleConfig = defineModuleConfig({
  moduleId: 'dashboard',
  featureFlag: 'DASHBOARD', // Links to feature-flags.config.ts
  menu: {
    title: 'dashboard:title', // i18n translation key
    icon: House, // Lucide icon
    name: 'DashboardIndex', // Route name
    permission: 'DASHBOARD_VIEW', // Permission key
    order: -9999, // Menu order (lower = higher)
  },
});
```

### Child Module Pattern

```typescript
// src/modules/config/modules/user/user.config.ts
export const UserModuleConfig = defineModuleConfig({
  moduleId: 'config-user',
  parentModuleId: 'config', // Parent module ID
  featureFlag: 'CONFIG_USER',
  menu: {
    title: 'user:title',
    name: 'UserIndex',
    order: 2,
  },
});
```

### Module Folder Structure

```
src/modules/<module>/
├── <module>.config.ts           # Module config
├── components/
│   ├── pages/                   # Page components
│   └── partials/                # Partial components
├── routes/
│   └── <module>.routes.tsx      # Route definitions
├── services/
│   └── <module>.service.ts      # API services
├── hooks/                       # Custom hooks
├── stores/                      # Zustand stores
├── types/                       # TypeScript types
├── locales/                     # i18n files
│   ├── <module>.en.json
│   └── <module>.id.json
└── modules/                     # Nested child modules
    └── <child>/
```

---

## 🎨 Base Components

Located in `src/modules/app/components/base/`, all components use `R` prefix.

### Available Components (82+)

| Category         | Components                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Buttons**      | `RBtn`, `RButtonGroup`, `RFloatButton`                                                                                                                                                                  |
| **Forms**        | `RInput`, `RInputNumber`, `RInputPassword`, `RTextarea`, `RSelect`, `RSelectInfinite`, `RCheckbox`, `RCheckboxMultiple`, `RRadio`, `RRadioGroup`, `RSwitch`, `RPicker`, `RRangePicker`, `RFileUploader` |
| **Form System**  | `RForm`, `RFormField`, `RFormFieldset`, `RFormPrimitives`                                                                                                                                               |
| **Data Display** | `RDataTable`, `RDataList`, `RSimpleTable`, `RList`, `RTimeline`, `RStatisticDashboard`, `RBadge`, `RProgress`                                                                                           |
| **Layout**       | `RCard`, `RSidebar`, `RSplitter`, `RCollapse`, `RTabs`, `RStepper`, `RCarousel`, `RAspectRatio`, `RStickyWrapper`                                                                                       |
| **Navigation**   | `RBreadcrumbs`, `RMenu`, `RMenubar`, `RNavigationMenu`, `RPagination`, `RNavigate`, `RAnchor`                                                                                                           |
| **Feedback**     | `RDialog`, `RAlertDialog`, `RSheet`, `RTooltip`, `RPopconfirm`, `RPopover`, `RHoverCard`, `RDropdownMenu`, `RContextMenu`, `RResult`, `REmptyState`, `RLoading`, `RToaster`, `RCustomToast`             |
| **Media**        | `RImg`, `RAvatar`, `RFileViewer`                                                                                                                                                                        |
| **Utilities**    | `RSeparator`, `RSkeleton`, `RLabel`, `RVirtualScroll`, `RInfiniteScroll`                                                                                                                                |
| **Branding**     | `RBrand`, `RThemeSwitcher`, `RLangSwitcher`                                                                                                                                                             |

### Component Naming Convention

- **File**: `r-{component-name}.tsx` (e.g., `r-btn.tsx`)
- **Component**: `R{ComponentName}` (e.g., `RBtn`)
- **Props Type**: `TR{ComponentName}Props` (e.g., `TRBtnProps`)
- **Tests**: `{component-name}.test.tsx`
- **Stories**: `{component-name}.stories.tsx`

### Component Usage Example

```tsx
import { RBtn, RInput, RCard } from '@/modules/app/components/base';

function MyComponent() {
  return (
    <RCard>
      <RInput placeholder='Enter text' />
      <RBtn variant='primary' size='lg'>
        Submit
      </RBtn>
    </RCard>
  );
}
```

### Styling with Variants

```typescript
// Use class-variance-authority for variants
import { cn } from '@/modules/app/libs/utils';
import { buttonVariants } from '@/modules/app/libs/ui-variants';

<button className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), className)}>
  Click me
</button>
```

---

## 🛠 CLI Tools

The CLI (`pnpm roketin`) provides module scaffolding.

### Create New Module

```bash
# Standard module
pnpm roketin module <module-name>

# Examples:
pnpm roketin module reporting
pnpm roketin module master-data/client    # Nested module (child route)
```

### Move Module

```bash
# Move to different location
pnpm roketin module:move <source> <destination>

# Examples:
pnpm roketin module:move master-data/client client         # Promote to top-level
pnpm roketin module:move client master-data/client         # Demote to child
```

### Info Command

```bash
pnpm roketin info    # Show available generators and configs
```

### What Gets Generated

- `components/pages/<feature>.tsx` - Page component
- `routes/<feature>.routes.tsx` - Route config
- `locales/<feature>.en.json` - Translation stub
- `services/<feature>.service.ts` - API service
- `types/<feature>.type.ts` - Type definitions
- `<feature>.config.ts` - Module config

---

## 🔄 Common Workflows

### 1. Creating a New Module

```bash
# 1. Generate module scaffold
pnpm roketin module billing

# 2. Update feature flag (auto-added, verify)
# Check feature-flags.config.ts

# 3. Add translations
# Edit src/modules/billing/locales/billing.en.json

# 4. Implement page and services
# Edit generated files
```

### 2. Adding a Child Module

```bash
# 1. Generate child module
pnpm roketin module config/payment    # Parent: config

# 2. The CLI will:
#    - Create src/modules/config/modules/payment/
#    - Set parentModuleId: 'config'
#    - Add child routes to parent route file
```

### 3. Creating a Base Component

1. Create file: `src/modules/app/components/base/r-{name}.tsx`
2. Follow naming: `R{Name}` component, `TR{Name}Props` type
3. Add tests: `src/modules/app/components/base/__tests__/{name}.test.tsx`
4. Add story: `src/modules/app/components/base/stories/{name}.stories.tsx`
5. Export from base index (if exists)

### 4. Adding API Service

```typescript
// src/modules/<module>/services/<module>.service.ts
import { createQuery, createMutation } from 'react-query-kit';
import { api } from '@/modules/app/libs/api';

export const useGetItems = createQuery({
  queryKey: ['items'],
  fetcher: () => api.get('/items'),
});

export const useCreateItem = createMutation({
  mutationFn: (data) => api.post('/items', data),
});
```

---

## 📏 Rules & Conventions

### File Naming

| Type       | Pattern                                   | Example                       |
| ---------- | ----------------------------------------- | ----------------------------- |
| Components | `kebab-case.tsx`                          | `user-form-dialog.tsx`        |
| Pages      | `<module>.tsx` or `<module>-<action>.tsx` | `user.tsx`, `user-detail.tsx` |
| Hooks      | `use-<name>.ts`                           | `use-auth.ts`                 |
| Stores     | `<name>.store.ts`                         | `auth.store.ts`               |
| Services   | `<name>.service.ts`                       | `user.service.ts`             |
| Types      | `<name>.type.ts`                          | `user.type.ts`                |
| Constants  | `<name>.constant.ts`                      | `permissions.constant.ts`     |
| Config     | `<module>.config.ts`                      | `dashboard.config.ts`         |

### Type Naming

- Use `T` prefix: `TUserData`, `TApiResponse`, `TRBtnProps`
- Variant types: `T{Component}VariantProps`

### Import Order

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal utilities
import { cn } from '@/modules/app/libs/utils';

// 4. Components
import { RBtn, RInput } from '@/modules/app/components/base';

// 5. Local imports
import { useMyHook } from '../hooks/use-my-hook';
```

### Commit Messages

Follow Conventional Commits (enforced by Commitlint):

```
feat(module): add new feature
fix(component): fix button styling
docs: update README
refactor(auth): simplify login flow
test(utils): add unit tests
chore: update dependencies
```

### Breadcrumbs

Routes can configure breadcrumbs via `handle`:

```typescript
{
  path: 'products/:id',
  element: <ProductDetail />,
  handle: {
    breadcrumb: (match) => ({
      type: 'product',
      id: match.params.id ?? '',
    }),
    breadcrumbOptions: {
      disabled: false,  // Keep visible but non-clickable
      hide: false,      // Remove from breadcrumb
    },
  },
}
```

### Page Config Override

```typescript
import { useOverridePageConfig } from '@/modules/app/hooks/use-page-config';

export default function MyPage() {
  useOverridePageConfig(({ params }) => ({
    title: 'myModule:pageTitle',
    breadcrumbs: [
      { label: 'Home', href: '/admin' },
      { label: 'My Module' },
    ],
    permissions: ['MY_MODULE_VIEW'],
    featureFlag: 'MY_MODULE',
  }));

  return <div>...</div>;
}
```

---

## 🔍 Important Libraries & Utilities

### Utils (`@/modules/app/libs/utils.ts`)

```typescript
import { cn } from '@/modules/app/libs/utils';

// Merge Tailwind classes
cn('px-4 py-2', isActive && 'bg-blue-500', className);
```

### Feature Flags (`@/modules/app/libs/feature-flag.ts`)

```typescript
import {
  isFeatureEnabled,
  useFeatureFlag,
} from '@/modules/app/libs/feature-flag';
```

### Route Utils (`@/modules/app/libs/routes-utils.ts`)

```typescript
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
```

### UI Variants (`@/modules/app/libs/ui-variants.ts`)

Contains CVA (class-variance-authority) variants for components.

---

## 🧪 Testing

### Test Setup

Tests use Vitest + React Testing Library. Setup files in `tests/`:

- `setup.ts` - Global test setup
- `setup-msw.ts` - MSW mock server bootstrap
- `test-utils.tsx` - Custom render utilities

### Running Tests

```bash
pnpm test               # Run all tests
pnpm test:ui            # Vitest UI mode
pnpm test:coverage      # Generate coverage report
```

### Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RBtn } from '@/modules/app/components/base/r-btn';

describe('RBtn', () => {
  it('renders correctly', () => {
    render(<RBtn>Click me</RBtn>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click', async () => {
    const onClick = vi.fn();
    render(<RBtn onClick={onClick}>Click</RBtn>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## 🔐 Auth Flow & Guards

### Auth Store (`auth.store.ts`)

Zustand store with cookie persistence for authentication:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { cookieStorage } from '@/modules/app/libs/cookie-storage';

type TAuthStore = {
  token: string;
  refreshToken: string;
  authData: TAuthProfile | null;
  isAuthenticated: () => boolean;
  setCredential: (token: string, refreshToken: string) => void;
  clearCredential: () => void;
  setAuthData: (data: TAuthProfile) => void;
};

const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        token: '',
        refreshToken: '',
        authData: null,

        isAuthenticated: () => !!get().token,

        setCredential(token, refreshToken) {
          set({ token, refreshToken });
        },

        clearCredential() {
          set({ token: '', refreshToken: '', authData: null });
        },

        setAuthData(data) {
          set({ authData: data });
        },
      }),
      {
        name: 'RSkeleton-session',
        storage: cookieStorage, // Uses encrypted cookies
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
        }),
      },
    ),
  ),
);
```

### Auth Service Pattern

```typescript
import { createMutation, createQuery } from 'react-query-kit';
import http from '@/plugins/axios';

// Query key for cache management
export const AUTH_PROFILE_QUERY_KEY = ['auth', 'profile'] as const;

// Fetch profile query
export const useAuthProfileQuery = createQuery<TAuthProfile, void, AxiosError>({
  queryKey: AUTH_PROFILE_QUERY_KEY,
  fetcher: async () => {
    const resp = await http.get<TApiResponse<TAuthProfile>>('/auth/me');
    return resp.data.data;
  },
});

// Login mutation with automatic token storage
export const useAuthLogin = () => {
  const queryClient = useQueryClient();
  const setCredential = useAuthStore((state) => state.setCredential);

  return createMutation({
    mutationFn: async (payload: TAuthLogin) => {
      const resp = await http.post('/auth/login', payload);
      return resp.data;
    },
    onSuccess: async (response) => {
      setCredential(response.data.access_token, response.data.refresh_token);

      // Refresh profile cache
      const profile = await queryClient.fetchQuery({
        queryKey: AUTH_PROFILE_QUERY_KEY,
        queryFn: fetchAuthProfile,
      });
      setAuthData(profile);
    },
  });
};
```

### Usage in Components

```typescript
// Check authentication
const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

// Get user data
const authData = useAuthStore((state) => state.authData);

// Logout
const clearCredential = useAuthStore((state) => state.clearCredential);
clearCredential();
```

---

## 🌐 API Service Patterns

### Axios Setup (`src/plugins/axios/index.ts`)

The axios instance includes:

- **Auto auth headers**: Adds `Bearer` token to requests
- **Language param**: Adds `lang` param from localStorage
- **401 handling**: Auto refresh token on 401
- **Global error toasts**: Shows error notifications

```typescript
import axios from 'axios';
import useAuthStore from '@/modules/auth/stores/auth.store';
import { showToast } from '@/modules/app/libs/toast-utils';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor - adds auth header
http.interceptors.request.use(async (config) => {
  const authStore = useAuthStore.getState();

  if (authStore.isAuthenticated?.()) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

// Response interceptor - handles 401 and errors
http.interceptors.response.use(undefined, async (error) => {
  // Auto refresh token on 401
  if (response?.status === 401 && !originalRequest._retry) {
    const resp = await http.post('/auth/refresh-token');
    authStore.setCredential(
      resp.data.data.access_token,
      resp.data.data.refresh_token,
    );
    return axios(originalRequest);
  }

  // Show error toast
  showToast.error({ title: 'Error', description: error.message });

  return Promise.reject(error);
});
```

### Creating API Services with react-query-kit

```typescript
// src/modules/<module>/services/<module>.service.ts
import {
  createQuery,
  createMutation,
  createInfiniteQuery,
} from 'react-query-kit';
import type {
  TApiResponse,
  TApiResponsePaginate,
} from '@/modules/app/types/api.type';
import http from '@/plugins/axios';

// Basic query
export const useGetItems = createQuery<TApiResponse<TItem[]>, TQueryParams>({
  queryKey: ['items'],
  fetcher: async (params, { signal }) => {
    const resp = await http.get('/items', { params, signal });
    return resp.data;
  },
});

// Paginated query
export const useGetItemsPaginated = createQuery<
  TApiResponsePaginate<TItem>,
  TQueryParams
>({
  queryKey: ['items', 'paginated'],
  fetcher: async (params, { signal }) => {
    const resp = await http.get('/items', { params, signal });
    return resp.data;
  },
});

// Infinite scroll query
export const useGetItemsInfinite = createInfiniteQuery<
  TApiResponsePaginate<TItem>,
  TQueryParams
>({
  queryKey: ['items', 'infinite'],
  initialPageParam: 1,
  fetcher: async (params, { pageParam = 1, signal }) => {
    const resp = await http.get('/items', {
      params: { ...params, page: pageParam },
      signal,
    });
    return resp.data;
  },
  getNextPageParam: (lastPage) => {
    const { current_page, last_page } = lastPage.meta;
    return current_page < last_page ? current_page + 1 : undefined;
  },
});

// Mutations
export const useCreateItem = createMutation<
  TApiResponse<TItem>,
  TCreateItemPayload
>({
  mutationFn: async (payload) => {
    const resp = await http.post('/items', payload);
    return resp.data;
  },
});

export const useUpdateItem = createMutation<
  TApiResponse<TItem>,
  { id: string; data: TUpdatePayload }
>({
  mutationFn: async ({ id, data }) => {
    const resp = await http.put(`/items/${id}`, data);
    return resp.data;
  },
});

export const useDeleteItem = createMutation<TApiResponse<void>, string>({
  mutationFn: async (id) => {
    const resp = await http.delete(`/items/${id}`);
    return resp.data;
  },
});
```

### API Response Types

```typescript
// src/modules/app/types/api.type.ts
export type TApiResponse<T> = {
  status: 'success' | 'error';
  message: string;
  data: T;
};

export type TApiResponsePaginate<T> = TApiResponse<T[]> & {
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type TApiDefaultQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
};
```

---

## 📝 Form & Validation Patterns

### Form Setup with React Hook Form + Yup

```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RForm, RFormField, RInput, RBtn } from '@/modules/app/components/base';

// 1. Define schema
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[0-9]/, 'Must contain number')
    .required(),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required(),
});

type TUserFormData = yup.InferType<typeof userSchema>;

// 2. Create form component
export function UserForm({ onSubmit }: { onSubmit: (data: TUserFormData) => void }) {
  const form = useForm<TUserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  return (
    <RForm form={form} onSubmit={onSubmit}>
      <RFormField
        control={form.control}
        name="name"
        label="Name"
        required
        render={({ field }) => <RInput {...field} placeholder="Enter name" />}
      />

      <RFormField
        control={form.control}
        name="email"
        label="Email"
        required
        render={({ field }) => <RInput {...field} type="email" />}
      />

      <RFormField
        control={form.control}
        name="password"
        label="Password"
        required
        render={({ field }) => <RInput {...field} type="password" />}
      />

      <RBtn type="submit" loading={form.formState.isSubmitting}>
        Submit
      </RBtn>
    </RForm>
  );
}
```

### Common Validation Patterns

```typescript
import * as yup from 'yup';

// Reusable validators
const validators = {
  email: yup.string().email('Invalid email').required('Email is required'),

  password: yup
    .string()
    .min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase')
    .matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number')
    .matches(/[@$!%*?&]/, 'Must contain special character')
    .required(),

  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number')
    .min(10, 'Min 10 digits'),

  url: yup.string().url('Invalid URL'),

  date: yup.date().nullable().typeError('Invalid date'),

  file: yup.mixed().test('fileSize', 'File too large', (value) => {
    if (!value) return true;
    return (value as File).size <= 5 * 1024 * 1024; // 5MB
  }),
};

// Conditional validation
const conditionalSchema = yup.object({
  hasCompany: yup.boolean(),
  companyName: yup.string().when('hasCompany', {
    is: true,
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.nullable(),
  }),
});
```

### i18n Validation Messages

```typescript
// Use translation keys in validation
import { t } from 'i18next';

const schema = yup.object({
  email: yup
    .string()
    .email(t('validation:invalidEmail', { label: 'Email' }))
    .required(t('validation:required', { label: 'Email' })),
});
```

---

## 🗄️ State Management (Zustand)

### Basic Store Pattern

```typescript
// src/modules/<module>/stores/<name>.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type TExampleStore = {
  items: TItem[];
  isLoading: boolean;
  selectedItem: TItem | null;

  // Actions
  setItems: (items: TItem[]) => void;
  setLoading: (loading: boolean) => void;
  selectItem: (item: TItem | null) => void;
  addItem: (item: TItem) => void;
  removeItem: (id: string) => void;
};

export const useExampleStore = create<TExampleStore>()(
  devtools(
    (set) => ({
      items: [],
      isLoading: false,
      selectedItem: null,

      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
      selectItem: (selectedItem) => set({ selectedItem }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    { name: 'example-store', enabled: import.meta.env.DEV },
  ),
);
```

### Store with Persistence

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export const useSettingsStore = create<TSettingsStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarCollapsed: false,

        setTheme: (theme) => set({ theme }),
        toggleSidebar: () =>
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),
      }),
      {
        name: 'app-settings', // localStorage key
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      },
    ),
  ),
);
```

### Using Immer for Complex Updates

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useCartStore = create<TCartStore>()(
  immer((set) => ({
    items: [],

    addToCart: (item) =>
      set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
      }),

    updateQuantity: (id, quantity) =>
      set((state) => {
        const item = state.items.find((i) => i.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }),
  })),
);
```

---

## 🌍 i18n Structure

### Locale File Structure

```
src/modules/
├── app/
│   └── locales/
│       ├── app.en.json          # App-wide translations
│       ├── app.id.json
│       ├── validation.en.json   # Validation messages
│       └── validation.id.json
├── auth/
│   └── locales/
│       ├── auth.en.json         # Auth module translations
│       └── auth.id.json
└── <module>/
    └── locales/
        ├── <module>.en.json
        └── <module>.id.json
```

### Locale File Format

```json
// src/modules/user/locales/user.en.json
{
  "title": "User Management",
  "menu": {
    "list": "User List",
    "create": "Create User"
  },
  "form": {
    "name": "Name",
    "email": "Email",
    "role": "Role"
  },
  "actions": {
    "create": "Create User",
    "edit": "Edit User",
    "delete": "Delete User"
  },
  "messages": {
    "created": "User created successfully",
    "updated": "User updated successfully",
    "deleted": "User deleted successfully"
  }
}
```

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

function UserPage() {
  // Load namespace
  const { t } = useTranslation('user');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('menu.list')}</p>

      {/* With interpolation */}
      <p>{t('messages.created', { name: 'John' })}</p>

      {/* Pluralization */}
      <p>{t('items_count', { count: 5 })}</p>
    </div>
  );
}

// Multiple namespaces
const { t } = useTranslation(['user', 'app']);
t('user:title');
t('app:submit');
```

### Validation Translations

```json
// src/modules/app/locales/validation.en.json
{
  "required": "{{label}} is required",
  "minLength": "{{label}} must be at least {{min}} characters",
  "invalidEmail": "{{label}} is not a valid email",
  "passwordMatch": "Passwords must match"
}
```

```typescript
// Usage in Yup schema
import { t } from 'i18next';

const schema = yup.object({
  email: yup
    .string()
    .required(t('validation:required', { label: t('user:form.email') })),
});
```

### Adding New Language

1. **Add to config:**

   ```typescript
   // roketin.config.ts
   languages: {
     supported: [
       { code: 'en', label: 'English', isDefault: true },
       { code: 'id', label: 'Bahasa Indonesia' },
       { code: 'ja', label: '日本語' },  // New language
     ],
   }
   ```

2. **Create locale files:**

   ```bash
   # For each module
   touch src/modules/app/locales/app.ja.json
   touch src/modules/auth/locales/auth.ja.json
   # etc.
   ```

3. **Translate content** in the new `.ja.json` files

---

## 📚 Related Documentation

- [README.md](./README.md) - Full project documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [GIT-WORKFLOW-DEVELOPER.md](./GIT-WORKFLOW-DEVELOPER.md) - Developer git workflow
- [GIT-WORKFLOW-MAINTAINER.md](./GIT-WORKFLOW-MAINTAINER.md) - Maintainer git workflow
- [Component Spec](./src/modules/app/components/spec.md) - Component development guidelines
- [Adaptive Search README](./src/modules/adaptive-search/README.md) - Global search documentation

---

**Built with ❤️ by Roketin**
