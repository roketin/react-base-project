import { RDataTable } from '@/modules/app/components/base/r-data-table';
import Button from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import { DEFAULT_QUERY_PARAMS } from '@/modules/app/constants/app.constant';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useObjectState } from '@/modules/app/hooks/use-object-state';
import { safeArray } from '@/modules/app/libs/utils';
import type { TApiDefaultQueryParams } from '@/modules/app/types/api.type';
import { useGetSampleFormList } from '@/modules/sample-form/services/sample-form.service';
import type { TSampleItem } from '@/modules/sample-form/types/sample-form.type';
import type { ColumnDef } from '@tanstack/react-table';
import { useCallback } from 'react';

const columns: ColumnDef<TSampleItem>[] = [
  { header: 'Name', accessorKey: 'name', size: 230 },
  { header: 'Code', accessorKey: 'code', size: 230 },
  {
    header: 'Created Date',
    accessorKey: 'created_at',
    size: 250,
  },
];

const SampleFormIndex = () => {
  const { navigate } = useNamedRoute();

  /**
   * Redirect to add page
   */
  const handleAdd = useCallback(() => {
    navigate('SampleFormAdd');
  }, [navigate]);

  const [qParams, setQParams] =
    useObjectState<TApiDefaultQueryParams>(DEFAULT_QUERY_PARAMS);

  // Get data
  const { data, isFetching: isLoading } = useGetSampleFormList(qParams);

  return (
    <div>
      <div className='block'>
        <Button onClick={handleAdd}>Add Page</Button>
      </div>
      <Separator className='my-4' />

      <RDataTable
        fixed
        columns={columns}
        data={safeArray(data?.data)}
        meta={data?.meta}
        loading={isLoading}
        onChange={setQParams}
      />
    </div>
  );
};
export default SampleFormIndex;
