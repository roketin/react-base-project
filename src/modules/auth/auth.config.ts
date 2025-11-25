import { User } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { useProfileDialogStore } from '@/modules/auth/stores/profile-dialog.store';
import { KEYWORDS_PROFILE } from '@/modules/app/constants/search-keywords.constant';

export const authModuleConfig = defineModuleConfig({
  moduleId: 'auth',
  menu: false, // Auth module doesn't have sidebar menu
  actions: [
    {
      id: 'profile-dialog',
      titleKey: 'app:commands.profile',
      badge: 'Dialog',
      icon: User,
      keywords: KEYWORDS_PROFILE,
      onExecute: () => {
        useProfileDialogStore.getState().setOpen(true);
      },
    },
  ],
});

export default authModuleConfig;
