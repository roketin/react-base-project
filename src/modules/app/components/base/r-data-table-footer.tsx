import RBtn from '@/modules/app/components/base/r-btn';
import { RComboBox } from '@/modules/app/components/base/r-combobox';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/modules/app/components/ui/pagination';
import { cn } from '@/modules/app/libs/utils';
import type { TApiResponsePaginateMeta } from '@/modules/app/types/api.type';
import type { TDisableable } from '@/modules/app/types/component.type';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

export type TRDataTableFooterProps = TDisableable & {
  meta?: TApiResponsePaginateMeta | null;
  pagesToShow?: number;
  onChange?: (data: Record<string, number | string>) => void;
};

const LIMIT_OPTIONS = [10, 20, 50, 100];

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
   * Computes the array of page numbers to display in the pagination control,
   * centered around the current page and limited by pagesToShow.
   */
  const pageNumbers = useMemo<number[]>(() => {
    if (pageCount < 1) return [];

    const halfWindow = Math.floor(safePagesToShow / 2);
    const maxStart = Math.max(pageCount - safePagesToShow + 1, 1);
    const start = Math.max(Math.min(currentPage - halfWindow, maxStart), 1);
    const end = Math.min(start + safePagesToShow - 1, pageCount);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, pageCount, safePagesToShow]);

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

  // Boolean flags indicating if navigation to previous or next pages is possible
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < pageCount;
  const isDisabled = disabled || pageCount < 1;

  // Determine the first and last visible page numbers in the pagination control
  const firstVisiblePage = pageNumbers[0] ?? 1;
  const lastVisiblePage =
    pageNumbers[pageNumbers.length - 1] ?? firstVisiblePage;

  // Flags to determine whether to show ellipsis and first/last page links
  const showLeadingEllipsis = firstVisiblePage > 2;
  const showFirstPage = firstVisiblePage > 1;
  const showTrailingEllipsis = lastVisiblePage < pageCount - 1;
  const showLastPage = lastVisiblePage < pageCount;

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
   * - Entries per page selector (RComboBox)
   * - Pagination controls with buttons for first, previous, page numbers, next, and last
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
      <div className='text-sm mb-4 text-center md:mb-0 flex items-center gap-3'>
        <div>
          {total
            ? `Showing ${showingFrom} to ${showingTo} of ${total} entries`
            : 'No entries to display'}
        </div>

        <div className='w-[70px]'>
          <RComboBox
            items={LIMIT_OPTIONS}
            clearable={false}
            allowSearch={false}
            value={String(perPage)}
            onChange={(val) =>
              onChange?.({ page: 1, per_page: Number(val ?? perPage) })
            }
          />
        </div>
      </div>

      <Pagination className='ml-auto w-auto'>
        <PaginationContent>
          <RBtn
            title='Go to First'
            size='icon'
            variant='ghost'
            disabled={!canGoPrev || disabled}
            onClick={() => handleChangePage(1)}
          >
            <ChevronFirst size={20} />
          </RBtn>

          <RBtn
            title='Go to Previous'
            size='icon'
            variant='ghost'
            disabled={!canGoPrev || disabled}
            onClick={() => handleChangePage(currentPage - 1)}
          >
            <ChevronLeft size={20} />
          </RBtn>

          {showFirstPage && (
            <PaginationItem>
              <PaginationLink
                size='sm'
                isActive={currentPage === 1}
                className='cursor-pointer'
                onClick={() => handleChangePage(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          {showLeadingEllipsis && (
            <PaginationItem>
              <span className='px-2 text-sm text-muted-foreground'>...</span>
            </PaginationItem>
          )}

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <RBtn
                size='sm'
                variant={page === currentPage ? 'default' : 'ghost'}
                className={cn('cursor-pointer', {
                  'pointer-events-none': currentPage === page,
                })}
                onClick={() => handleChangePage(page)}
              >
                {page}
              </RBtn>
            </PaginationItem>
          ))}

          {showTrailingEllipsis && (
            <PaginationItem>
              <span className='px-2 text-sm text-muted-foreground'>...</span>
            </PaginationItem>
          )}
          {showLastPage && (
            <PaginationItem>
              <RBtn
                size='sm'
                variant={pageCount === currentPage ? 'default' : 'ghost'}
                className='cursor-pointer'
                onClick={() => handleChangePage(pageCount)}
              >
                {pageCount}
              </RBtn>
            </PaginationItem>
          )}

          <RBtn
            title='Go to Next'
            size='icon'
            variant='ghost'
            disabled={!canGoNext || disabled}
            onClick={() => handleChangePage(currentPage + 1)}
          >
            <ChevronRight size={20} />
          </RBtn>

          <RBtn
            title='Go to Last'
            size='icon'
            variant='ghost'
            disabled={!canGoNext || disabled}
            onClick={() => handleChangePage(pageCount)}
          >
            <ChevronLast size={20} />
          </RBtn>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default memo(RDataTableFooter);
