module.exports = {
  root: true,
  env: { browser: true, es2021: true, jest: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'import'],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    // JSX
    "react/react-in-jsx-scope": "off",
    // Hook
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "@typescript-eslint/no-var-requires": "off",
    // best practices:
    "prefer-const": "error",
    "no-var": "error",
    "no-object-constructor": "error",
    "no-array-constructor": "error",
    "object-shorthand": "error",
    "prefer-destructuring": "warn",
    "prefer-template": "warn",
    "import/first": "warn",
    "dot-notation": "warn",
    "no-multi-assign": "error",
    "eqeqeq": "error",
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",
    "no-else-return": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
  
}
