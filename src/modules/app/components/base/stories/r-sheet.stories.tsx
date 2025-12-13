import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../r-sheet';
import RBtn from '../r-btn';
import { RInput } from '../r-input';
import { RTextarea } from '../r-textarea';
import { RLabel } from '../r-label';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Overlay/RSheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <RBtn>Open Sheet</RBtn>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a basic sheet component that slides in from the right.
          </SheetDescription>
        </SheetHeader>
        <div className='p-4'>
          <p className='text-sm text-muted-foreground'>
            Sheet content goes here. You can put any content inside.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <Sheet>
        <SheetTrigger asChild>
          <RBtn variant='outline'>Right</RBtn>
        </SheetTrigger>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>Right Sheet</SheetTitle>
            <SheetDescription>Slides in from the right side.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <RBtn variant='outline'>Left</RBtn>
        </SheetTrigger>
        <SheetContent side='left'>
          <SheetHeader>
            <SheetTitle>Left Sheet</SheetTitle>
            <SheetDescription>Slides in from the left side.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <RBtn variant='outline'>Top</RBtn>
        </SheetTrigger>
        <SheetContent side='top'>
          <SheetHeader>
            <SheetTitle>Top Sheet</SheetTitle>
            <SheetDescription>Slides in from the top.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <RBtn variant='outline'>Bottom</RBtn>
        </SheetTrigger>
        <SheetContent side='bottom'>
          <SheetHeader>
            <SheetTitle>Bottom Sheet</SheetTitle>
            <SheetDescription>Slides in from the bottom.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <RBtn>Edit Profile</RBtn>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-4 p-4'>
          <div className='space-y-2'>
            <RLabel htmlFor='name'>Name</RLabel>
            <RInput id='name' placeholder='Enter your name' />
          </div>
          <div className='space-y-2'>
            <RLabel htmlFor='email'>Email</RLabel>
            <RInput id='email' type='email' placeholder='Enter your email' />
          </div>
          <div className='space-y-2'>
            <RLabel htmlFor='bio'>Bio</RLabel>
            <RTextarea id='bio' placeholder='Tell us about yourself' rows={4} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <RBtn variant='outline'>Cancel</RBtn>
          </SheetClose>
          <RBtn>Save Changes</RBtn>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Sheet state: <strong>{open ? 'Open' : 'Closed'}</strong>
        </p>
        <div className='flex gap-2'>
          <RBtn onClick={() => setOpen(true)}>Open Sheet</RBtn>
          <RBtn variant='outline' onClick={() => setOpen(false)}>
            Close Sheet
          </RBtn>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Controlled Sheet</SheetTitle>
              <SheetDescription>
                This sheet is controlled by external state.
              </SheetDescription>
            </SheetHeader>
            <div className='p-4'>
              <p className='text-sm text-muted-foreground'>
                You can control the open state programmatically.
              </p>
            </div>
            <SheetFooter>
              <RBtn onClick={() => setOpen(false)}>Close</RBtn>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  },
};

export const NavigationMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <RBtn variant='outline'>Menu</RBtn>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className='flex flex-col gap-1 p-4'>
          {['Dashboard', 'Projects', 'Team', 'Settings', 'Help'].map((item) => (
            <SheetClose key={item} asChild>
              <button className='w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors'>
                {item}
              </button>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const ShoppingCart: Story = {
  render: () => {
    const cartItems = [
      { id: 1, name: 'Product A', price: 29.99, qty: 2 },
      { id: 2, name: 'Product B', price: 49.99, qty: 1 },
      { id: 3, name: 'Product C', price: 19.99, qty: 3 },
    ];

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    return (
      <Sheet>
        <SheetTrigger asChild>
          <RBtn>
            Cart ({cartItems.reduce((sum, item) => sum + item.qty, 0)})
          </RBtn>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>
              {cartItems.length} items in your cart
            </SheetDescription>
          </SheetHeader>
          <div className='flex-1 overflow-auto p-4'>
            <div className='space-y-4'>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between border-b pb-4'
                >
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      Qty: {item.qty}
                    </p>
                  </div>
                  <p className='font-semibold'>
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <SheetFooter className='border-t'>
            <div className='flex w-full items-center justify-between'>
              <span className='text-lg font-semibold'>Total</span>
              <span className='text-lg font-bold'>${total.toFixed(2)}</span>
            </div>
            <RBtn className='w-full'>Checkout</RBtn>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};

export const FilterPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <RBtn variant='outline'>Filters</RBtn>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down your search results.</SheetDescription>
        </SheetHeader>
        <div className='space-y-6 p-4'>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Category</h4>
            <div className='space-y-2'>
              {['Electronics', 'Clothing', 'Books', 'Home'].map((cat) => (
                <label key={cat} className='flex items-center gap-2'>
                  <input type='checkbox' className='rounded' />
                  <span className='text-sm'>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Price Range</h4>
            <div className='flex gap-2'>
              <RInput placeholder='Min' type='number' />
              <RInput placeholder='Max' type='number' />
            </div>
          </div>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Rating</h4>
            <div className='space-y-2'>
              {['4+ Stars', '3+ Stars', '2+ Stars'].map((rating) => (
                <label key={rating} className='flex items-center gap-2'>
                  <input type='radio' name='rating' />
                  <span className='text-sm'>{rating}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <RBtn variant='outline'>Reset</RBtn>
          </SheetClose>
          <SheetClose asChild>
            <RBtn>Apply Filters</RBtn>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const NotificationPanel: Story = {
  render: () => {
    const notifications = [
      {
        id: 1,
        title: 'New message',
        desc: 'You have a new message from John',
        time: '2 min ago',
      },
      {
        id: 2,
        title: 'Order shipped',
        desc: 'Your order #1234 has been shipped',
        time: '1 hour ago',
      },
      {
        id: 3,
        title: 'Payment received',
        desc: 'Payment of $99.00 received',
        time: '3 hours ago',
      },
    ];

    return (
      <Sheet>
        <SheetTrigger asChild>
          <RBtn variant='outline'>Notifications (3)</RBtn>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>You have 3 unread notifications</SheetDescription>
          </SheetHeader>
          <div className='flex-1 overflow-auto'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className='border-b p-4 hover:bg-muted/50 transition-colors cursor-pointer'
              >
                <div className='flex items-start justify-between'>
                  <p className='font-medium text-sm'>{notif.title}</p>
                  <span className='text-xs text-muted-foreground'>
                    {notif.time}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>
                  {notif.desc}
                </p>
              </div>
            ))}
          </div>
          <SheetFooter>
            <RBtn variant='ghost' className='w-full'>
              Mark all as read
            </RBtn>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
