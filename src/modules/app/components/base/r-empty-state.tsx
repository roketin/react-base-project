import { memo, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import RBtn from '@/modules/app/components/base/r-btn';
import { RResult } from '@/modules/app/components/base/r-result';

export type TREmptyStateProps = {
  isSearching?: boolean;
  // No results (searching)
  noResultsTitle: string;
  noResultsDescription?: string;
  // No data (empty)
  noDataTitle: string;
  noDataDescription?: string;
  canCreate?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  // Custom action for no data state
  customAction?: ReactNode;
  className?: string;
};

export const REmptyState = memo<TREmptyStateProps>(
  ({
    isSearching = false,
    noResultsTitle,
    noResultsDescription,
    noDataTitle,
    noDataDescription,
    canCreate = false,
    onAdd,
    addLabel = 'Add',
    customAction,
    className = 'p-5',
  }) => {
    if (isSearching) {
      return (
        <RResult
          className={className}
          size='sm'
          title={noResultsTitle}
          description={noResultsDescription}
        />
      );
    }

    return (
      <RResult
        className={className}
        size='sm'
        title={noDataTitle}
        description={noDataDescription}
        action={
          customAction ??
          (canCreate && onAdd ? (
            <RBtn iconStart={<Plus />} onClick={onAdd}>
              {addLabel}
            </RBtn>
          ) : undefined)
        }
      />
    );
  },
);

REmptyState.displayName = 'REmptyState';
