import RBtn from '@/modules/app/components/base/r-btn';
import { RDataTable } from '@/modules/app/components/base/r-data-table';
import { RFilter } from '@/modules/app/components/base/r-filter';
import { DEFAULT_QUERY_PARAMS } from '@/modules/app/constants/app.constant';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useObjectState } from '@/modules/app/hooks/use-object-state';
import { filterItem, type TFilterItem } from '@/modules/app/libs/filter-utils';
import { safeArray } from '@/modules/app/libs/utils';
import type { TApiDefaultQueryParams } from '@/modules/app/types/api.type';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetSampleFormList } from '@/modules/sample-form/services/sample-form.service';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const countries = [
  { id: 'id', name: 'Indonesia' },
  { id: 'sg', name: 'Singapore' },
];

const statuses = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const tags = [
  { value: 'new', label: 'New' },
  { value: 'returning', label: 'Returning' },
  { value: 'vip', label: 'VIP' },
];

const toCurrencyRange = (values: number[]) => {
  const [min = 0, max = min] = values;
  return `Rp ${min.toLocaleString()} - Rp ${max.toLocaleString()}`;
};

const SampleFormIndex = () => {
  // Permission
  const { isCan } = useAuth();

  // Translation
  const { t } = useTranslation('sampleForm');

  // Navigation
  const { navigate } = useNamedRoute();

  /**
   * Redirect to add page
   */
  const handleAdd = useCallback(() => {
    navigate('SampleFormAdd');
  }, [navigate]);

  // Filters
  const columns = useMemo<ColumnDef<TSampleItem>[]>(
    () => [
      { header: t('columns.name'), accessorKey: 'name', size: 230 },
      { header: t('columns.code'), accessorKey: 'code', size: 230 },
      { header: t('columns.createdAt'), accessorKey: 'created_at', size: 250 },
    ],
    [t],
  );

  const filters = useMemo<TFilterItem[]>(
    () =>
      [
        filterItem.input({
          id: 'keyword',
          label: t('filters.keyword.label'),
          placeholder: t('filters.keyword.placeholder'),
        }),
        filterItem.combobox({
          id: 'country',
          label: t('filters.country.label'),
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: t('filters.country.placeholder'),
        }),
        filterItem.comboboxMultiple({
          id: 'countries',
          label: t('filters.countries.label'),
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: t('filters.countries.placeholder'),
        }),
        filterItem.datepicker({
          id: 'date',
          label: t('filters.date.label'),
        }),
        filterItem.datepickerRange({
          id: 'date_multiple',
          label: t('filters.dateMultiple.label'),
        }),
        filterItem.switch({
          id: 'is_active',
          label: t('filters.isActive.label'),
          description: t('filters.isActive.description'),
        }),
        filterItem.radio({
          id: 'status',
          label: t('filters.status.label'),
          options: statuses,
          layout: 'horizontal',
        }),
        filterItem.checkboxMultiple({
          id: 'tags',
          label: t('filters.tags.label'),
          options: tags,
          layout: 'horizontal',
        }),
        filterItem.slider({
          id: 'budget',
          label: t('filters.budget.label'),
          min: 0,
          max: 1000,
          step: 50,
          defaultValue: [100, 500],
          formatValue: toCurrencyRange,
        }),
      ] as TFilterItem[],
    [t],
  );

  const [qryParams, setQryParams] =
    useObjectState<TApiDefaultQueryParams>(DEFAULT_QUERY_PARAMS);

  // Get data
  const { data, isFetching: isLoading } = useGetSampleFormList(qryParams);

  return (
    <div>
      <div className='mb-3'>
        {isCan('SAMPLE_FORM_CREATE') && (
          <RBtn iconStart={<Plus />} onClick={handleAdd}>
            {t('actions.add')}
          </RBtn>
        )}
      </div>

      <RDataTable
        fixed
        header={
          <RFilter
            items={filters}
            onApply={setQryParams}
            onReset={setQryParams}
            mapKey={{
              'date_multiple[from]': 'date_start',
              'date_multiple[to]': 'date_end',
            }}
          />
        }
        columns={columns}
        data={safeArray(data?.data)}
        meta={data?.meta}
        loading={isLoading}
        onChange={setQryParams}
      />
    </div>
  );
};
export default SampleFormIndex;
