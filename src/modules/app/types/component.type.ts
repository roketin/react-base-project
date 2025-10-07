import type { ReactNode } from 'react';

export type TBaseInputDefaultProps = {
  onChange?: (value: string) => void;
};

export type TLayoutOrientation = 'horizontal' | 'vertical';

export type TDisableable = {
  disabled?: boolean;
};

export type TLoadable = {
  loading?: boolean;
};

export type TAriaInvalidProp = {
  'aria-invalid'?: boolean | string;
};

export type TLabelValueOption<
  TValue = string,
  TLabel extends ReactNode = ReactNode,
> = {
  value: TValue;
  label: TLabel;
};

export type TDescriptiveOption<
  TValue = string,
  TLabel extends ReactNode = ReactNode,
> = TLabelValueOption<TValue, TLabel> & {
  description?: ReactNode;
};
