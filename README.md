<!-- markdownlint-disable MD014 MD026 MD033 MD041 -->

<h1 align="center">🚀 React Base Project</h1>

<p align="center">
  <img src="https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg" alt="Roketin Banner" width="512px" />
</p>
<h3 align="center">💻 A Modern Dashboard Starter powered by React, Vite, and Roketin conventions.</h3>

---

## 📚 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Quick Start](#-quick-start)
4. [Available Scripts](#-available-scripts)
5. [Configuration](#-configuration)
6. [Localization & Sidebar Menus](#-localization--sidebar-menus)
7. [Feature Flags & Module Configs](#-feature-flags--module-configs)
8. [Module Generator](#-module-generator)
9. [Project Structure](#-project-structure)
10. [Conventions & Tooling](#-conventions--tooling)

---

## 🧭 Overview

This repository provides a batteries-included dashboard scaffold using the Roketin design system. It ships with authenticated layouts, reusable UI primitives, strict linting, and testing utilities so teams can focus on feature delivery instead of project setup.

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite 7
- **State & Data:** Zustand, React Query, Immer
- **Routing & Auth:** React Router v7, custom guards, permission helpers
- **UI & Styling:** shadcn/ui, Tailwind CSS (via `@tailwindcss/vite`), Lucide icons
- **Forms & Validation:** React Hook Form, Yup, reusable form primitives
- **Testing:** Vitest, @testing-library, MSW
- **Quality:** ESLint (strict config), Prettier, Husky hooks, lint-staged, Commitlint

---

## ⚡ Quick Start

> Requires **Node.js ≥ 18** and **pnpm ≥ 9**.

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Create a production build
pnpm build

# Run the test suite
pnpm test
```

Environment variables live in `.env` (example values are committed). Define new feature switches in `feature-flags.config.ts` and flip them per environment with `VITE_FEATURE_<FLAG>` in your `.env`.

---

## 📜 Available Scripts

| Command                | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `pnpm dev`             | Launches Vite dev server on port **5177**.                     |
| `pnpm build`           | Type-checks and bundles the app for production.                |
| `pnpm preview`         | Serves the production build locally.                           |
| `pnpm lint`            | Runs ESLint against the entire project.                        |
| `pnpm test`            | Executes unit/integration tests with Vitest.                   |
| `pnpm test:coverage`   | Generates coverage reports under `coverage/`.                  |
| `pnpm test:ui`         | Starts the Vitest UI runner.                                   |
| `pnpm commit`          | Interactive commit message helper (Commitlint prompt).         |
| `pnpm roketin`         | Custom CLI for scaffolding modules and associated files.       |
| `pnpm storybook`       | Runs Storybook on http://localhost:6006 for base components.   |
| `pnpm storybook:build` | Produces the static Storybook build under `storybook-static/`. |

---

## 🔧 Configuration

Application-level knobs reside in **`roketin.config.ts`**. Adjusting this file lets you rebrand, resize the sidebar, change filter persistence, switch admin prefixes, and more without touching component code.

| Section               | Keys                                                                                             | Purpose                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `app`                 | `name`, `shortName`, `tagline`                                                                   | Populates branding components such as `RBrand` and copy used around the shell.                                       |
| `sidebar.settings`    | `stateStorage.type`, `stateStorage.key`, `width`, `widthMobile`, `widthIcon`, `keyboardShortcut` | Persists sidebar open/close state, controls widths for desktop/mobile/icon modes, and binds the keyboard toggle key. |
| `filters.persistence` | `enabled`, `strategy`, `keyPrefix`, `debounceMs`                                                 | Configures how `RFilter` remembers selections (e.g., `local-storage`, custom key prefixes, debounce window).         |
| `routes.admin`        | `basePath`                                                                                       | Base path prepended to every authenticated route (default `/r-admin`).                                               |
| `languages`           | `enabled`, `debug`, `supported[]` (`code`, `label`, `isDefault`)                                 | Toggles multi-language support, i18n debug logging, and declares the supported locale list.                          |

### Config Breakdown

- **`app`**: Supplies the product name, short label, and tagline shown in default headers/footers. Perfect for rebranding a white-label deployment.
- **`sidebar.settings`**:
  - `stateStorage.type`: Where to persist open/closed state (`local-storage` by default).
  - `stateStorage.key`: Storage namespace so multiple apps can coexist on one domain.
  - `width`, `widthMobile`, `widthIcon`: CSS-ready values exposed as custom properties.
  - `keyboardShortcut`: Letter bound to `⌘/Ctrl + key` to toggle the sidebar.
- **`filters.persistence`**: Enable or disable persistence. Choose a storage `strategy`, optionally set a `keyPrefix`, and throttle writes with `debounceMs`.
- **`routes.admin`**: Change the admin prefix (e.g., `/app`) to relocate every nested feature route.
- **`languages`**:
  - `enabled`: Hides the language dropdown when set to `false`.
  - `debug`: Mirrors `i18next` debug mode; handy during localisation tweaks.
  - `supported`: Each locale entry must define a `code` (used by i18next), `label` (UI display), and optional `isDefault`.

---

## 🌐 Localization & Sidebar Menus

- Update `src/modules/app/locales/app.<lang>.json` when adding languages to `roketin.config.ts`.
- Each feature module owns its sidebar structure through `<feature>.config.ts`. The config exposes `menu` entries pointing to translation keys (e.g., `sampleForm:title`). `AppSidebar` aggregates every module config automatically, so translations just need to exist in the feature’s locale file. When a config sets `parentModuleId`, its menu is appended under the parent's menu tree (with strict inheritance—no parent, no child).
- Example locale snippet:

```json
{
  "menu": {
    "dashboard": "Dashboard",
    "sampleForm": "Sample Form"
  }
}
```

---

## 🧱 Feature Flags & Module Configs

- **Single source of truth:** All flag definitions live in [`feature-flags.config.ts`](feature-flags.config.ts). Use `defineFeatureFlags({
  MY_FEATURE: { env: 'VITE_FEATURE_MY_FEATURE', defaultEnabled: true },
})` to register a key, optional description, and default behaviour.
- **Environment toggles:** Set `VITE_FEATURE_<FLAG>` in `.env`, `.env.local`, or deployment secrets. Truthy values (`true`, `1`, `on`) enable the feature; falsy values disable it. Missing entries fall back to `defaultEnabled`.
- **Runtime helpers:** Import from `@/modules/app/libs/feature-flag`:
  - `isFeatureEnabled('SOME_FLAG')` for synchronous checks (menu generation, guards, data fetching).
  - `useFeatureFlag('SOME_FLAG')` hook for component rendering without duplicating logic.
- **Route guards:** Add `handle.featureFlag = 'SOME_FLAG'` (optionally `handle.featureFlagFallback`) in any route object to automatically short-circuit to `AppNotFound` when the flag is disabled—this happens before auth/permission guards run.
- **Module configs:** Every module exports `<module>.config.ts` with `defineModuleConfig({ moduleId, parentModuleId?, featureFlag, menu? })`. The loader `src/modules/app/libs/module-config.lib.ts` globs `@/modules/**/*.config.ts`, so **nested modules are supported out of the box** (`src/modules/billing/modules/invoice/invoice.config.ts`, etc.).
- **Sidebar menus:** `menu` entries live next to the module and can describe tree menus, icons, and permissions. Parent modules typically define the container menu (omit `name` to keep it non-clickable). Children inherit the parent automatically by declaring `parentModuleId`. You can omit the `menu` field or set it to `false` for child modules that shouldn't appear directly in the sidebar. Use `order` (lower first) to customize the ordering of menus at any level. `AppSidebar` consumes `APP_MODULE_CONFIGS`, nests children beneath their parent, and skips children whenever the parent is disabled.
- **CLI automation:** `pnpm roketin module ...` (standard preset) now scaffolds `<feature>.config.ts` and automatically appends the corresponding `VITE_FEATURE_<FLAG>` entry to `feature-flags.config.ts`. Review the stub (icon, permissions, translation namespace) and adjust to your needs before shipping.

Example config:

````ts
// src/modules/sample-form/sample-form.config.ts
import { defineModuleConfig } from '@/modules/app/types/module-config.type';

export const sampleFormModuleConfig = defineModuleConfig({
  moduleId: 'sample-form',
  // parentModuleId: 'billing', // Optional: attach under another module’s menu.
  featureFlag: 'SAMPLE_FORM',
  // menu: false, // Uncomment to skip sidebar entries (useful for child modules).
  menu: {
    title: 'sampleForm:title',
    name: 'SampleFormIndex',
    order: 10,
    // icon: SomeIcon,
    // permission: 'SAMPLE_FORM_VIEW',
  },
});

### Sidebar hierarchy example

```ts
// Parent module acts as a collapsible header (no `name` → non-clickable).
export const userModuleConfig = defineModuleConfig({
  moduleId: 'user',
  featureFlag: 'USER',
  menu: {
    title: 'user:title',
    icon: Users,
    order: 1,
  },
});

// Child module is rendered under the parent (strict: hidden when parent is disabled).
export const userGuardModuleConfig = defineModuleConfig({
  moduleId: 'user-guard',
  parentModuleId: 'user',
  featureFlag: 'USER_GUARD',
  menu: {
    title: 'user:menu.guard',
    name: 'UserGuardIndex',
  },
});
````

Notes:

- Children attach to the first menu entry defined by the parent config. Remove `name` on the parent menu to render it as a toggle-only container, or set `name` if the parent should be clickable too.
- When a parent’s feature flag is `false`, all children referencing that `parentModuleId` are hidden automatically (strict inheritance).
- Parents that act purely as containers (no `name`) disappear automatically when every child is filtered out (no orphan headers are shown).
- Use the optional `order` field to enforce deterministic ordering (lower values first, ties fall back to declaration order).
- CLI scaffolding: `pnpm roketin module user/guard` auto-populates `parentModuleId` and a child `menu` entry; tweak the title, icon, permissions, or order as needed.

````

## 🧩 Module Generator

The CLI backing `pnpm roketin` lives in **`bin/roketin.js`** and scaffolds feature modules under `src/modules`. It understands nested structures, child routes, and optional assets.

### Basic Usage

```bash
# Create a new feature module (e.g., src/modules/reporting)
pnpm roketin module reporting

# Create a nested module (prompts whether it should be treated as a child route)
pnpm roketin module reporting/summary

# Force explicit child route generation via the legacy alias
pnpm roketin module-child reporting/summary

# Inspect registered generators, presets, and restricted modules
pnpm roketin info
````

### Workflow

1. **Greeting:** The CLI renders a Roketin banner with CFonts.
2. **Path Parsing:** It splits the provided path (e.g., `reporting/summary`) and builds the target directory. Nested segments are placed under a cascading `modules` folder (`src/modules/reporting/modules/summary/…`) so each feature can contain its own sub-modules.
3. **Generation Mode:** You choose between:
   - `Standard`: Generates module config + feature flag entry, pages, routes, locale stub, types, and services (the default set).
   - `All folders`: Scaffolds every supported artifact (hooks, contexts, stores, etc.).
   - `Custom`: Lets you pick specific file types via a checkbox prompt.
4. **Child Routes & Auto-Linking:** For nested paths, the CLI asks if the final segment should be treated as a child route. Child routes produce `.routes.child.tsx` files **and the generator automatically imports/spreads them inside the parent route file** (including grandparents, recursively). If you already customized the parent route structure, skim the resulting diff to confirm the insertion landed where you expect.
5. **Auto-Scaffold Parents:** When a parent route/config is missing (e.g., you run `pnpm roketin module master-data/sales` before `master-data` exists), the CLI now creates both the lightweight parent route scaffold and the parent module config (complete with its own feature flag). Only minimal shells are generated—no placeholder page component—so you retain full control over the actual content and menu labels.
6. **Idempotent Files:** Existing files are never overwritten unless you opted in at the overwrite prompt. Skipped items are logged for visibility.
7. **Feature flags on autopilot:** Whenever the `config` generator runs, the CLI adds (or reuses) a `VITE_FEATURE_<FLAG>` entry in `feature-flags.config.ts` so toggling a module is as simple as flipping the env value.

### Generated Artifacts

Depending on your selections, the generator can produce:

- `components/pages/<feature>.tsx` – Page skeleton.
- `routes/<feature>.routes(.child).tsx` – Route config using `createAppRoutes`.
- `locales/<feature>.en.json` – Locale stub for feature-specific translations.
- `services/<feature>.service.ts` – API placeholder.
- `types/<feature>.type.ts` – Type definitions scaffold.
- Optional extras: hooks, contexts, stores, libs, constants, etc.

All generated route containers ship with a `handle.breadcrumbOptions.disabled` flag. This keeps parent breadcrumbs (e.g., “Master Data”) displayed but non-clickable until you intentionally enable navigation for them.

---

## 🍞 Breadcrumbs

Routes can drive breadcrumbs through the `handle` property, and components can register dynamic labels with a lightweight hook.

### Route configuration

```tsx
export const productsRoutes = createAppRoutes([
  {
    path: 'products/:sku',
    element: <ProductDetail />,
    handle: {
      breadcrumb: (match) => ({
        type: 'product',
        id: match.params.sku ?? '',
      }),
      breadcrumbOptions: {
        disabled: false,
        hide: false,
      },
    },
  },
]);
```

- `breadcrumb` accepts either a translation key/string or a function returning `{ type, id }` for resolver-based labels.
- `breadcrumbOptions.disabled` keeps the crumb visible but non-clickable.
- `breadcrumbOptions.hide` removes the crumb entirely.

### Component resolver hook

```tsx
import { useBreadcrumbLabel } from '@/modules/app/hooks/use-breadcrumb-resolver';

export default function ProductDetail({ sku }: { sku: string }) {
  useBreadcrumbLabel('product', (id) => productCache[id]?.name ?? id);

  return <ProductDetailView sku={sku} />;
}
```

`useBreadcrumbLabel(type, resolver)` registers the resolver while the component is mounted and cleans it up automatically. Call `useResetBreadcrumbResolvers()` when leaving a flow that should clear every resolver.

### Optional per-page overrides

Routes remain the primary source of truth, but sometimes a page needs extra context (dynamic breadcrumbs, title overrides, or even feature guards). The optional `useOverridePageConfig` hook lets you inject those hints straight from the page component:

```tsx
import { useOverridePageConfig } from '@/modules/app/hooks/use-page-config';

export default function SampleFormPage() {
  useOverridePageConfig(({ params }) => ({
    title: params?.id ? 'sampleForm:actions.edit' : 'sampleForm:menu.createNew',
    breadcrumbs: [
      { label: 'sampleForm:title', href: '/admin/sample-form' },
      {
        label: params?.id
          ? 'sampleForm:actions.edit'
          : 'sampleForm:menu.createNew',
      },
    ],
    permissions: ['SAMPLE_FORM_VIEW'],
    featureFlag: 'SAMPLE_FORM',
  }));

  return <div>...</div>;
}
```

- The hook is **optional**: if you skip it, the layout falls back to the route handles defined in `*.routes.tsx`.
- Returning `permissions` or `featureFlag` automatically renders `AppForbidden` / `AppNotFound` when access is denied, so sensitive pages stay guarded even without duplicating route metadata.
- Breadcrumbs accept arrays or `(ctx) => []`, and they’re merged into the global breadcrumb component for a consistent UX.

---

## 📁 Foldering Approaches

Two structures are supported; pick the one that fits your team’s workflow.

### 1. Hierarchical modules (recommended)

```
src/modules/
└── config/
    ├── config.config.ts
    ├── routes/config.routes.tsx
    └── modules/
        └── user/
            ├── user.config.ts
            ├── routes/user.routes.child.tsx
            └── components/pages/user.tsx
```

- Every level mirrors the eventual route segment (`config → user → detail`), so React Router automatically nests segments and `RBreadcrumbs` can infer a fallback trail directly from the URL when neither the route handle nor `useOverridePageConfig` overrides exist.
- `moduleId`/`parentModuleId` match the folder hierarchy, so sidebar ordering is deterministic and global feature-flag inheritance (parent off → children hidden) works without extra bookkeeping.
- New pages only need to live inside the relevant module folder: the glob loader picks up `*.routes.tsx`, and breadcrumbs/title fallbacks already align with the directory structure.

### 2. Flat modules with manual overrides

```
src/modules/
├── config/
├── user/
└── role/
```

- Keep modules top-level but express nesting through `defineModuleConfig`:

```ts
// src/modules/user/user.config.ts
export default defineModuleConfig({
  moduleId: 'config-user',
  parentModuleId: 'config',
  menu: {
    title: 'user:title',
    name: 'UserIndex',
    order: 20,
  },
});
```

- Because the file system no longer mirrors URL depth, add explicit breadcrumbs either via the route `handle` or, for richer/dynamic needs, `useOverridePageConfig`. This ensures `RBreadcrumbs` renders the intended hierarchy even though the folders are flat.

```tsx
// src/modules/user/components/pages/user-detail.tsx
import { useOverridePageConfig } from '@/modules/app/hooks/use-page-config';

export default function UserDetailPage() {
  useOverridePageConfig(({ params }) => ({
    breadcrumbs: [
      { label: 'Config', href: '/admin/config' },
      { label: 'user:title', href: '/admin/config/user' },
      { label: params?.id ?? 'Detail' },
    ],
  }));

  return <div>...</div>;
}
```

Module configs still drive the menus (parent/child relationships + `order` control). Breadcrumbs are stitched together via the snippets above so even though folders are flat, the UI shows the desired nesting.

- Menus are still ordered via the `order` field inside each config, so you can rearrange siblings without touching the folder tree.

Both approaches can coexist: legacy modules can stay flat while newer ones adopt the hierarchical layout for auto-generated breadcrumbs.

---

## 🗂 Project Structure

```
reactjs-base-project/
├── roketin.config.ts          # Central app/theme/sidebar configuration
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts             # Vite + Vitest configuration
├── tsconfig.json              # Root TS config (references app/node configs)
├── .husky/                    # Git hooks (Commitlint, lint-staged)
├── bin/
│   └── roketin.js             # Module generator CLI
├── public/                    # Static assets served by Vite
├── dist/                      # Build output (generated)
├── coverage/                  # Test coverage reports (generated)
├── tests/
│   ├── setup.ts               # Vitest setup
│   ├── setup-msw.ts           # MSW server bootstrap
│   └── unit/                  # Example unit tests
└── src/
    ├── main.tsx               # App entry point
    ├── vite-env.d.ts
    ├── @types/                # Project-level TypeScript declarations
    ├── plugins/               # Custom Vite plugins (e.g., i18n type generator)
    └── modules/
        ├── app/               # App shell, layouts, shared libs, locales
        ├── auth/              # Authentication routes and layouts
        ├── dashboard/         # Example dashboard module
        └── sample-form/       # Rich form examples and reusable widgets

> `modules/[feature]` breakdown

- `assets/`         # [Only app folder] static assets scoped to the shell (e.g., global CSS).
- `components/`
  - `base/`         # [Only app folder] reusable atoms/molecules prefixed with `r-` (`r-form.tsx`, `r-filter.tsx`, etc.).
  - `layouts/`      # top-level layout pieces (`app-layout.tsx`, `app-sidebar.tsx`).
  - `pages/`        # entry-point screens for the shell (`app-entry-point.tsx`, error states).
  - `ui/`           # [Only app folder] shadcn-based primitives shared across modules; variant tokens live under `ui/variants/`.
- `constants/`      # shared constants and enums (permissions, menus) using kebab-case filenames.
- `contexts/`       # React contexts; filename convention: `<feature>-context.ts`.
- `hooks/`          # custom hooks (`use-*.ts/x`), camel-cased after `use`.
- `libs/`           # utility functions (storage, crypto, routing) using kebab-case names.
- `locales/`        # i18n resources (`app.<lang>.json`, validation bundles).
- `routes/`         # shell route aggregator (`app.routes.tsx`).
- `stores/`         # Zustand stores (`*.store.ts` suffix).
- `types/`          # shared TypeScript definitions (`*.type.ts` suffix).
- `validators/`     # schema or validation helpers (`*.validator.ts`).


> Directories such as `dist/`, `coverage/`, and `node_modules/` are generated and can be cleaned safely.

---

## ✅ Conventions & Tooling

- **Linting:** ESLint with strict TypeScript rules and hook validation.
- **Formatting:** Prettier runs automatically via Husky and lint-staged on staged files.
- **Commits:** Commitlint enforces Conventional Commit messages; use `pnpm commit` for an interactive flow.
- **Testing:** Vitest mimics Jest APIs, with MSW mocking network calls. Tests bootstrap via `tests/setup.ts`.
- **Module Generation:** `pnpm roketin module <feature>/[sub-feature]` scaffolds new modules following project conventions (config, feature flags, hierarchy-aware menus).

Have fun building! Contributions and issues are welcome. 🎉
```
