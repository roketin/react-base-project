import RSelect from '@/modules/app/components/base/r-select';
import { useModuleOptions } from '@/modules/app/hooks/use-searchable-items';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { useTranslation } from 'react-i18next';

export function RSearchModuleFilter() {
  const { t } = useTranslation();
  const moduleOptions = useModuleOptions();
  const { selectedModule, setSelectedModule } = useGlobalSearchStore();

  return (
    <RSelect
      value={selectedModule || 'all'}
      onChange={(value) => setSelectedModule(value === 'all' ? null : value)}
      options={moduleOptions}
      placeholder={t('search.allModules')}
      showSearch
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: 120 }}
    />
  );
}
