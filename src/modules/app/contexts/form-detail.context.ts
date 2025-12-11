import { createContext } from 'react';

export type TFormDetailContext<T = unknown> = {
  isPreview: boolean;
  isAuthenticated: boolean;
  detail: T | null;
};

export const FormDetailContext = createContext<TFormDetailContext | null>(null);
