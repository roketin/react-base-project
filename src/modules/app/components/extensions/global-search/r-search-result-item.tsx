import { CommandItem } from '@/modules/app/components/ui/command';
import type { SearchableItem } from '@/modules/app/types/global-search.type';
import { cn } from '@/modules/app/libs/utils';
import { FileText, Zap } from 'lucide-react';

type SearchResultItemProps = {
  item: SearchableItem;
  onSelect: (item: SearchableItem) => void;
};

export function RSearchResultItem({ item, onSelect }: SearchResultItemProps) {
  const isAction = item.type === 'action';
  const isCommand = item.type === 'command';
  const isSpecial = isAction || isCommand;
  const badge = isSpecial ? item.badge : undefined;

  // Use item icon or default icon based on type
  const Icon = item.icon || (isSpecial ? Zap : FileText);

  return (
    <CommandItem
      value={item.id}
      onSelect={() => onSelect(item)}
      className='flex items-center gap-3 px-3 py-2.5 cursor-pointer'
    >
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-md',
          isSpecial ? 'bg-primary/10' : 'bg-muted',
        )}
      >
        <Icon
          className={cn(
            'w-4 h-4',
            isSpecial ? 'text-primary' : 'text-muted-foreground',
          )}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='font-medium text-sm truncate'>{item.title}</span>
          {badge && (
            <span className='inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
              {badge}
            </span>
          )}
        </div>
        <div className='text-xs text-muted-foreground truncate'>
          {item.moduleTitle}
        </div>
      </div>
      <kbd
        className={cn(
          'hidden sm:inline-flex h-5 select-none items-center gap-1',
          'rounded border bg-muted px-1.5 font-mono text-[10px] font-medium',
          'text-muted-foreground opacity-100',
        )}
      >
        <span className='text-xs'>↵</span>
      </kbd>
    </CommandItem>
  );
}
