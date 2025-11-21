import Select from 'rc-select';
import type {
  BaseOptionType,
  DefaultOptionType,
  SelectProps,
} from 'rc-select/lib/Select';
import type { BaseSelectRef } from 'rc-select';
import {
  forwardRef,
  type ReactElement,
  type ReactNode,
  type Ref,
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { cn } from '@/modules/app/libs/utils';

type OptionKey<Option extends BaseOptionType> = Extract<keyof Option, string>;

type TRSelectFieldNames<Option extends BaseOptionType> = {
  label?: OptionKey<Option>;
  value?: OptionKey<Option>;
  options?: OptionKey<Option>;
  groupLabel?: OptionKey<Option>;
};

export type TRSelectProps<
  ValueType = unknown,
  OptionType extends BaseOptionType = DefaultOptionType,
> = Omit<SelectProps<ValueType, OptionType>, 'fieldNames'> & {
  fieldNames?: TRSelectFieldNames<OptionType>;
  infiniteScroll?: {
    onLoadMore: () => void;
    threshold?: number;
    hasMore?: boolean;
    isLoading?: boolean;
    loadingContent?: ReactNode;
    finishedContent?: ReactNode;
  };
};

type TRSelectComponent = <
  ValueType = unknown,
  OptionType extends BaseOptionType = DefaultOptionType,
>(
  props: TRSelectProps<ValueType, OptionType> & {
    ref?: Ref<BaseSelectRef>;
  },
) => ReactElement | null;

function RSelectBase<
  ValueType,
  OptionType extends BaseOptionType = DefaultOptionType,
>(props: TRSelectProps<ValueType, OptionType>, ref: Ref<BaseSelectRef>) {
  const {
    fieldNames,
    placeholder,
    menuItemSelectedIcon,
    suffixIcon,
    'aria-invalid': ariaInvalid,
    className,
    infiniteScroll,
    dropdownRender,
    onPopupScroll,
    getPopupContainer,
    ...restProps
  } = props;

  const normalizedFieldNames = fieldNames
    ? (fieldNames as SelectProps<ValueType, OptionType>['fieldNames'])
    : undefined;

  const isMultiple = restProps.mode === 'multiple';

  const loadMoreTriggeredRef = useRef(false);
  const infiniteOnLoadMore = infiniteScroll?.onLoadMore;
  const infiniteThreshold = infiniteScroll?.threshold ?? 32;
  const infiniteHasMore = infiniteScroll?.hasMore ?? true;
  const infiniteIsLoading = infiniteScroll?.isLoading ?? false;
  const infiniteLoadingContent = infiniteScroll?.loadingContent;
  const infiniteFinishedContent = infiniteScroll?.finishedContent;

  useEffect(() => {
    if (!infiniteIsLoading || !infiniteHasMore) {
      loadMoreTriggeredRef.current = false;
    }
  }, [infiniteHasMore, infiniteIsLoading]);

  const handlePopupScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      onPopupScroll?.(event);

      if (!infiniteOnLoadMore || infiniteIsLoading || !infiniteHasMore) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      if (
        distanceToBottom <= infiniteThreshold &&
        !loadMoreTriggeredRef.current
      ) {
        loadMoreTriggeredRef.current = true;
        infiniteOnLoadMore();
      }
    },
    [
      infiniteHasMore,
      infiniteIsLoading,
      infiniteOnLoadMore,
      infiniteThreshold,
      onPopupScroll,
    ],
  );

  const mergedOnPopupScroll =
    infiniteOnLoadMore || onPopupScroll ? handlePopupScroll : undefined;

  const defaultLoadingFooter = useMemo(
    () => (
      <div className='flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground'>
        <LoaderCircle className='h-4 w-4 animate-spin' />
        Loading more…
      </div>
    ),
    [],
  );

  const defaultFinishedFooter = useMemo(
    () => (
      <div className='px-3 py-2 text-center text-xs text-muted-foreground'>
        All options loaded
      </div>
    ),
    [],
  );

  const infiniteFooter = useMemo(() => {
    if (!infiniteOnLoadMore) {
      return null;
    }

    if (infiniteIsLoading) {
      return infiniteLoadingContent !== undefined
        ? infiniteLoadingContent
        : defaultLoadingFooter;
    }

    if (!infiniteHasMore) {
      return infiniteFinishedContent !== undefined
        ? infiniteFinishedContent
        : defaultFinishedFooter;
    }

    return null;
  }, [
    defaultFinishedFooter,
    defaultLoadingFooter,
    infiniteFinishedContent,
    infiniteHasMore,
    infiniteIsLoading,
    infiniteLoadingContent,
    infiniteOnLoadMore,
  ]);

  const mergedDropdownRender = useCallback(
    (menu: React.ReactElement) => {
      const baseMenu = dropdownRender ? dropdownRender(menu) : menu;

      if (!infiniteFooter) {
        return baseMenu;
      }

      return (
        <>
          {baseMenu}
          {infiniteFooter}
        </>
      );
    },
    [dropdownRender, infiniteFooter],
  );

  const finalDropdownRender =
    infiniteOnLoadMore || dropdownRender ? mergedDropdownRender : undefined;

  const resolvedGetPopupContainer = useCallback(
    (node: HTMLElement) => {
      const customContainer = getPopupContainer?.(node);
      if (customContainer) {
        return customContainer;
      }

      const dialogContainer =
        (node.closest('[data-radix-dialog-content]') as HTMLElement | null) ??
        (node.closest('[role="dialog"]') as HTMLElement | null);

      return dialogContainer ?? node.parentElement ?? document.body;
    },
    [getPopupContainer],
  );

  return (
    <Select<ValueType, OptionType>
      ref={ref}
      className={cn({ 'rc-invalid': ariaInvalid }, className)}
      placeholder={placeholder ?? 'Choose..'}
      fieldNames={normalizedFieldNames}
      {...restProps}
      animation='slide-up'
      dropdownRender={finalDropdownRender}
      onPopupScroll={mergedOnPopupScroll}
      getPopupContainer={resolvedGetPopupContainer}
      menuItemSelectedIcon={
        menuItemSelectedIcon ?? (isMultiple ? <Check size={14} /> : null)
      }
      suffixIcon={
        suffixIcon ?? (
          <div role='img'>
            {props.loading ? (
              <LoaderCircle className='animate-spin' size={14} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
          </div>
        )
      }
    />
  );
}

const RSelect = forwardRef(RSelectBase) as TRSelectComponent;

export default RSelect;
