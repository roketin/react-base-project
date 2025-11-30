import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RTableSimple,
  RTableHeader,
  RTableBody,
  RTableFooter,
  RTableRow,
  RTableHead,
  RTableCell,
  RTableCaption,
} from '../r-table-simple';
import { RBadge } from '../r-badge';

const meta = {
  title: 'Components/Data Display/RTableSimple',
  component: RTableSimple,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RTableSimple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RTableSimple>
      <RTableHeader>
        <RTableRow>
          <RTableHead>Name</RTableHead>
          <RTableHead>Email</RTableHead>
          <RTableHead>Role</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        <RTableRow>
          <RTableCell>John Doe</RTableCell>
          <RTableCell>john@example.com</RTableCell>
          <RTableCell>Admin</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>Jane Smith</RTableCell>
          <RTableCell>jane@example.com</RTableCell>
          <RTableCell>User</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>Bob Johnson</RTableCell>
          <RTableCell>bob@example.com</RTableCell>
          <RTableCell>User</RTableCell>
        </RTableRow>
      </RTableBody>
    </RTableSimple>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <RTableSimple>
      <RTableCaption>A list of your recent invoices.</RTableCaption>
      <RTableHeader>
        <RTableRow>
          <RTableHead>Invoice</RTableHead>
          <RTableHead>Status</RTableHead>
          <RTableHead>Amount</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        <RTableRow>
          <RTableCell>INV001</RTableCell>
          <RTableCell>Paid</RTableCell>
          <RTableCell>$250.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>INV002</RTableCell>
          <RTableCell>Pending</RTableCell>
          <RTableCell>$150.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>INV003</RTableCell>
          <RTableCell>Unpaid</RTableCell>
          <RTableCell>$350.00</RTableCell>
        </RTableRow>
      </RTableBody>
    </RTableSimple>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <RTableSimple>
      <RTableHeader>
        <RTableRow>
          <RTableHead>Product</RTableHead>
          <RTableHead>Quantity</RTableHead>
          <RTableHead className='text-right'>Price</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        <RTableRow>
          <RTableCell>Product A</RTableCell>
          <RTableCell>2</RTableCell>
          <RTableCell className='text-right'>$100.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>Product B</RTableCell>
          <RTableCell>1</RTableCell>
          <RTableCell className='text-right'>$50.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>Product C</RTableCell>
          <RTableCell>3</RTableCell>
          <RTableCell className='text-right'>$150.00</RTableCell>
        </RTableRow>
      </RTableBody>
      <RTableFooter>
        <RTableRow>
          <RTableCell colSpan={2}>Total</RTableCell>
          <RTableCell className='text-right'>$300.00</RTableCell>
        </RTableRow>
      </RTableFooter>
    </RTableSimple>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <RTableSimple>
      <RTableHeader>
        <RTableRow>
          <RTableHead>Order ID</RTableHead>
          <RTableHead>Customer</RTableHead>
          <RTableHead>Status</RTableHead>
          <RTableHead className='text-right'>Amount</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        <RTableRow>
          <RTableCell>#ORD-001</RTableCell>
          <RTableCell>John Doe</RTableCell>
          <RTableCell>
            <RBadge variant='soft-success'>Completed</RBadge>
          </RTableCell>
          <RTableCell className='text-right'>$250.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>#ORD-002</RTableCell>
          <RTableCell>Jane Smith</RTableCell>
          <RTableCell>
            <RBadge variant='soft-warning'>Pending</RBadge>
          </RTableCell>
          <RTableCell className='text-right'>$150.00</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>#ORD-003</RTableCell>
          <RTableCell>Bob Johnson</RTableCell>
          <RTableCell>
            <RBadge variant='soft-destructive'>Cancelled</RBadge>
          </RTableCell>
          <RTableCell className='text-right'>$350.00</RTableCell>
        </RTableRow>
      </RTableBody>
    </RTableSimple>
  ),
};

export const Bordered: Story = {
  render: () => (
    <RTableSimple variant='bordered'>
      <RTableHeader>
        <RTableRow>
          <RTableHead>Name</RTableHead>
          <RTableHead>Email</RTableHead>
          <RTableHead>Role</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        <RTableRow>
          <RTableCell>John Doe</RTableCell>
          <RTableCell>john@example.com</RTableCell>
          <RTableCell>Admin</RTableCell>
        </RTableRow>
        <RTableRow>
          <RTableCell>Jane Smith</RTableCell>
          <RTableCell>jane@example.com</RTableCell>
          <RTableCell>User</RTableCell>
        </RTableRow>
      </RTableBody>
    </RTableSimple>
  ),
};

export const LargeTable: Story = {
  render: () => (
    <RTableSimple>
      <RTableHeader>
        <RTableRow>
          <RTableHead>ID</RTableHead>
          <RTableHead>Name</RTableHead>
          <RTableHead>Email</RTableHead>
          <RTableHead>Department</RTableHead>
          <RTableHead>Status</RTableHead>
          <RTableHead className='text-right'>Salary</RTableHead>
        </RTableRow>
      </RTableHeader>
      <RTableBody>
        {Array.from({ length: 10 }, (_, i) => (
          <RTableRow key={i}>
            <RTableCell>{i + 1}</RTableCell>
            <RTableCell>Employee {i + 1}</RTableCell>
            <RTableCell>employee{i + 1}@example.com</RTableCell>
            <RTableCell>
              {['Engineering', 'Marketing', 'Sales', 'HR'][i % 4]}
            </RTableCell>
            <RTableCell>
              <RBadge variant='soft-success'>Active</RBadge>
            </RTableCell>
            <RTableCell className='text-right'>
              ${(50000 + i * 5000).toLocaleString()}
            </RTableCell>
          </RTableRow>
        ))}
      </RTableBody>
    </RTableSimple>
  ),
};
