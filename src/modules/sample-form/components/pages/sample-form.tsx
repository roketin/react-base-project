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
import {
  useGetRickAndMortyCharactersInfinite,
  useGetSampleFormList,
} from '@/modules/sample-form/services/sample-form.service';
import SampleFormDialog from '@/modules/sample-form/components/elements/sample-form-dialog';
import type { TTestDialogSchema } from '@/modules/sample-form/components/elements/sample-form-dialog';
import type {
  TRickAndMortyCharacter,
  TRickAndMortyCharactersResponse,
  TSampleItem,
} from '@/modules/sample-form/types/sample-form.type';
import { Calendar, InspectIcon, Pencil, Plus, Trash } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParam } from '@/modules/app/hooks/use-search-param';
import { RCheckbox } from '@/modules/app/components/base/r-checkbox';
import { useGetSampleFormInfiniteList } from '@/modules/sample-form/services/sample-form.service';
import type { TApiResponsePaginate } from '@/modules/app/types/api.type';

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

  /**
   * Handle delete confirmation callback
   */
  const handleDeleteConfirm = useCallback(({ ok }: { ok: boolean }) => {
    if (ok) {
      showAlert({
        variant: 'success',
        type: 'alert',
        title: 'Success',
        description: 'Successfully deleted entry',
        okVariant: 'success',
      });
    }
  }, []);

  /**
   * Handle delete action
   */
  const handleDelete = useCallback(
    (item: TSampleItem) => {
      showAlert(
        {
          type: 'confirm',
          title: 'Delete this entry?',
          description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
          variant: 'confirm',
        },
        handleDeleteConfirm,
      );
    },
    [handleDeleteConfirm],
  );

  // Filters
  const columns = useMemo<TRDataTableColumnDef<TSampleItem, unknown>[]>(
    () => [
      {
        id: 'select',
        headerAlign: 'center',
        header: ({ table }) => (
          <RCheckbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(checked)
            }
          />
        ),
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <RCheckbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      },
      {
        header: t('columns.name'),
        accessorKey: 'name',
        cell: ({ row, getValue }) =>
          tableCellLink(getValue<string>(), {
            routeName: 'SampleFormEdit',
            routeParams: { id: String(row.original.id) },
          }),
      },
      {
        id: 'code1',
        header: t('columns.code', { i: 1 }),
        accessorKey: 'code',
        size: 130,
      },
      {
        header: 'Budget',
        accessorKey: 'budget',
        size: 140,
        cell: () => tableCurrency(100000000),
      },
      {
        header: t('columns.createdAt'),
        accessorKey: 'created_at',
        size: 280,
        cell: ({ getValue }) => tableDate(getValue<string>(), DATE_FORMAT.long),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        sticky: 'right',
        enableSorting: false,
        size: 70,
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
                variant='destructive'
                soft
                onClick={() => handleDelete(row.original)}
              >
                <Trash size={20} className='text-destructive' />
              </RBtn>
            </RTooltip>
          </div>
        ),
      },
    ],
    [handleDelete, navigate, t],
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
        filterItem.selectInfinite<
          TApiResponsePaginate<TSampleItem>,
          TSampleItem
        >({
          id: 'remote_sample',
          label: 'Sample (API)',
          query: useGetSampleFormInfiniteList,
          getPageItems: (p) => p.data,
          labelKey: 'name',
          valueKey: 'id',
          placeholder: 'Cari sample...',
          searchParamKey: 'name',
          deduplicateKey: 'id',
        }),

        filterItem.selectInfinite<
          TRickAndMortyCharactersResponse<TRickAndMortyCharacter>,
          TRickAndMortyCharacter,
          { name?: string }
        >({
          id: 'character_v2',
          label: 'Character V2 (No Lag)',
          query: useGetRickAndMortyCharactersInfinite,
          getPageItems: (p) =>
            p.results.map((r) => ({ ...r, id: String(r.id) })),
          labelKey: 'name',
          valueKey: 'id',
          placeholder: 'Search character (optimized)',
          searchParamKey: 'name',
          deduplicateKey: 'id',
        }),
      ] as TFilterItem[],
    [t],
  );

  // Get search param from URL (from global search)
  const initialSearch = useSearchParam();

  const [qryParams, setQryParams] =
    useObjectState<TApiDefaultQueryParams>(DEFAULT_QUERY_PARAMS);

  // Get data
  const { data, isFetching: isLoading } = useGetSampleFormList({
    variables: qryParams,
  });

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
        renderOnMobile={(row) => (
          <div className='border border-gray-100 p-4' key={row.id}>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h4 className='font-medium text-foreground'>{row.name}</h4>
                <p className='text-sm text-muted-foreground'>{row.code}</p>
              </div>
              <div className='flex gap-1'>
                <RBtn
                  size='iconSm'
                  variant='soft-success'
                  onClick={() => navigate('SampleFormEdit', { id: row.id })}
                >
                  <Pencil size={16} />
                </RBtn>
                <RBtn size='iconSm' variant='soft-destructive'>
                  <Trash size={16} className='text-destructive' />
                </RBtn>
              </div>
            </div>
            <div className='mt-3 flex items-center gap-4 text-sm text-muted-foreground'>
              <span className='font-medium text-foreground'>
                {tableCurrency(100000000)}
              </span>
              <span className='flex items-center gap-1'>
                <Calendar size={14} />
                {tableDate(row.created_at, DATE_FORMAT.short)}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};
export default SampleFormIndex;
