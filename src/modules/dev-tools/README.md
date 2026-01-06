# Dev Tools Module

Development utilities for form filling, grid overlay, and debugging. Only active in development mode (`import.meta.env.DEV`).

## Features

- **Floating Toolbar**: Nuxt-style floating button that expands into toolbar
- **Form Auto-Fill**: Generate fake data for forms using Faker.js (DEV only)
- **Grid Overlay**: Visual grid for layout debugging
- **Breakpoint Display**: Shows current responsive breakpoint
- **Routes Panel**: View all app routes in tree structure
- **Locales Panel**: View and compare translation keys

## Installation

### Automatic Installation

Run the install script from the project root:

```bash
chmod +x src/modules/dev-tools/install.sh
./src/modules/dev-tools/install.sh
```

### Manual Installation

1. Install the required dependency:

```bash
pnpm add -D @faker-js/faker
# or
yarn add -D @faker-js/faker
# or
npm install -D @faker-js/faker
```

2. Add DevToolsProvider and DevToolbar to your main layout:

```tsx
// src/modules/app/components/layouts/app-layout.tsx
import { DevToolsProvider, DevToolbar } from '@/modules/dev-tools';

export default function AppLayout() {
  return (
    <DevToolsProvider>
      {/* Your layout content */}
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
      <DevToolbar />
    </DevToolsProvider>
  );
}
```

## Uninstallation

### Automatic Uninstallation

Run the uninstall script from the project root:

```bash
chmod +x src/modules/dev-tools/uninstall.sh
./src/modules/dev-tools/uninstall.sh
```

### Manual Uninstallation

1. Remove the dependency:

```bash
pnpm remove @faker-js/faker
# or
yarn remove @faker-js/faker
# or
npm uninstall @faker-js/faker
```

2. Remove imports and components from your layout:

```tsx
// Remove these lines from app-layout.tsx
import { DevToolsProvider, DevToolbar } from '@/modules/dev-tools';

// Remove <DevToolsProvider> wrapper and <DevToolbar /> component
```

3. Remove `useDevFormRegistry` calls from all forms:

```tsx
// Remove these lines from form components
import { useDevFormRegistry } from '@/modules/dev-tools';

// Remove the hook call
useDevFormRegistry({ name: 'form-name', form });
```

4. Delete the dev-tools module directory:

```bash
rm -rf src/modules/dev-tools
```

## Quick Start

### 1. Create Faker Config File (Auto-Discovery)

Create a `*.faker.ts` file in `src/modules/dev-tools/faker-configs/`:

```typescript
// src/modules/dev-tools/faker-configs/client-form.faker.ts
import { faker } from '@faker-js/faker';
import type { TFakerConfig } from '../utils/fake-data-generator';

export const fakerConfig: TFakerConfig = {
  // Functions - called on each "Fill" click for fresh data
  email: () => faker.internet.email(),
  name: () => faker.company.name(),
  phone: () => faker.phone.number(),
  npwp: () => faker.string.numeric(15),
  password: () => faker.internet.password(),
  address: () => faker.location.streetAddress({ useFullAddress: true }),

  // Arrays
  contacts: () => [faker.phone.number(), faker.phone.number()],

  // Special types
  avatar: 'image', // Auto-generates dummy image
  role_id: 'skip', // Skip - handle via onFill for remote selects
};
```

**Important**: The filename must match the form name. For `client-form`, create `client-form.faker.ts`.

### 2. Register Form

```typescript
// client-form.tsx
import { useDevFormRegistry } from '@/modules/dev-tools';

const MyForm = () => {
  const form = useForm<TMyFormSchema>();

  // Register form - faker config auto-discovered by form name
  useDevFormRegistry({
    name: 'client-form', // Must match faker config filename
    form,
  });

  return <form>...</form>;
};
```

### 3. Handle Remote Select Fields (Optional)

For fields that need API calls:

```typescript
useDevFormRegistry({
  name: 'client-form',
  form,
  onFill: async (form) => {
    // Fetch and set remote select values
    const roles = await fetchRoles({ limit: 1 });
    form.setValue('role_id', roles[0]?.id);
  },
});
```

## Important: Bundle Size

**Faker.js is ~400KB+** and is NOT bundled in production.

The faker configs are:

1. Located in `src/modules/dev-tools/faker-configs/`
2. Auto-discovered using `import.meta.glob`
3. Lazy-loaded only when "Fill" is clicked
4. Completely tree-shaken in production builds

## Faker Config Options

| Value         | Description                    | Example                                |
| ------------- | ------------------------------ | -------------------------------------- |
| `() => value` | Function returning fake value  | `() => faker.internet.email()`         |
| `'image'`     | Auto-generate dummy image file | For file upload fields                 |
| `'skip'`      | Skip this field                | For remote selects, conditional fields |

## API Reference

### useDevFormRegistry

```typescript
useDevFormRegistry<T>({
  name: string;              // Unique form identifier (matches faker config filename)
  form: UseFormReturn<T>;    // React Hook Form instance
  fakerConfig?: TFakerConfig; // Optional manual faker config
  testData?: Partial<T>;     // Manual test data (fallback)
  imageFields?: TImageField[]; // Manual image field config
  onFill?: (form) => void;   // Custom fill handler for complex fields
});
```

### useDevTools

Access dev tools context directly:

```typescript
const {
  activeFormName,
  fillActiveForm,
  clearActiveForm,
  showGrid,
  toggleGrid,
} = useDevTools();
```

## Toolbar Features

The floating toolbar (bottom-right corner) provides:

- **Theme Toggle**: Switch between light/dark/system
- **Locale Toggle**: Switch between languages
- **Grid**: Toggle grid overlay
- **Routes**: View all app routes in tree structure
- **Locales**: View and compare translation keys
- **Form Fill/Clear**: When a form is registered

## File Structure

```
src/modules/dev-tools/
├── faker-configs/           # Faker configs (auto-discovered)
│   ├── index.ts             # Auto-discovery loader
│   └── client-form.faker.ts # Example faker config
├── components/
│   └── dev-toolbar.tsx      # Floating toolbar
├── contexts/
│   ├── dev-tools.context.ts
│   └── dev-tools-provider.tsx
├── hooks/
│   ├── use-dev-tools.ts
│   └── use-breakpoint.ts
├── utils/
│   └── fake-data-generator.ts
├── install.sh               # Installation script
├── uninstall.sh             # Uninstallation script
└── README.md
```

## Notes

- The module is completely tree-shaken in production builds
- All faker-related code is excluded from production bundles
- The floating toolbar only renders when `import.meta.env.DEV` is true
