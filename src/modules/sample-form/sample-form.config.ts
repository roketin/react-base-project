import { ListCheck, Plus, Search } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { navigateToRoute } from '@/modules/app/libs/navigation-helper';
import {
  KEYWORDS_CREATE,
  KEYWORDS_SEARCH,
  KEYWORDS_FORM,
} from '@/modules/app/constants/search-keywords.constant';

export const sampleFormModuleConfig = defineModuleConfig({
  moduleId: 'sample-form',
  featureFlag: 'SAMPLE_FORM',
  menu: {
    title: 'sampleForm:title',
    icon: ListCheck,
    permission: 'SAMPLE_FORM_VIEW',
    name: 'SampleFormIndex',
    order: 0,
  },
  actions: [
    {
      id: 'create-sample-form',
      routeName: 'SampleFormAdd',
      titleKey: 'sampleForm:menu.createNew',
      badge: 'Create',
      icon: Plus,
      permission: 'SAMPLE_FORM_CREATE',
      keywords: [...KEYWORDS_CREATE, ...KEYWORDS_FORM],
    },
    {
      id: 'search-sample-form',
      titleKey: 'sampleForm:commands.search',
      badge: 'Search',
      icon: Search,
      permission: 'SAMPLE_FORM_VIEW',
      keywords: [...KEYWORDS_SEARCH, ...KEYWORDS_FORM, 'sample'],
      onExecute: () => {
        const query = useGlobalSearchStore.getState().currentQuery;
        navigateToRoute('SampleFormIndex', { search: query });
      },
    },
  ],
});

export default sampleFormModuleConfig;
