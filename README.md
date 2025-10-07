<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD026 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<h1 align="center">
  🚀 ReactJS Base Project
</h1>

<!-- Banner Section -->
<p align="center">
  <img src="https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg" alt="Roketin Banner" width="512px" />
</p>
<h3 align="center">
  💻 A Modern Base Project Dashboard with React.js!
</h3>

---

<!-- Badges Section -->
<p align="center">
  <br>
  <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" alt="Made with TypeScript" />
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="Built with Love" />
  <br>
</p>

---

<br />
<p align="center">
 <a href="https://sonarcloud.io/summary/new_code?id=gmatthewsfeuer_next-plate">
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=bugs" alt="Bugs" title="Bugs" />
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=sqale_rating" alt="Maintainability Rating" title="Maintainability Rating" />
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=alert_status" alt="Quality Gate Status" title="Quality Gate Status" />
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=reliability_rating" alt="Reliability Rating" title="Reliability Rating" />
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=security_rating" alt="Security Rating" title="Security Rating" />
   <img src="https://sonarcloud.io/api/project_badges/measure?project=gmatthewsfeuer_next-plate&metric=vulnerabilities" alt="Vulnerabilities" title="Vulnerabilities" />
 </a>
</p>

---

<!-- Introduction Section -->

## 📖 Introduction

This template have a bunch of folders, code examples and configurations.

<!-- Features Section -->

## 🌟 Features

This base project features all the latest tools and good practices in web development!

### Framework

- ⚛️ **[React.js](https://react.dev/)** – An open-source JavaScript library for building user interfaces (UIs), particularly single-page applications. One of the best

### Data Fetching

- ✳️ **[React Query](https://tanstack.com/query)** – Hooks for fetching, caching and updating asynchronous data in React

### State Management and Hooks

- 🐻 **[Zustand](https://zustand-demo.pmnd.rs)** – A small, fast and scalable bearbones state-management solution using simplified flux principles

### Design System and Animations

- 🎨 **[Shadcn](https://ui.shadcn.com/)** – A set of beautifully designed components that you can customize, extend, and build on.
- ✨ **[Lucide Icons](https://lucide.dev/)** – A collection of popular icons to React projects

### Form Validation

- 📋 **[React Hook Form](https://react-hook-form.com)** – Performant, flexible and extensible forms with easy-to-use validation
- 🚨 **[Yup](https://github.com/jquense/yup)** – Schema builder that concise yet expressive schema interface, equipped to model simple to complex data models

### Tests

- ✨ **[Vitest](https://vitest.dev/)** – A Vite-native testing framework. Next Generation Testing Framework

### Design Patterns

- ⛔ **[ESLint](https://eslint.org)** – Find and fix problems in your JavaScript code
- 🎀 **[Prettier](https://prettier.io)** – An opinionated code formatter, supporting multiple languages and code editors
- 🐺 **[Husky](https://github.com/typicode/husky)** – Modern native Git hooks made easy
- 💩 **[lint-staged](https://github.com/okonet/lint-staged)** – Run linters against staged git files and don't let 💩 slip into your code base
- 📓 **[commitlint](https://commitlint.js.org)** – Helps your team adhering to a commit convention
- 🏷️ **[Standard Version](https://github.com/conventional-changelog/standard-version)** – A utility for versioning using semver and CHANGELOG generation powered by Conventional Commits

### ⚙️ Extra Configurations

<details>
 <summary>Using Compiler</summary>

 <h4>How to Activate</h4>

Put the `babel.config.js` file (located in the path `src/scripts`) in the project root and delete `.babelrc` file.

Uncomment the `wdyr` import line on `pages/_app.tsx`.

That's it! Now you can monitore React re-renders!

 <h4>How to Uninstall</h4>

Just delete the `babel.config.js` and `wdyr.ts` files, remove `wdyr` import line on `pages/_app.tsx` and uninstall it:

```bash
# PNPM
$ pnpm uninstall @welldone-software/why-did-you-render
# NPM
$ npm uninstall @welldone-software/why-did-you-render
# Yarn
$ yarn remove @welldone-software/why-did-you-render
```

</details>

<!-- File Tree Section -->

## 📁 File Tree

See below the file tree to understand the project structure.

<details>
 <summary>View file tree</summary>

> Folders and files marked with (`**`) are optional, so you can delete then.

```txt
📂 reactjs-base-project/
┣ 📂 .husky/                              # Husky's folder
┃ ┣ 📃 commit-msg                         # Commitlint git hook
┃ ┗ 📃 pre-commit                         # Lint-staged git hook
┣ 📂 .vscode/                             # VSCode's workspace **
┣ 📂 public/                              # Public folder
┃ ┣ 📃 favicon.ico                        # Icon tab browser
┣ 📂 src/
┃ ┣ 📂 modules/
┃ ┃ ┣ 📂 [module name, ex: user]
┃ ┃ ┃ ┗ 📂 [sub module name, ex: add user]
┃ ┃ ┃   ┣ 📂 components
┃ ┃ ┃   ┃ ┣  📂 layouts
┃ ┃ ┃   ┃ ┗  📂 pages
┃ ┃ ┃   ┣ 📂 services
┃ ┃ ┃   ┣ 📂 hooks
┃ ┃ ┃   ┣ 📂 routes
┃ ┃ ┃   ┣ 📂 stores
┃ ┃ ┃   ┗ 📂 types
┃ ┣ 📂 plugins/                            # Plugins
┃ ┃ ┣ 📂 axios                             # Axios config
┃ ┃ ┗ 📂 yup                               # Yup config
┃ ┣ 📃 main.tsx                            # Main file
┃ ┗ 📃 vite.env.d.ts
┣ 📃 .gitignore                            # Git ignore
┣ 📃 .prettierignore                       # Prettier ignore
┣ 📃 .prettierrc                           # Prettier config
┣ 📃 commitlint.config.cjs                 # Commit lint config
┣ 📃 components.json                       # React component config
┣ 📃 eslint.config.js                      # Eslint config
┣ 📃 index.html                            # Index html
┣ 📃 package.json                          # Package json
┣ 📃 pnpm.lock.yaml                        # Package lock
┣ 📃 tsconfig.app.json                     # Typescript config for frontend app
┣ 📃 tsconfig.json                         # TypeScript config wrapper
┣ 📃 tsconfig.node.json                    # TypeScript config for node
┣ 📃 README.md                             # Main README
┣ 📃 vite.config.js                        # Vite config
```

</details>

## 🧭 Routing, Breadcrumbs & Permissions

This project ships with an opinionated setup around routing and navigation so you can focus on feature work. The sections below cover how to plug new modules into the router, expose breadcrumbs, and guard routes with permissions.

### Routing Overview

- Route definitions live in `src/modules/<feature>/routes/*.routes.tsx`.
- Export an array via `createAppRoutes([...])` (the helper currently returns the same array but keeps the API consistent).
- Files ending with `.routes.tsx` are auto-discovered by `app.routes.tsx`, merged, and mounted under `/admin` when the `path` is relative (no leading `/`). Supplying an absolute path (e.g. `'/auth'`) keeps the route at the root level.
- Use the optional `name` field on a route so that `useNamedRoute()` and `RNavigate` can resolve URLs by name.

```tsx
// src/modules/sample-form/routes/sample-form.routes.tsx
export const sampleFormRoutes = createAppRoutes([
  {
    path: 'sample-form',
    element: <Outlet />,
    handle: {
      breadcrumb: 'Sample Form',
      permissions: [PERMISSIONS.SAMPLE_FORM_VIEW],
    },
    children: [
      { name: 'SampleFormIndex', index: true, element: <SampleForm /> },
      { name: 'SampleFormAdd', path: 'add', element: <SampleFormSave /> },
    ],
  },
]);
```

### Breadcrumbs

- `AppLayout` renders `<RBreadcrumbs />`, which inspects the active route `handle.breadcrumb` values coming from `useMatches()`.
- `handle.breadcrumb` accepts either a static string or a function. The function receives `{ params, data, pathname }` from the matched route.
- For dynamic labels, return an object with `{ type, id }`. Register a resolver for that `type` through the breadcrumb store.

```tsx
// Route definition
handle: {
  breadcrumb: ({ params }) => ({ type: 'user', id: params.id ?? '' }),
}

// Component example
const { register, unregister } = useBreadcrumbStore();
useEffect(() => {
  register('user', (id) => userDetail?.name ?? `User ${id}`);
  return () => unregister('user');
}, [register, unregister, userDetail]);
```

#### Example: Replacing Breadcrumb Text from a Page

Use the breadcrumb store inside a page (or layout) to substitute the breadcrumb label with context-specific text such as an entity name fetched from the server.

```tsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBreadcrumbStore } from '@/modules/app/stores/breadcrumbs.store';
import { useGetUserDetail } from '@/modules/users/services/user.service';

export default function UserDetailPage() {
  const { id = '' } = useParams();
  const { data } = useGetUserDetail(id);

  const register = useBreadcrumbStore((state) => state.register);
  const unregister = useBreadcrumbStore((state) => state.unregister);

  useEffect(() => {
    register('user', () => data?.name ?? `User ${id}`);
    return () => unregister('user');
  }, [data?.name, id, register, unregister]);

  return <UserDetailContent user={data} />;
}
```

With this setup, any route whose `handle.breadcrumb` resolves to `{ type: 'user', id }` automatically displays the name returned by the resolver instead of the static fallback.

### Permissions & Guards

- Declare permissions in `src/modules/app/constants/permission.constant.ts` and reuse the exported `PERMISSIONS`.
- Attaching `handle.permissions` (or `handle.isRequiredAuth`) to a route triggers `AuthProtectedRoute`, which checks login status via `useAuth()` and validates the current user’s permissions.
- Unauthorized access renders `AppForbidden`, while unauthenticated users are redirected to the login page via `RNavigate`.

```tsx
handle: {
  permissions: [PERMISSIONS.SAMPLE_FORM_VIEW, PERMISSIONS.SAMPLE_FORM_CREATE],
}
```

### Simple Usage Example

```tsx
// src/modules/profile/routes/profile.routes.tsx
import { PERMISSIONS } from '@/modules/app/constants/permission.constant';
import { createAppRoutes } from '@/modules/app/libs/routes-utils';
import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const ProfileIndex = lazy(
  () => import('@/modules/profile/components/pages/profile-index'),
);
const ProfileEdit = lazy(
  () => import('@/modules/profile/components/pages/profile-edit'),
);

export default createAppRoutes([
  {
    path: 'profile',
    element: <Outlet />,
    handle: {
      breadcrumb: 'Profile',
      permissions: [PERMISSIONS.DASHBOARD_VIEW],
    },
    children: [
      { name: 'ProfileIndex', index: true, element: <ProfileIndex /> },
      {
        name: 'ProfileEdit',
        path: 'edit',
        element: <ProfileEdit />,
        handle: {
          breadcrumb: 'Edit Profile',
        },
      },
    ],
  },
]);
```

```tsx
// Inside a component
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';

const { navigate, linkTo } = useNamedRoute();

return (
  <>
    <Button onClick={() => navigate('ProfileEdit')}>Go to edit</Button>
    <Link to={linkTo('ProfileIndex')}>Back to profile</Link>
  </>
);
```

With these pieces in place, new modules automatically participate in layout navigation, display meaningful breadcrumbs, and stay behind the correct permission gates.

<!-- Acknowledgment Section -->

---

### ❤️ Thanks for your attention!

### 👨‍💻 Good Hacking!

---

<br/><br/>

# Roketin Module Generator

A CLI tool designed to streamline the creation of new feature modules in a structured React/TypeScript application, complete with standard files (Page, Route, Store, Types, etc.) and intelligent handling for nested routing.

---

## 📖 Usage and Commands

The generator supports two primary commands for module creation: `module` and `module-child`.

### 1. `pnpm roketin module <module_path>` (Standard/Nested)

This is the main command used for creating both top-level modules and nested modules where the routing type (flat or child) is determined interactively.

| Example Command                        | Path Input         | Description                                               |
| :------------------------------------- | :----------------- | :-------------------------------------------------------- |
| `pnpm roketin module dashboard`        | `dashboard`        | Creates a top-level module under `src/modules/dashboard`. |
| `pnpm roketin module account/settings` | `account/settings` | Triggers the **Interactive Prompt** to determine routing. |

#### Interactive Prompt for Nested Paths

If your `<module_path>` contains a slash (`/`), the tool will prompt you:

> `The path 'account/settings' is nested. Treat 'settings' as a child module? (Selecting 'No' means the path will be registered flatly as 'account/settings')`

| User Selection    | `isChild` | Route File Name             | Route Path Generated | Registration Strategy                                                                                                    |
| :---------------- | :-------- | :-------------------------- | :------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Yes** (Default) | `true`    | `settings.routes.child.tsx` | `"settings"`         | **Nested:** Must be imported and placed in the `children` array of the parent's route file (e.g., `account.routes.tsx`). |
| **No**            | `false`   | `settings.routes.tsx`       | `"account/settings"` | **Standalone:** Routes automatically registered in your application router.                                              |

### 2. `pnpm roketin module-child <module_path>` (Explicit Child)

Use this command when you explicitly know the generated module will be a child route and must be nested under a parent. This bypasses the interactive prompt.

| Example Command                             | Path Input        | Route File Name            | Route Path Generated | Registration Strategy                                                      |
| :------------------------------------------ | :---------------- | :------------------------- | :------------------- | :------------------------------------------------------------------------- |
| `pnpm roketin module-child account/profile` | `account/profile` | `profile.routes.child.tsx` | `"profile"`          | **Nested:** Requires manual nesting within the parent route configuration. |

---

## 📂 Generated File Structure

The tool creates files based on the chosen structure (`view`, `all`, or `custom`) and follows an opinionated path pattern to clearly separate top-level and nested modules:

**Path Pattern:** `src/modules/[TopLevelModule]/modules/[NestedModule]/...`

| Generated File Type  | Folder Path (relative to base) | File Naming Convention          |
| :------------------- | :----------------------------- | :------------------------------ |
| **Page**             | `components/pages`             | `[kebab-case].tsx`              |
| **Route (Standard)** | `routes`                       | `[kebab-case].routes.tsx`       |
| **Route (Child)**    | `routes`                       | `[kebab-case].routes.child.tsx` |
| **Store**            | `stores`                       | `[kebab-case].store.ts`         |
| **Hook**             | `hooks`                        | `use-[kebab-case].ts`           |
| **Service**          | `services`                     | `[kebab-case].service.ts`       |
| **Type**             | `types`                        | `[kebab-case].type.ts`          |
| **Locale**           | `locales`                      | `[kebab-case].en.json`          |

---

## 🛠️ Generated Route Logic (`createRouteConfig`)

The `createRouteConfig` function determines the `path` and adds informative comments based on your choice:

### Child Route (`isChild = true`)

```typescript
path: "settings", // Child route path uses only the segment name, as it's nested within a parent route.
```

_Intended for relative placement inside a parent route's `children` array._

### Standalone/Flat Route (`isChild = false`)

```typescript
path: "account/settings", // Standalone route path uses the full segment path for flat registration: "account/settings". This route automatically registered on app router
```

_Intended for direct placement in the root router configuration._
