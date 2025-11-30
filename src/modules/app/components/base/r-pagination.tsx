import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/modules/app/libs/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export type TRPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
};

export const RPagination = forwardRef<HTMLDivElement, TRPaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      className,
    },
    ref,
  ) => {
    const generatePageNumbers = () => {
      const pages: (number | string)[] = [];

      if (totalPages <= 7) {
        // Show all pages if total is 7 or less
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
        return pages;
      }

      // Always show first page
      pages.push(1);

      const leftSibling = Math.max(currentPage - siblingCount, 2);
      const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (showLeftDots) {
        pages.push('...');
      }

      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }

      if (showRightDots) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);

      return pages;
    };

    const pages = generatePageNumbers();

    return (
      <nav
        ref={ref}
        role='navigation'
        aria-label='Pagination'
        className={cn('flex items-center justify-center gap-1', className)}
      >
        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label='Go to first page'
          >
            <ChevronLeft className='h-4 w-4' />
            <ChevronLeft className='h-4 w-4 -ml-3' />
          </PaginationButton>
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label='Go to previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </PaginationButton>

        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className='flex h-9 w-9 items-center justify-center text-slate-500'
              >
                <MoreHorizontal className='h-4 w-4' />
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <PaginationButton
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              isActive={isActive}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </PaginationButton>
          );
        })}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label='Go to next page'
        >
          <ChevronRight className='h-4 w-4' />
        </PaginationButton>

        {showFirstLast && (
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label='Go to last page'
          >
            <ChevronRight className='h-4 w-4' />
            <ChevronRight className='h-4 w-4 -ml-3' />
          </PaginationButton>
        )}
      </nav>
    );
  },
);

RPagination.displayName = 'RPagination';

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, isActive, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={cn(
          'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'hover:bg-slate-100 hover:text-slate-900',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PaginationButton.displayName = 'PaginationButton';
