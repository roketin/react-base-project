import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RTable,
  RThead,
  RTbody,
  RTfoot,
  RTr,
  RTh,
  RTd,
} from '@/modules/app/components/base/r-simple-table';
import { RBadge } from '@/modules/app/components/base/r-badge';

const meta = {
  title: 'Components/Data Display/RSimpleTable',
  component: RTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RTable>
      <RThead>
        <RTr>
          <RTh>Name</RTh>
          <RTh>Email</RTh>
          <RTh>Role</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr>
          <RTd>John Doe</RTd>
          <RTd>john@example.com</RTd>
          <RTd>Admin</RTd>
        </RTr>
        <RTr>
          <RTd>Jane Smith</RTd>
          <RTd>jane@example.com</RTd>
          <RTd>User</RTd>
        </RTr>
        <RTr>
          <RTd>Bob Johnson</RTd>
          <RTd>bob@example.com</RTd>
          <RTd>User</RTd>
        </RTr>
      </RTbody>
    </RTable>
  ),
};

export const WithAlignment: Story = {
  render: () => (
    <RTable>
      <RThead>
        <RTr>
          <RTh align='left'>Product</RTh>
          <RTh align='center'>Quantity</RTh>
          <RTh align='right'>Price</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr>
          <RTd align='left'>Product A</RTd>
          <RTd align='center'>2</RTd>
          <RTd align='right'>$100.00</RTd>
        </RTr>
        <RTr>
          <RTd align='left'>Product B</RTd>
          <RTd align='center'>1</RTd>
          <RTd align='right'>$50.00</RTd>
        </RTr>
        <RTr>
          <RTd align='left'>Product C</RTd>
          <RTd align='center'>3</RTd>
          <RTd align='right'>$150.00</RTd>
        </RTr>
      </RTbody>
    </RTable>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <RTable>
      <RThead>
        <RTr>
          <RTh>Product</RTh>
          <RTh align='center'>Quantity</RTh>
          <RTh align='right'>Price</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr>
          <RTd>Product A</RTd>
          <RTd align='center'>2</RTd>
          <RTd align='right'>$100.00</RTd>
        </RTr>
        <RTr>
          <RTd>Product B</RTd>
          <RTd align='center'>1</RTd>
          <RTd align='right'>$50.00</RTd>
        </RTr>
        <RTr>
          <RTd>Product C</RTd>
          <RTd align='center'>3</RTd>
          <RTd align='right'>$150.00</RTd>
        </RTr>
      </RTbody>
      <RTfoot>
        <RTr>
          <RTd colSpan={2}>Total</RTd>
          <RTd align='right'>$300.00</RTd>
        </RTr>
      </RTfoot>
    </RTable>
  ),
};

export const Striped: Story = {
  render: () => (
    <RTable>
      <RThead>
        <RTr>
          <RTh>Name</RTh>
          <RTh>Email</RTh>
          <RTh>Status</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr striped>
          <RTd>John Doe</RTd>
          <RTd>john@example.com</RTd>
          <RTd>
            <RBadge variant='soft-success'>Active</RBadge>
          </RTd>
        </RTr>
        <RTr striped>
          <RTd>Jane Smith</RTd>
          <RTd>jane@example.com</RTd>
          <RTd>
            <RBadge variant='soft-success'>Active</RBadge>
          </RTd>
        </RTr>
        <RTr striped>
          <RTd>Bob Johnson</RTd>
          <RTd>bob@example.com</RTd>
          <RTd>
            <RBadge variant='soft-warning'>Pending</RBadge>
          </RTd>
        </RTr>
        <RTr striped>
          <RTd>Alice Williams</RTd>
          <RTd>alice@example.com</RTd>
          <RTd>
            <RBadge variant='soft-destructive'>Inactive</RBadge>
          </RTd>
        </RTr>
      </RTbody>
    </RTable>
  ),
};

export const StickyColumn: Story = {
  render: () => (
    <div className='max-w-[600px]'>
      <RTable>
        <RThead>
          <RTr>
            <RTh sticky='left' stickyOffset={0}>
              Name
            </RTh>
            <RTh>Email</RTh>
            <RTh>Department</RTh>
            <RTh>Location</RTh>
            <RTh sticky='right' stickyOffset={0} align='right'>
              Actions
            </RTh>
          </RTr>
        </RThead>
        <RTbody>
          <RTr>
            <RTd sticky='left' stickyOffset={0}>
              John Doe
            </RTd>
            <RTd>john@example.com</RTd>
            <RTd>Engineering</RTd>
            <RTd>New York</RTd>
            <RTd sticky='right' stickyOffset={0} align='right'>
              <button className='text-blue-500'>Edit</button>
            </RTd>
          </RTr>
          <RTr>
            <RTd sticky='left' stickyOffset={0}>
              Jane Smith
            </RTd>
            <RTd>jane@example.com</RTd>
            <RTd>Marketing</RTd>
            <RTd>San Francisco</RTd>
            <RTd sticky='right' stickyOffset={0} align='right'>
              <button className='text-blue-500'>Edit</button>
            </RTd>
          </RTr>
          <RTr>
            <RTd sticky='left' stickyOffset={0}>
              Bob Johnson
            </RTd>
            <RTd>bob@example.com</RTd>
            <RTd>Sales</RTd>
            <RTd>Los Angeles</RTd>
            <RTd sticky='right' stickyOffset={0} align='right'>
              <button className='text-blue-500'>Edit</button>
            </RTd>
          </RTr>
        </RTbody>
      </RTable>
    </div>
  ),
};

export const FixedLayout: Story = {
  render: () => (
    <RTable fixed>
      <RThead>
        <RTr>
          <RTh>Name</RTh>
          <RTh>Email</RTh>
          <RTh>Role</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr>
          <RTd>John Doe with a very long name that should be truncated</RTd>
          <RTd>john.doe.with.long.email@example.com</RTd>
          <RTd>Administrator</RTd>
        </RTr>
        <RTr>
          <RTd>Jane Smith</RTd>
          <RTd>jane@example.com</RTd>
          <RTd>User</RTd>
        </RTr>
      </RTbody>
    </RTable>
  ),
};

export const Bordered: Story = {
  render: () => (
    <RTable bordered>
      <RThead>
        <RTr>
          <RTh>Name</RTh>
          <RTh>Email</RTh>
          <RTh>Role</RTh>
        </RTr>
      </RThead>
      <RTbody>
        <RTr>
          <RTd>John Doe</RTd>
          <RTd>john@example.com</RTd>
          <RTd>Admin</RTd>
        </RTr>
        <RTr>
          <RTd>Jane Smith</RTd>
          <RTd>jane@example.com</RTd>
          <RTd>User</RTd>
        </RTr>
      </RTbody>
    </RTable>
  ),
};
