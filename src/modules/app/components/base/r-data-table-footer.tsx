import { RComboBox } from '@/modules/app/components/base/r-combobox';
import Button from '@/modules/app/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/modules/app/components/ui/pagination';
import { cn } from '@/modules/app/libs/utils';
import type { TApiResponsePaginateMeta } from '@/modules/app/types/api.type';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

export type TRDataTableFooterProps = {
  meta: TApiResponsePaginateMeta | null;
  pagesToShow: number;
  onChange: (data: { [key: string]: number | string }) => void;
  disabled: boolean;
};

const LIMIT_OPTIONS = [
  { value: 10 },
  { value: 20 },
  { value: 50 },
  { value: 100 },
];

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

  const pageCount = useMemo(() => {
    const resolvedLastPage =
      metaLastPage ?? (perPage > 0 ? Math.ceil(total / perPage) : 0);
    if (!Number.isFinite(resolvedLastPage) || resolvedLastPage < 1) {
      return 1;
    }
    return Math.max(1, Math.floor(resolvedLastPage));
  }, [metaLastPage, perPage, total]);

  const currentPage = useMemo(() => {
    if (pageCount === 0) return 1;
    return Math.min(Math.max(rawCurrentPage, 1), pageCount);
  }, [pageCount, rawCurrentPage]);

  const safePagesToShow = Math.max(Math.floor(pagesToShow), 1);

  const pageNumbers = useMemo<number[]>(() => {
    if (pageCount < 1) return [];

    const halfWindow = Math.floor(safePagesToShow / 2);
    const maxStart = Math.max(pageCount - safePagesToShow + 1, 1);
    const start = Math.max(Math.min(currentPage - halfWindow, maxStart), 1);
    const end = Math.min(start + safePagesToShow - 1, pageCount);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, pageCount, safePagesToShow]);

  const showingFrom = useMemo(() => {
    if (!total) return 0;
    if (typeof from === 'number') return from;
    return (currentPage - 1) * perPage + 1;
  }, [currentPage, from, perPage, total]);

  const showingTo = useMemo(() => {
    if (!total) return 0;
    if (typeof to === 'number') return to;
    return Math.min(currentPage * perPage, total);
  }, [currentPage, perPage, to, total]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < pageCount;
  const isDisabled = disabled || pageCount < 1;

  const firstVisiblePage = pageNumbers[0] ?? 1;
  const lastVisiblePage =
    pageNumbers[pageNumbers.length - 1] ?? firstVisiblePage;

  const showLeadingEllipsis = firstVisiblePage > 2;
  const showFirstPage = firstVisiblePage > 1;
  const showTrailingEllipsis = lastVisiblePage < pageCount - 1;
  const showLastPage = lastVisiblePage < pageCount;

  /**
   * Change Page
   * @param page
   */
  const handleChangePage = useCallback(
    (page: number) => {
      if (disabled) return;
      if (page === currentPage) return;
      if (page < 1 || page > pageCount) return;
      onChange({ page });
    },
    [currentPage, disabled, onChange, pageCount],
  );

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
            labelKey='value'
            valueKey='value'
            clearable={false}
            allowSearch={false}
            value={'' + (meta?.per_page ?? 10)}
            onChange={(val) => onChange({ page: 1, per_page: val ?? 10 })}
          />
        </div>
      </div>

      <Pagination className='ml-auto w-auto'>
        <PaginationContent>
          <Button
            title='Go to First'
            size='icon'
            variant='ghost'
            disabled={!canGoPrev || disabled}
            onClick={() => handleChangePage(1)}
          >
            <ChevronFirst size={20} />
          </Button>

          <Button
            title='Go to Previous'
            size='icon'
            variant='ghost'
            disabled={!canGoPrev || disabled}
            onClick={() => handleChangePage(currentPage - 1)}
          >
            <ChevronLeft size={20} />
          </Button>

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
              <PaginationLink
                size='sm'
                isActive={currentPage === page}
                className={cn('cursor-pointer', {
                  'pointer-events-none bg-black border-black text-white':
                    currentPage === page,
                })}
                onClick={() => handleChangePage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showTrailingEllipsis && (
            <PaginationItem>
              <span className='px-2 text-sm text-muted-foreground'>...</span>
            </PaginationItem>
          )}
          {showLastPage && (
            <PaginationItem>
              <PaginationLink
                size='sm'
                isActive={currentPage === pageCount}
                className='cursor-pointer'
                onClick={() => handleChangePage(pageCount)}
              >
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          )}

          <Button
            title='Go to Next'
            size='icon'
            variant='ghost'
            disabled={!canGoNext || disabled}
            onClick={() => handleChangePage(currentPage + 1)}
          >
            <ChevronRight size={20} />
          </Button>

          <Button
            title='Go to Last'
            size='icon'
            variant='ghost'
            disabled={!canGoNext || disabled}
            onClick={() => handleChangePage(pageCount)}
          >
            <ChevronLast size={20} />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default memo(RDataTableFooter);
