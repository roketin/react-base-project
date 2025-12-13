<!-- markdownlint-disable MD014 MD026 MD033 MD041 -->

<h1 align="center">🚀 React Base Project</h1>

<p align="center">
  <img src="https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg" alt="Roketin Banner" width="512px" />
</p>

<!-- BADGES:START - Dynamic badges powered by GitHub Actions & SonarCloud -->
<!-- Replace YOUR_GITHUB_USERNAME, YOUR_GIST_ID, YOUR_SONAR_ORG, YOUR_SONAR_PROJECT after setup -->
<p align="center">
  <img src="https://github.com/roketin/react-base-project/actions/workflows/ci.yml/badge.svg" alt="CI" />
  <img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_GIST_ID/raw/eslint-badge.json" alt="ESLint" />
  <img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_GIST_ID/raw/test-badge.json" alt="Tests" />
  <img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_GIST_ID/raw/typescript-badge.json" alt="TypeScript" />
</p>
<p align="center">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=YOUR_SONAR_PROJECT&metric=alert_status" alt="Quality Gate" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=YOUR_SONAR_PROJECT&metric=coverage" alt="Coverage" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=YOUR_SONAR_PROJECT&metric=bugs" alt="Bugs" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=YOUR_SONAR_PROJECT&metric=code_smells" alt="Code Smells" />
</p>
<!-- BADGES:END -->

<h3 align="center">💻 Starter Dashboard Modern berbasis React, Vite, dan Konvensi Roketin.</h3>

---

## 📚 Daftar Isi

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

Repository ini menyediakan kerangka dashboard lengkap menggunakan design system Roketin. Sudah termasuk layout dengan autentikasi, komponen UI reusable, linting ketat, serta utilities testing. Tujuannya agar tim dapat fokus membangun fitur, bukan men-setup proyek dari nol.

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite 7
- **State & Data:** Zustand, React Query, Immer
- **Routing & Auth:** React Router v7, custom guards, permission helpers
- **UI & Styling:** shadcn/ui, Tailwind CSS (`@tailwindcss/vite`), ikon Lucide
- **Forms & Validation:** React Hook Form, Yup, form primitives reusable
- **Testing:** Vitest, @testing-library, MSW
- **Quality:** ESLint (strict), Prettier, Husky, lint-staged, Commitlint

---

## ⚡ Quick Start

> Butuh **Node.js ≥ 18** dan **pnpm ≥ 9**.

```bash
# Install dependency
pnpm install

# Jalankan server dev
pnpm dev

# Build production
pnpm build

# Jalankan test
pnpm test
```

Environment variables berada di `.env`. Feature flag didefinisikan di `feature-flags.config.ts` dan dapat diaktifkan per-environment melalui `VITE_FEATURE_<FLAG>` pada `.env`.

---

## 📜 Available Scripts

| Command                | Deskripsi                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `pnpm dev`             | Menjalankan Vite dev server pada port **5177**.              |
| `pnpm build`           | Melakukan type-check dan build aplikasi untuk production.    |
| `pnpm preview`         | Men-serve hasil build production secara lokal.               |
| `pnpm lint`            | Menjalankan ESLint untuk seluruh proyek.                     |
| `pnpm test`            | Menjalankan unit/integration test dengan Vitest.             |
| `pnpm test:coverage`   | Menghasilkan laporan coverage di folder `coverage/`.         |
| `pnpm test:ui`         | Menjalankan Vitest UI runner.                                |
| `pnpm commit`          | Helper interaktif untuk membuat pesan commit (Commitlint).   |
| `pnpm roketin`         | CLI custom untuk membuat module dan file terkait.            |
| `pnpm storybook`       | Menjalankan Storybook di http://localhost:6006.              |
| `pnpm storybook:build` | Build output Storybook statis di folder `storybook-static/`. |

---

## 🔧 Configuration

Pengaturan aplikasi tersedia di **`roketin.config.ts`**. File ini dapat mengatur branding, ukuran sidebar, persistensi filter, prefix admin, dan lainnya—tanpa harus mengubah kode komponen.

| Section               | Keys                                                                                             | Fungsi                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `app`                 | `name`, `shortName`, `tagline`                                                                   | Menentukan branding aplikasi dan teks yang digunakan di header/footer.        |
| `sidebar.settings`    | `stateStorage.type`, `stateStorage.key`, `width`, `widthMobile`, `widthIcon`, `keyboardShortcut` | Mengatur ukuran sidebar, penyimpanan state open/close, dan shortcut keyboard. |
| `filters.persistence` | `enabled`, `strategy`, `keyPrefix`, `debounceMs`                                                 | Mengatur bagaimana `RFilter` menyimpan pilihan user.                          |
| `routes.admin`        | `basePath`                                                                                       | Prefix dasar untuk seluruh route admin.                                       |
| `languages`           | `enabled`, `debug`, `supported[]`                                                                | Mengatur multi-language, debug i18n, dan daftar bahasa yang didukung.         |

---

## 🌐 Localization & Sidebar Menus

- Tambahkan entry baru ke `src/modules/app/locales/app.<lang>.json` saat menambah bahasa baru.
- Sidebar setiap module didefinisikan melalui `<feature>.config.ts`.
- `AppSidebar` otomatis menggabungkan semua module config dan membentuk menu berdasarkan struktur parent–child.

Contoh locale:

```json
{
  "menu": {
    "dashboard": "Dashboard",
    "sampleForm": "Formulir Contoh"
  }
}
```

---

## 🧱 Feature Flags & Module Configs

- Semua flag berada di `feature-flags.config.ts`:

```ts
defineFeatureFlags({
  MY_FEATURE: { env: 'VITE_FEATURE_MY_FEATURE', defaultEnabled: true },
});
```

- Aktifkan melalui `.env`:

```
VITE_FEATURE_MY_FEATURE=true
```

- Gunakan helper:

```ts
isFeatureEnabled('FLAG');
useFeatureFlag('FLAG');
```

- Route guard:

```ts
handle.featureFlag = 'FLAG';
```

- Setiap module memiliki file config:

```ts
defineModuleConfig({
  moduleId,
  parentModuleId?,
  featureFlag,
  menu
})
```

Menu mendukung title, permission, icon, order, dan hidden mode.

---

## 🧩 Module Generator

CLI `pnpm roketin` membantu membuat module baru.

### Contoh:

```bash
pnpm roketin module reporting
pnpm roketin module reporting/summary
pnpm roketin module-child reporting/summary
pnpm roketin info
```

Fitur:

- Mendukung nested modules
- Auto-generate file config, types, routes, locales
- Auto-inject child routes ke parent
- Tidak overwrite tanpa persetujuan

---

## 🍞 Breadcrumbs

Breadcrumb bisa diatur melalui `handle.breadcrumb`.
Juga bisa diubah dari dalam komponen menggunakan:

```ts
useOverridePageConfig();
useBreadcrumbLabel();
```

---

## 📁 Struktur Proyek

```
reactjs-base-project/
├── roketin.config.ts
├── bin/roketin.js
├── src/
│   ├── main.tsx
│   ├── modules/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── sample-form/
│   └── ...
```

Setiap module memiliki subfolder: `components`, `routes`, `locales`, `types`, `stores`, dll.

---

## ✅ Konvensi & Tooling

- ESLint strict + hook rules
- Prettier via lint-staged
- Commitlint (gunakan `pnpm commit`)
- MSW + Vitest untuk testing
- CLI module generator bawaan Roketin

Selamat membangun! Jika ada masukan atau kontribusi, sangat dipersilakan. 🎉
