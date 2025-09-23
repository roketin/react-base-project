import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      pointer-events: auto !important;
    }
  `;
  document.head.appendChild(style);
});

afterEach(() => {
  cleanup();

  // Clear all alert dialog elements
  const alertDialogs = document.querySelectorAll('[role="alertdialog"]');
  alertDialogs.forEach((node) => node.remove());

  // Clear all sonner elements
  const sonners = document.querySelectorAll('.sonner');
  sonners.forEach((node) => node.remove());
});
