import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Languages } from 'lucide-react';
import roketinConfig from '@config';
import Button from '@/modules/app/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { cn } from '@/modules/app/libs/utils';

type LanguageSwitcherProps = {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  buttonSize?: React.ComponentProps<typeof Button>['size'];
  align?: 'start' | 'center' | 'end';
  className?: string;
  showCode?: boolean;
};

export function LanguageSwitcher({
  buttonVariant = 'outline',
  buttonSize = 'sm',
  align = 'end',
  className,
  showCode = true,
}: LanguageSwitcherProps) {
  const languagesConfig = roketinConfig.languages;
  const { i18n } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const languages = useMemo(
    () => languagesConfig?.supported ?? [],
    [languagesConfig],
  );

  const defaultLanguage = useMemo(() => {
    if (languages.length === 0) return undefined;
    return languages.find((lang) => lang.isDefault) ?? languages[0];
  }, [languages]);

  const currentLanguage = useMemo(() => {
    if (!defaultLanguage) return undefined;
    return (
      languages.find((lang) => lang.code === i18n.language) ?? defaultLanguage
    );
  }, [defaultLanguage, i18n.language, languages]);

  const shouldRender =
    Boolean(languagesConfig?.enabled) &&
    languages.length > 1 &&
    Boolean(currentLanguage);

  const handleSelect = useCallback(
    (code: string) => {
      if (code === i18n.language) {
        setOpen(false);
        return;
      }
      void i18n.changeLanguage(code);
      setOpen(false);
    },
    [i18n],
  );

  if (!shouldRender || !currentLanguage) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={cn('flex items-center gap-2', className)}
        >
          <Languages className='size-4' />
          <span className='text-xs font-semibold'>
            {showCode
              ? currentLanguage.code.toUpperCase()
              : currentLanguage.label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className='w-44 border-border/70 p-1 shadow-lg'
      >
        <div className='flex flex-col'>
          {languages.map((lang) => {
            const isActive = lang.code === currentLanguage.code;
            return (
              <button
                key={lang.code}
                type='button'
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  'flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-muted',
                  isActive && 'bg-primary/10 text-primary',
                )}
              >
                <div className='flex flex-col items-start'>
                  <span className='font-medium leading-tight'>
                    {lang.label}
                  </span>
                  <span className='text-xs uppercase text-muted-foreground'>
                    {lang.code}
                  </span>
                </div>
                {isActive ? <Check className='size-4' /> : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
