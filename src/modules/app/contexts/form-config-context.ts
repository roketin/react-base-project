import React from 'react';

export type TFormFieldsetConfig = {
  isSticky?: boolean;
  stickyOffset?: number;
  titleWidth?: string;
  divider?: boolean;
  layout?: 'horizontal' | 'vertical';
};

export const FormConfigContext = React.createContext<{
  labelWidth?: string;
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
  hideHorizontalLine?: boolean;
  fieldsetConfig?: TFormFieldsetConfig;
  isPreview?: boolean;
  isLoading?: boolean;
}>({});

export const useFormConfig = () => React.useContext(FormConfigContext);
