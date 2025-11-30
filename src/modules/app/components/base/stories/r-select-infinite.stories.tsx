import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback, useMemo } from 'react';
import type { InfiniteData } from '@tanstack/react-query';

import { RSelectInfinite } from '../r-select-infinite';

type Option = {
  label: string;
  value: string;
  description?: string;
};

type PageData = {
  items: Option[];
  nextCursor?: number;
};

// Mock data generator
const generateMockOptions = (count: number): Option[] =>
  Array.from({ length: count }).map((_, index) => ({
    label: `Option ${index + 1}`,
    value: `option-${index + 1}`,
    description: `Description for option ${index + 1}`,
  }));

const allOptions = generateMockOptions(100);

const meta: Meta<typeof RSelectInfinite> = {
  title: 'Components/Form Controls/RSelectInfinite',
  component: RSelectInfinite,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof RSelectInfinite>;

// Hook to create mock query
const useMockInfiniteQuery = (pageSize = 10, searchTerm = '') => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return allOptions;
    return allOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  // Initialize first page
  useMemo(() => {
    setIsLoading(true);
    setPages([]);
    setTimeout(() => {
      const initialPage: PageData = {
        items: filteredOptions.slice(0, pageSize),
        nextCursor: pageSize < filteredOptions.length ? pageSize : undefined,
      };
      setPages([initialPage]);
      setIsLoading(false);
    }, 500);
  }, [filteredOptions, pageSize]);

  const fetchNextPage = useCallback(async () => {
    setIsFetchingNextPage(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setPages((prev) => {
          const lastPage = prev[prev.length - 1];
          const currentCursor = lastPage?.nextCursor ?? 0;
          const nextItems = filteredOptions.slice(
            currentCursor,
            currentCursor + pageSize,
          );
          const nextCursor =
            currentCursor + pageSize < filteredOptions.length
              ? currentCursor + pageSize
              : undefined;

          return [
            ...prev,
            {
              items: nextItems,
              nextCursor,
            },
          ];
        });
        setIsFetchingNextPage(false);
        resolve();
      }, 750);
    });
  }, [filteredOptions, pageSize]);

  const data: InfiniteData<PageData> | undefined = pages.length
    ? {
        pages,
        pageParams: pages.map((_, i) => i * pageSize),
      }
    : undefined;

  const lastPage = pages[pages.length - 1];
  const hasNextPage = lastPage?.nextCursor !== undefined;

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    const [searchValue] = useState('');

    const queryResult = useMockInfiniteQuery(10, searchValue);

    const mockQuery = useCallback(() => queryResult, [queryResult]);

    return (
      <RSelectInfinite
        placeholder='Select an option'
        allowClear
        showSearch
        value={value}
        onChange={(next) => setValue(next as string | undefined)}
        query={mockQuery}
        getPageItems={(page: PageData) => page.items}
        baseParams={{ search: searchValue }}
        searchParamKey='search'
        className='w-72'
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    const [searchValue] = useState('');

    const queryResult = useMockInfiniteQuery(10, searchValue);

    const mockQuery = useCallback(() => queryResult, [queryResult]);

    return (
      <RSelectInfinite
        placeholder='Select multiple options'
        allowClear
        showSearch
        mode='multiple'
        value={value}
        onChange={(next) => setValue((next ?? []) as string[])}
        query={mockQuery}
        getPageItems={(page: PageData) => page.items}
        baseParams={{ search: searchValue }}
        searchParamKey='search'
        className='w-72'
      />
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    const [searchValue] = useState('');

    const queryResult = useMockInfiniteQuery(10, searchValue);

    const mockQuery = useCallback(() => queryResult, [queryResult]);

    return (
      <RSelectInfinite
        placeholder='Search and select'
        allowClear
        showSearch
        value={value}
        onChange={(next) => setValue(next as string | undefined)}
        query={mockQuery}
        getPageItems={(page: PageData) => page.items}
        baseParams={{ search: searchValue }}
        searchParamKey='search'
        debounceMs={300}
        className='w-72'
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const queryResult = useMockInfiniteQuery(10);

    const mockQuery = useCallback(() => queryResult, [queryResult]);

    return (
      <RSelectInfinite
        placeholder='Disabled select'
        disabled
        allowClear
        query={mockQuery}
        getPageItems={(page: PageData) => page.items}
        className='w-72'
      />
    );
  },
};
