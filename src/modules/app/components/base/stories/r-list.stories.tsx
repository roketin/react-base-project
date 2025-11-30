import type { Meta, StoryObj } from '@storybook/react-vite';
import { RBadge } from '../r-badge';
import { RList, type TRListProps } from '../r-list';
import RBtn from '@/modules/app/components/base/r-btn';

type ListItem = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
};

const ITEMS: ListItem[] = [
  {
    id: '1',
    title: 'Design standup',
    description: 'Daily sync with the design team to review priorities.',
    tags: ['Team', 'Daily'],
  },
  {
    id: '2',
    title: 'Product spec review',
    description: 'Finalize acceptance criteria for the onboarding flow revamp.',
    tags: ['Product'],
  },
  {
    id: '3',
    title: 'Research interview',
    description: 'Interview candidate #12 about the new payments experience.',
    tags: ['Research', 'Customer'],
  },
];

type ListStoryProps = TRListProps<ListItem>;

const ListStoryComponent = (props: ListStoryProps) => (
  <RList<ListItem> {...props} />
);

const meta: Meta<typeof ListStoryComponent> = {
  title: 'Components/Other/RList',
  component: ListStoryComponent,
  tags: ['autodocs'],
  args: {
    items: ITEMS,
    renderItem: (item) => (
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <span className='font-medium'>{item.title}</span>
          <RBtn size='xs' variant='ghost'>
            View
          </RBtn>
        </div>
        <p className='text-sm text-muted-foreground'>{item.description}</p>
        {item.tags?.length ? (
          <div className='flex flex-wrap gap-1'>
            {item.tags.map((tag) => (
              <RBadge key={tag} variant='outline'>
                {tag}
              </RBadge>
            ))}
          </div>
        ) : null}
      </div>
    ),
  },
  argTypes: {
    virtual: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ListStoryComponent>;

export const Basic: Story = {};

export const Empty: Story = {
  args: {
    items: [],
    emptyContent: (
      <div className='rounded-lg border border-dashed border-border/60 px-6 py-8 text-center text-sm text-muted-foreground'>
        No meetings scheduled. Create one to get started.
      </div>
    ),
  },
};

type UserRow = {
  id: number;
  name: string;
  email: string;
};

const largeDataset: UserRow[] = Array.from({ length: 100000 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
}));

export const Virtualized: Story = {
  render: () => (
    <RList<UserRow>
      items={largeDataset}
      virtual={{ enabled: true, height: 320, itemHeight: 72, overscan: 6 }}
      getKey={(item) => item.id}
      renderItem={(item) => (
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-medium'>{item.name}</p>
            <p className='text-sm text-muted-foreground'>{item.email}</p>
          </div>
          <RBtn size='sm' variant='outline'>
            Invite
          </RBtn>
        </div>
      )}
    />
  ),
};
