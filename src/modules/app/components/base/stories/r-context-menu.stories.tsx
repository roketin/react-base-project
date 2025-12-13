import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
} from '../r-context-menu';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Share,
  Download,
  Edit,
  Eye,
  EyeOff,
  Star,
  Archive,
  Mail,
  MessageSquare,
  Twitter,
  Facebook,
} from 'lucide-react';

const meta: Meta = {
  title: 'Components/Overlay/RContextMenu',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Edit className='mr-2 h-4 w-4' />
          Edit
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className='mr-2 h-4 w-4' />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard className='mr-2 h-4 w-4' />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [showHidden, setShowHidden] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    return (
      <ContextMenu>
        <ContextMenuTrigger className='flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
          Right click for view options
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showHidden}
            onCheckedChange={setShowHidden}
          >
            {showHidden ? (
              <Eye className='mr-2 h-4 w-4' />
            ) : (
              <EyeOff className='mr-2 h-4 w-4' />
            )}
            Show Hidden Files
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showPreview}
            onCheckedChange={setShowPreview}
          >
            Show Preview Panel
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithRadioGroup: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState('name');

    return (
      <ContextMenu>
        <ContextMenuTrigger className='flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
          Right click to sort
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Sort By</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
            <ContextMenuRadioItem value='name'>Name</ContextMenuRadioItem>
            <ContextMenuRadioItem value='date'>
              Date Modified
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value='size'>Size</ContextMenuRadioItem>
            <ContextMenuRadioItem value='type'>Type</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithSubMenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className='flex h-40 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
        Right click for more options
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Star className='mr-2 h-4 w-4' />
          Add to Favorites
        </ContextMenuItem>
        <ContextMenuItem>
          <Archive className='mr-2 h-4 w-4' />
          Archive
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Share className='mr-2 h-4 w-4' />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <Mail className='mr-2 h-4 w-4' />
              Email
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquare className='mr-2 h-4 w-4' />
              Message
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <Twitter className='mr-2 h-4 w-4' />
              Twitter
            </ContextMenuItem>
            <ContextMenuItem>
              <Facebook className='mr-2 h-4 w-4' />
              Facebook
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem>
          <Download className='mr-2 h-4 w-4' />
          Download
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const FileExplorer: Story = {
  render: () => {
    const [starred, setStarred] = useState(false);

    return (
      <div className='grid grid-cols-3 gap-4'>
        {['Document.pdf', 'Image.png', 'Video.mp4'].map((file) => (
          <ContextMenu key={file}>
            <ContextMenuTrigger className='flex h-24 w-24 flex-col items-center justify-center rounded-lg border bg-muted/50 p-2 text-xs hover:bg-muted'>
              <div className='mb-2 h-8 w-8 rounded bg-primary/20' />
              {file}
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <Eye className='mr-2 h-4 w-4' />
                Open
              </ContextMenuItem>
              <ContextMenuItem>
                <Edit className='mr-2 h-4 w-4' />
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <Scissors className='mr-2 h-4 w-4' />
                Cut
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={starred}
                onCheckedChange={setStarred}
              >
                <Star className='mr-2 h-4 w-4' />
                Star
              </ContextMenuCheckboxItem>
              <ContextMenuSeparator />
              <ContextMenuItem destructive>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    );
  },
};
