import { useModuleOptions } from '@/modules/app/hooks/use-searchable-items';
import { useGlobalSearchStore } from '@/modules/app/stores/global-search.store';
import { cn } from '@/modules/app/libs/utils';

export function RSearchModuleFilter() {
  const moduleOptions = useModuleOptions();
  const { selectedModule, setSelectedModule } = useGlobalSearchStore();

  return (
    <select
      value={selectedModule || 'all'}
      onChange={(e) =>
        setSelectedModule(e.target.value === 'all' ? null : e.target.value)
      }
      className={cn(
        'h-[var(--form-height)] px-[var(--form-padding-x)] py-1',
        'w-[120px] rounded-[var(--form-radius)]',
        'border border-[var(--form-border-color)] bg-[var(--form-bg)]',
        'text-[length:var(--form-font-size)] text-[var(--form-text)]',
        'shadow-[var(--form-shadow)]',
        'outline-none focus:ring-2 focus:ring-[var(--form-focus-ring)]/50 focus:border-[var(--form-focus-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-[var(--form-disabled-opacity)]',
        'cursor-pointer',
      )}
    >
      {moduleOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
