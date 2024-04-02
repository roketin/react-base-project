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
