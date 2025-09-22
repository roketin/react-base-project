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
  💻 A Modern Base Project Dashboard with React.js.!
</h3>

---

<!-- Badges Section -->
<p align="center">
  <a href="./LICENSE" title="Show the MIT License">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT">
  </a>
  <br>
  <img src="https://forthebadge.com/images/badges/open-source.svg" alt="Open Source" />
  <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" alt="Made with TypeScript" />
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="Built with Love" />
  <br>
</p>

---

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

This project features all the latest tools and good practices in web development!

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
- 🚨 **[Zod](https://zod.dev)** – TypeScript-first schema validation with static type inference

### Tests

- ✨ **[Vitest](https://vitest.dev/)** – A Vite-native testing framework. Next Generation Testing Framework

### Design Patterns

- ⛔ **[ESLint](https://eslint.org)** – Find and fix problems in your JavaScript code
- 🎀 **[Prettier](https://prettier.io)** – An opinionated code formatter, supporting multiple languages and code editors
- 🐺 **[Husky](https://github.com/typicode/husky)** – Modern native Git hooks made easy
- 💩 **[lint-staged](https://github.com/okonet/lint-staged)** – Run linters against staged git files and don't let 💩 slip into your code base
- 📓 **[commitlint](https://commitlint.js.org)** – Helps your team adhering to a commit convention
- 🏷️ **[Standard Version](https://github.com/conventional-changelog/standard-version)** – A utility for versioning using semver and CHANGELOG generation powered by Conventional Commits

<!-- Procedures Section -->

## ▶️ Getting Started

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Folder Structure

The project follows a standard folder structure for organizing the code:

- `src`: Contains the source code of the React application.
  - `components`: Contains reusable React components.
  - `pages`: Contains the main pages of the application.
  - `styles`: Contains global styles and CSS modules.
  - `utils`: Contains utility functions and helper modules.
- `public`: Contains static assets such as images, fonts, etc.
- `tests`: Contains test files for the application.
- `dist`: Contains the bundled and optimized production build of the application.

Feel free to modify the folder structure according to your project's needs.

## Plugins

### State Management
- Zustand
- Redux toolkit [][https://redux-toolkit.js.org/]
