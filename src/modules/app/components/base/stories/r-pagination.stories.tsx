import type { Meta, StoryObj } from '@storybook/react-vite';
import { RPagination } from '../r-pagination';
import { useState } from 'react';

const meta = {
  title: 'Components/Navigation/RPagination',
  component: RPagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <div className='space-y-4'>
        <RPagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
        <p className='text-sm text-center text-slate-600'>
          Current page: {currentPage}
        </p>
      </div>
    );
  },
};

export const FewPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <RPagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <RPagination
        currentPage={currentPage}
        totalPages={100}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const MiddlePage: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(50);
    return (
      <RPagination
        currentPage={currentPage}
        totalPages={100}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const WithoutFirstLast: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    return (
      <RPagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
        showFirstLast={false}
      />
    );
  },
};

export const CustomSiblingCount: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(10);
    return (
      <div className='space-y-6'>
        <div>
          <p className='text-sm mb-2'>Sibling count: 1 (default)</p>
          <RPagination
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            siblingCount={1}
          />
        </div>
        <div>
          <p className='text-sm mb-2'>Sibling count: 2</p>
          <RPagination
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            siblingCount={2}
          />
        </div>
        <div>
          <p className='text-sm mb-2'>Sibling count: 3</p>
          <RPagination
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
            siblingCount={3}
          />
        </div>
      </div>
    );
  },
};

export const WithTable: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalItems = 50;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className='w-full max-w-2xl space-y-4'>
        <div className='rounded-lg border border-slate-200'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='p-4 text-left text-sm font-medium'>ID</th>
                <th className='p-4 text-left text-sm font-medium'>Name</th>
                <th className='p-4 text-left text-sm font-medium'>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }, (_, i) => {
                const itemNumber = startItem + i;
                if (itemNumber > totalItems) return null;
                return (
                  <tr key={itemNumber} className='border-b last:border-0'>
                    <td className='p-4 text-sm'>{itemNumber}</td>
                    <td className='p-4 text-sm'>Item {itemNumber}</td>
                    <td className='p-4 text-sm'>Active</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-sm text-slate-600'>
            Showing {startItem} to {endItem} of {totalItems} items
          </p>
          <RPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    );
  },
};
