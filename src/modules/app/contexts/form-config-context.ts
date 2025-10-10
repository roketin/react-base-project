import React from 'react';

export const FormConfigContext = React.createContext<{
  labelWidth?: string;
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
  hideHorizontalLine?: boolean;
}>({});

export const useFormConfig = () => React.useContext(FormConfigContext);
