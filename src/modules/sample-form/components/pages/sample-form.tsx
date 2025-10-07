import { RDataTable } from '@/modules/app/components/base/r-data-table';
import { RFilter } from '@/modules/app/components/base/r-filter';
import Button from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import { DEFAULT_QUERY_PARAMS } from '@/modules/app/constants/app.constant';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useObjectState } from '@/modules/app/hooks/use-object-state';
import { filterItem, type TFilterItem } from '@/modules/app/libs/filter-utils';
import { safeArray } from '@/modules/app/libs/utils';
import type { TApiDefaultQueryParams } from '@/modules/app/types/api.type';
import { useGetSampleFormList } from '@/modules/sample-form/services/sample-form.service';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

const columns: ColumnDef<TSampleItem>[] = [
  { header: 'Name', accessorKey: 'name', size: 230 },
  { header: 'Code', accessorKey: 'code', size: 230 },
  {
    header: 'Created Date',
    accessorKey: 'created_at',
    size: 250,
  },
];

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
  const { navigate } = useNamedRoute();

  /**
   * Redirect to add page
   */
  const handleAdd = useCallback(() => {
    navigate('SampleFormAdd');
  }, [navigate]);

  // Filters
  const filters = useMemo<TFilterItem[]>(
    () =>
      [
        filterItem.input({
          id: 'keyword',
          label: 'Keyword',
          placeholder: 'Search keyword',
        }),
        filterItem.combobox({
          id: 'country',
          label: 'Country',
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: 'Choose country',
        }),
        filterItem.comboboxMultiple({
          id: 'countries',
          label: 'Country',
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: 'Choose countries',
        }),
        filterItem.datepicker({
          id: 'date',
          label: 'Date',
          disabledDate: {
            before: new Date(),
          },
        }),
        filterItem.datepickerRange({
          id: 'date_multiple',
          label: 'Date Multiple',
          disabledDate: {
            before: new Date(),
          },
        }),
        filterItem.switch({
          id: 'is_active',
          label: 'Active Only',
          description: 'Show only active entries',
        }),
        filterItem.radio({
          id: 'status',
          label: 'Status',
          options: statuses,
          layout: 'horizontal',
        }),
        filterItem.checkboxMultiple({
          id: 'tags',
          label: 'Tags',
          options: tags,
          layout: 'horizontal',
        }),
        filterItem.slider({
          id: 'budget',
          label: 'Budget',
          min: 0,
          max: 1000,
          step: 50,
          defaultValue: [100, 500],
          formatValue: toCurrencyRange,
        }),
      ] as TFilterItem[],
    [],
  );

  const [qryParams, setQryParams] =
    useObjectState<TApiDefaultQueryParams>(DEFAULT_QUERY_PARAMS);

  // Get data
  const { data, isFetching: isLoading } = useGetSampleFormList(qryParams);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='inline-block'>
          <Button onClick={handleAdd}>Add Page</Button>
        </div>
      </div>

      <Separator className='my-4' />

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
