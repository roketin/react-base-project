import { ListCheck } from 'lucide-react';
import { defineModuleConfig } from '@/modules/app/types/module-config.type';

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
});

export default sampleFormModuleConfig;
