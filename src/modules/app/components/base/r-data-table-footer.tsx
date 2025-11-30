import RSelect from '@/modules/app/components/base/r-select';
import { RPagination } from '@/modules/app/components/base/r-pagination';
import { cn } from '@/modules/app/libs/utils';
import type { TApiResponsePaginateMeta } from '@/modules/app/types/api.type';
import type { TDisableable } from '@/modules/app/types/component.type';
import { memo, useCallback, useMemo } from 'react';

export type TRDataTableFooterProps = TDisableable & {
  meta?: TApiResponsePaginateMeta | null;
  pagesToShow?: number;
  onChange?: (data: Record<string, number | string>) => void;
};

const LIMIT_OPTIONS = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

/**
 * RDataTableFooter component - renders pagination controls and entry limit selector
 * @param props - component properties including pagination metadata, pages to show, onChange handler, and disabled state
 */
const RDataTableFooter = ({
  meta,
  pagesToShow = 5,
  onChange,
  disabled = false,
}: TRDataTableFooterProps) => {
  const {
    total = 0,
    per_page: perPage = 10,
    current_page: rawCurrentPage = 1,
    last_page: metaLastPage,
    from,
    to,
  } = meta ?? {};

  /**
   * Calculates the total number of pages based on metadata or total/perPage values.
   * Ensures the page count is at least 1.
   */
  const pageCount = useMemo(() => {
    const resolvedLastPage =
      metaLastPage ?? (perPage > 0 ? Math.ceil(total / perPage) : 0);
    if (!Number.isFinite(resolvedLastPage) || resolvedLastPage < 1) {
      return 1;
    }
    return Math.max(1, Math.floor(resolvedLastPage));
  }, [metaLastPage, perPage, total]);

  /**
   * Normalizes the current page to ensure it is within valid bounds [1, pageCount].
   */
  const currentPage = useMemo(() => {
    if (pageCount === 0) return 1;
    return Math.min(Math.max(rawCurrentPage, 1), pageCount);
  }, [pageCount, rawCurrentPage]);

  // Ensures pagesToShow is a positive integer, defaults to 1 if invalid
  const safePagesToShow = Math.max(Math.floor(pagesToShow), 1);

  /**
   * Calculates the starting entry number currently visible.
   * Uses 'from' from metadata if available, otherwise calculates based on current page and perPage.
   */
  const showingFrom = useMemo(() => {
    if (!total) return 0;
    if (typeof from === 'number') return from;
    return (currentPage - 1) * perPage + 1;
  }, [currentPage, from, perPage, total]);

  /**
   * Calculates the ending entry number currently visible.
   * Uses 'to' from metadata if available, otherwise calculates based on current page, perPage, and total.
   */
  const showingTo = useMemo(() => {
    if (!total) return 0;
    if (typeof to === 'number') return to;
    return Math.min(currentPage * perPage, total);
  }, [currentPage, perPage, to, total]);

  const isDisabled = disabled || pageCount < 1;

  /**
   * Callback to handle page changes triggered by user interaction.
   * Prevents changes when disabled or if page is out of range or unchanged.
   */
  const handleChangePage = useCallback(
    (page: number) => {
      if (disabled) return;
      if (page === currentPage) return;
      if (page < 1 || page > pageCount) return;
      onChange?.({ page });
    },
    [currentPage, disabled, onChange, pageCount],
  );

  /**
   * Render the pagination footer layout including:
   * - Entry count display
   * - Entries per page selector (RSelect)
   * - Pagination controls using RPagination component
   */
  return (
    <div
      className={cn(
        {
          'pointer-events-none opacity-50': isDisabled,
        },
        'flex flex-col md:flex-row md:items-center md:justify-between mt-5',
      )}
    >
      <div className='text-sm mb-4 md:mb-0 flex items-center gap-3'>
        <div>
          {total
            ? `Showing ${showingFrom} to ${showingTo} of ${total} entries`
            : 'No entries to display'}
        </div>

        <div className='w-[70px]'>
          <RSelect
            options={LIMIT_OPTIONS}
            value={String(perPage)}
            onChange={(val) =>
              onChange?.({ page: 1, per_page: Number(val ?? perPage) })
            }
          />
        </div>
      </div>

      <RPagination
        currentPage={currentPage}
        totalPages={pageCount}
        onPageChange={handleChangePage}
        siblingCount={Math.floor(safePagesToShow / 2)}
        showFirstLast={true}
        className='ml-auto'
      />
    </div>
  );
};

export default memo(RDataTableFooter);
