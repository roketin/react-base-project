import type { LucideIcon } from 'lucide-react';
import type { TPermission } from '@/modules/app/constants/permission.constant';

export type SearchableMenuItem = {
  type: 'menu';
  id: string;
  title: string;
  path: string;
  module: string;
  moduleTitle: string;
  icon?: LucideIcon;
  keywords?: string[]; // Original keywords array
  keywordsText?: string; // Joined keywords for search
  permission?: TPermission | TPermission[];
};

export type SearchableActionItem = {
  type: 'action';
  id: string;
  title: string;
  path?: string; // Optional for command actions
  module: string;
  moduleTitle: string;
  icon?: LucideIcon;
  keywords?: string[]; // Original keywords array
  keywordsText?: string; // Joined keywords for search
  permission?: TPermission | TPermission[];
  badge?: string; // e.g., "Create", "Edit", "View"
  onExecute?: () => void; // For non-navigation actions (commands)
};

export type SearchableCommandItem = {
  type: 'command';
  id: string;
  title: string;
  module: string;
  moduleTitle: string;
  icon?: LucideIcon;
  keywords?: string[]; // Original keywords array
  keywordsText?: string; // Joined keywords for search
  permission?: TPermission | TPermission[];
  badge?: string; // e.g., "Dialog", "Command"
  onExecute: () => void; // Required for commands
};

export type SearchableItem =
  | SearchableMenuItem
  | SearchableActionItem
  | SearchableCommandItem;

export type SearchTrackingData = {
  recent: string[];
  accessCount: Record<string, number>;
  lastUpdated: number;
};

export type ModuleOption = {
  value: string;
  label: string;
};
