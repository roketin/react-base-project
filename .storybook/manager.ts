import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const lightTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Roketin UI',
  brandImage:
    'https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg',
  brandUrl: '/',
  brandTarget: '_self',

  // Typography - clean sans-serif
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Colors - shadcn inspired neutral palette
  colorPrimary: '#18181b',
  colorSecondary: '#71717a',

  // UI
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  appBorderRadius: 8,

  // Text colors
  textColor: '#18181b',
  textInverseColor: '#fafafa',
  textMutedColor: '#71717a',

  // Toolbar
  barTextColor: '#71717a',
  barSelectedColor: '#18181b',
  barHoverColor: '#18181b',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  inputTextColor: '#18181b',
  inputBorderRadius: 6,

  // Button
  buttonBg: '#18181b',
  buttonBorder: '#18181b',

  // Boolean (toggle)
  booleanBg: '#e4e4e7',
  booleanSelectedBg: '#18181b',
});

const darkTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Roketin UI',
  brandImage:
    'https://cms.roketin.com/uploads/Elemen_Brand_Roketin_03_ee99155544.jpg',
  brandUrl: '/',
  brandTarget: '_self',

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Colors - shadcn dark palette
  colorPrimary: '#fafafa',
  colorSecondary: '#a1a1aa',

  // UI
  appBg: '#09090b',
  appContentBg: '#09090b',
  appPreviewBg: '#09090b',
  appBorderColor: '#27272a',
  appBorderRadius: 8,

  // Text colors
  textColor: '#fafafa',
  textInverseColor: '#18181b',
  textMutedColor: '#a1a1aa',

  // Toolbar
  barTextColor: '#a1a1aa',
  barSelectedColor: '#fafafa',
  barHoverColor: '#fafafa',
  barBg: '#09090b',

  // Form colors
  inputBg: '#18181b',
  inputBorder: '#27272a',
  inputTextColor: '#fafafa',
  inputBorderRadius: 6,

  // Button
  buttonBg: '#fafafa',
  buttonBorder: '#fafafa',

  // Boolean (toggle)
  booleanBg: '#27272a',
  booleanSelectedBg: '#fafafa',
});

addons.setConfig({
  theme: prefersDark ? darkTheme : lightTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: false },
  },
  enableShortcuts: true,
});
