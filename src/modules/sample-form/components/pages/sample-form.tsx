import RBtn from '@/modules/app/components/base/r-btn';
import showAlert from '@/modules/app/components/base/show-alert';
import {
  RDataTable,
  type TRDataTableColumnDef,
} from '@/modules/app/components/base/r-data-table';
import { RFilterMenu } from '@/modules/app/components/base/r-filter';
import {
  DATE_FORMAT,
  DEFAULT_QUERY_PARAMS,
} from '@/modules/app/constants/app.constant';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useObjectState } from '@/modules/app/hooks/use-object-state';
import { RTooltip } from '@/modules/app/components/base/r-tooltip';
import { filterItem, type TFilterItem } from '@/modules/app/libs/filter-utils';
import {
  tableCellLink,
  tableCurrency,
  tableDate,
} from '@/modules/app/libs/table-utils';
import { safeArray } from '@/modules/app/libs/utils';
import type { TApiDefaultQueryParams } from '@/modules/app/types/api.type';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetSampleFormList } from '@/modules/sample-form/services/sample-form.service';
import SampleFormDialog from '@/modules/sample-form/components/elements/sample-form-dialog';
import type { TTestDialogSchema } from '@/modules/sample-form/components/elements/sample-form-dialog';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import { InspectIcon, Pencil, Plus, Trash } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParam } from '@/modules/app/hooks/use-search-param';

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
  const columns = useMemo<TRDataTableColumnDef<TSampleItem, unknown>[]>(
    () => [
      {
        id: 'actions',
        header: t('columns.actions'),
        sticky: 'left',
        enableSorting: false,
        size: 100,
        cell: ({ row }) => (
          <div className='flex items-center  gap-2'>
            <RTooltip content={t('actions.edit')}>
              <RBtn
                size='iconSm'
                variant='outline'
                onClick={() =>
                  navigate('SampleFormEdit', { id: row.original.id })
                }
              >
                <Pencil size={20} />
              </RBtn>
            </RTooltip>
            <RTooltip content={t('actions.delete')}>
              <RBtn
                size='iconSm'
                variant='outline'
                onClick={() => {
                  showAlert(
                    {
                      type: 'confirm',
                      title: 'Delete this entry?',
                      description: `Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
                      variant: 'confirm',
                    },
                    ({ ok }) => {
                      if (ok) {
                        showAlert({
                          variant: 'success',
                          type: 'alert',
                          title: 'Success',
                          description: 'Successfully deleted entry',
                          okVariant: 'success',
                        });
                      }
                    },
                  );
                }}
              >
                <Trash size={20} className='text-destructive' />
              </RBtn>
            </RTooltip>
          </div>
        ),
      },
      {
        header: t('columns.name'),
        accessorKey: 'name',
        cell: ({ row, getValue }) =>
          tableCellLink(getValue<string>(), {
            routeName: 'SampleFormEdit',
            routeParams: { id: String(row.original.id) },
          }),
        size: 230,
      },
      {
        id: 'code1',
        header: t('columns.code', { i: 1 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code2',
        header: t('columns.code', { i: 2 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code3',
        header: t('columns.code', { i: 3 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code4',
        header: t('columns.code', { i: 4 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code5',
        header: t('columns.code', { i: 5 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code6',
        header: t('columns.code', { i: 6 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code7',
        header: t('columns.code', { i: 7 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        id: 'code8',
        header: t('columns.code', { i: 8 }),
        accessorKey: 'code',
        size: 100,
      },
      {
        header: 'Budget',
        accessorKey: 'budget',
        size: 150,
        cell: () => tableCurrency(100000000),
      },
      {
        header: t('columns.createdAt'),
        accessorKey: 'created_at',
        size: 190,
        cell: ({ getValue }) => tableDate(getValue<string>(), DATE_FORMAT.long),
      },
    ],
    [navigate, t],
  );

  const filters = useMemo<TFilterItem[]>(
    () =>
      [
        filterItem.input({
          id: 'keyword',
          label: t('filters.keyword.label'),
          placeholder: t('filters.keyword.placeholder'),
        }),
        filterItem.select({
          id: 'country',
          label: t('filters.country.label'),
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: t('filters.country.placeholder'),
        }),
        filterItem.select({
          id: 'countries',
          label: t('filters.countries.label'),
          items: countries,
          labelKey: 'name',
          valueKey: 'id',
          mode: 'multiple',
          placeholder: t('filters.countries.placeholder'),
        }),
        filterItem.datepicker({
          id: 'date',
          label: t('filters.date.label'),
          placeholder: t('filters.date.label'),
        }),
        filterItem.datepickerRange({
          id: 'date_multiple',
          label: t('filters.dateMultiple.label'),
          placeholder: t('filters.dateMultiple.label'),
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

  // Get search param from URL (from global search)
  const initialSearch = useSearchParam();

  const [qryParams, setQryParams] =
    useObjectState<TApiDefaultQueryParams>(DEFAULT_QUERY_PARAMS);

  // Debug: Log qryParams changes
  useEffect(() => {
    console.log('📊 Query params changed:', qryParams);
  }, [qryParams]);

  // Get data
  const { data, isFetching: isLoading } = useGetSampleFormList(qryParams);

  // Test Dialog State
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  const handleTestSubmit = useCallback((values: TTestDialogSchema) => {
    console.log('Test Submit', values);
    setIsTestDialogOpen(false);
  }, []);

  return (
    <div>
      <div className='mb-3 flex gap-2'>
        {isCan('SAMPLE_FORM_CREATE') && (
          <RBtn iconStart={<Plus />} onClick={handleAdd}>
            {t('actions.add')}
          </RBtn>
        )}
        <RBtn
          iconStart={<InspectIcon />}
          variant='outline'
          onClick={() => setIsTestDialogOpen(true)}
        >
          Test Dialog
        </RBtn>
      </div>

      <SampleFormDialog
        open={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        countries={countries}
        onSubmit={handleTestSubmit}
      />

      <RDataTable
        fixed
        initialSearch={initialSearch}
        toolbarEnd={
          <RFilterMenu
            schema={filters}
            onSubmit={setQryParams}
            onReset={setQryParams}
            keyMap={{
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
