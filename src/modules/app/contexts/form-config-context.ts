import React from 'react';

export const FormConfigContext = React.createContext<{
  labelWidth?: string;
  layout?: 'vertical' | 'horizontal';
}>({});

export const useFormConfig = () => React.useContext(FormConfigContext);
