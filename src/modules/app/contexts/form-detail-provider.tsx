import type { ReactNode } from 'react';
import { FormDetailContext } from './form-detail.context';

type TFormDetailProviderProps<T> = {
  children: ReactNode;
  isPreview?: boolean;
  isAuthenticated?: boolean;
  detail?: T | null;
};

export const FormDetailProvider = <T,>({
  children,
  isPreview = false,
  isAuthenticated = false,
  detail = null,
}: TFormDetailProviderProps<T>) => {
  return (
    <FormDetailContext.Provider value={{ isPreview, isAuthenticated, detail }}>
      {children}
    </FormDetailContext.Provider>
  );
};
