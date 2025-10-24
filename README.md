<!-- markdownlint-disable MD014 MD026 MD033 MD041 -->

<h1 align="center">🚀 ReactJS Base Project</h1>

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
7. [Module Generator](#-module-generator)
8. [Project Structure](#-project-structure)
9. [Conventions & Tooling](#-conventions--tooling)

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

Environment variables live in `.env` (example values are committed). Update API endpoints or feature flags there as needed.

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
- Sidebar menu definitions in `src/modules/app/constants/sidebar-menu.constant.ts` include a `translationKey`. `AppSidebar` maps it through `t(translationKey)` at runtime, so every language must provide the corresponding `menu.*` translation.
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
```

### Workflow

1. **Greeting:** The CLI renders a Roketin banner with CFonts.
2. **Path Parsing:** It splits the provided path (e.g., `reporting/summary`) and builds the target directory. Nested segments are placed under a cascading `modules` folder (`src/modules/reporting/modules/summary/…`) so each feature can contain its own sub-modules.
3. **Generation Mode:** You choose between:
   - `Standard`: Generates pages, routes, locale stub, types, and services (the default set).
   - `All folders`: Scaffolds every supported artifact (hooks, contexts, stores, etc.).
   - `Custom`: Lets you pick specific file types via a checkbox prompt.
4. **Child Routes & Auto-Linking:** For nested paths, the CLI asks if the final segment should be treated as a child route. Child routes produce `.routes.child.tsx` files **and the generator automatically imports/spreads them inside the parent route file** (including grandparents, recursively). If you already customized the parent route structure, skim the resulting diff to confirm the insertion landed where you expect.
5. **Auto-Scaffold Parents:** When a parent route file is missing (e.g., you run `pnpm roketin module-child master-data/sales` before `master-data` exists), the CLI now creates a lightweight parent route scaffold so children can safely attach. Only the route container is generated—no placeholder page component—leaving you in control of actual page content.
6. **Idempotent Files:** Existing files are never overwritten unless you opted in at the overwrite prompt. Skipped items are logged for visibility.

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
- **Module Generation:** `pnpm roketin module <feature>/[sub-feature]` scaffolds new modules following project conventions.

Have fun building! Contributions and issues are welcome. 🎉
```
