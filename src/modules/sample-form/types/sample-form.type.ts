import type { BaseOptionType } from 'rc-select/lib/Select';

export type TSampleItem = BaseOptionType & {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
};
