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
┃ ┃ ┃   ┣ 📂 hoc
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

<!-- Acknowledgment Section -->

---

### ❤️ Thanks for your attention!

### 👨‍💻 Good Hacking!

---
