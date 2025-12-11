import { useContext } from 'react';
import {
  FormDetailContext,
  type TFormDetailContext,
} from '../contexts/form-detail.context';

export const useFormDetailContext = <T = unknown>() => {
  const context = useContext(FormDetailContext);
  if (!context) {
    throw new Error(
      'useFormDetailContext must be used within FormDetailProvider',
    );
  }
  return context as TFormDetailContext<T>;
};

export { FormDetailProvider } from '../contexts/form-detail-provider';
export type { TFormDetailContext } from '../contexts/form-detail.context';
