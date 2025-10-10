import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Languages } from 'lucide-react';
import roketinConfig from '@config';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/modules/app/components/ui/popover';
import { cn } from '@/modules/app/libs/utils';
import { toast } from 'sonner';
import RBtn from '@/modules/app/components/base/r-btn';

type TRLangSwitcherProps = {
  buttonVariant?: React.ComponentProps<typeof RBtn>['variant'];
  buttonSize?: React.ComponentProps<typeof RBtn>['size'];
  align?: 'start' | 'center' | 'end';
  className?: string;
  showCode?: boolean;
};

const RLangSwitcher = ({
  buttonVariant = 'outline',
  buttonSize = 'sm',
  align = 'end',
  className,
  showCode = true,
}: TRLangSwitcherProps) => {
  // Retrieve supported languages configuration from roketinConfig
  const languagesConfig = roketinConfig.languages;

  // Access i18n instance for language management
  const { i18n } = useTranslation('app');

  // State to control whether the language popover is open or closed
  const [open, setOpen] = useState(false);

  // Memoize the supported languages list to avoid unnecessary recalculations
  const languages = useMemo(
    () => languagesConfig?.supported ?? [],
    [languagesConfig],
  );

  // Determine the default language from the supported languages list
  const defaultLanguage = useMemo(() => {
    if (languages.length === 0) return undefined;
    return languages.find((lang) => lang.isDefault) ?? languages[0];
  }, [languages]);

  // Determine the current language based on i18n's active language or fallback to default
  const currentLanguage = useMemo(() => {
    if (!defaultLanguage) return undefined;
    return (
      languages.find((lang) => lang.code === i18n.language) ?? defaultLanguage
    );
  }, [defaultLanguage, i18n.language, languages]);

  // Decide if the language switcher should be rendered based on config and available languages
  const shouldRender = useMemo<boolean>(
    () =>
      Boolean(languagesConfig?.enabled) &&
      languages.length > 1 &&
      Boolean(currentLanguage),
    [currentLanguage, languages.length, languagesConfig?.enabled],
  );

  // This function handles changing the current language and closes the popover
  const handleSelect = useCallback(
    (code: string) => {
      if (code === i18n.language) {
        setOpen(false);
        return;
      }
      void i18n.changeLanguage(code);
      setOpen(false);

      toast.success('Language switched to ' + code, {
        cancel: {
          label: 'Close',
          onClick() {},
        },
      });
    },
    [i18n],
  );

  if (!shouldRender || !currentLanguage) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <RBtn
          variant={buttonVariant}
          size={buttonSize}
          className={cn('inline-flex items-center gap-2', className)}
        >
          <Languages className='size-4' />
          <span className='text-xs font-semibold'>
            {showCode
              ? currentLanguage.code.toUpperCase()
              : currentLanguage.label}
          </span>
          <ChevronDown />
        </RBtn>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className='w-44 border-border/70 p-1 shadow-lg'
      >
        {/* ✅ Render the list of available languages with active language highlighted */}
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
};

export default RLangSwitcher;
