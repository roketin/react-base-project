import { Search } from 'lucide-react';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { cn } from '@/modules/app/libs/utils';
import RBtn from '@/modules/app/components/base/r-btn';
import { useTranslation } from 'react-i18next';

export function RGlobalSearchTrigger() {
  const { t } = useTranslation();
  const { setIsOpen } = useGlobalSearchStore();

  return (
    <RBtn
      variant='outline'
      className={cn(
        'relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground',
        'sm:pr-12 w-full md:max-w-90',
      )}
      onClick={() => setIsOpen(true)}
    >
      <Search className='mr-2 h-4 w-4' />
      <span className='hidden lg:inline-flex'>{t('search.triggerLong')}</span>
      <span className='inline-flex lg:hidden'>{t('search.triggerShort')}</span>
      <kbd
        className={cn(
          'pointer-events-none absolute right-1.5 top-1.5',
          'hidden h-6 select-none items-center gap-1 rounded border',
          'bg-muted px-1.5 font-mono text-[10px] font-medium',
          'opacity-100 sm:flex',
        )}
      >
        <span className='text-xs'>⌘</span>K
      </kbd>
    </RBtn>
  );
}
