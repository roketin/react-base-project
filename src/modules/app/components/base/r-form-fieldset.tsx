import { RSeparator } from '@/modules/app/components/base/r-separator';
import { useFormConfig } from '@/modules/app/contexts/form-config-context';

// Type for RFormFieldSet props
type RFormFieldSetProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical'; // Default: horizontal
  isSticky?: boolean; // Only applies to 'horizontal' layout
  stickyOffset?: number; // Offset from top when sticky (default: 0)
  // Prop to set the width of the title column.
  // Can be relative (e.g., 'lg:w-1/3') or fixed (e.g., 'lg:w-64' or 'lg:w-[200px]').
  titleWidth?: string;
  divider?: boolean; // Show divider line at bottom
  id?: string; // Optional id for anchor navigation
};

export const RFormFieldSet: React.FC<RFormFieldSetProps> = ({
  title,
  subtitle,
  children,
  layout,
  isSticky,
  stickyOffset,
  titleWidth,
  divider,
  id,
}) => {
  const formConfig = useFormConfig();

  // Merge props with form config (props take precedence)
  const finalLayout =
    layout ?? formConfig.fieldsetConfig?.layout ?? 'horizontal';
  const finalIsSticky =
    isSticky ?? formConfig.fieldsetConfig?.isSticky ?? false;
  const finalStickyOffset =
    stickyOffset ?? formConfig.fieldsetConfig?.stickyOffset ?? 0;
  const finalTitleWidth =
    titleWidth ?? formConfig.fieldsetConfig?.titleWidth ?? 'lg:w-80';
  const finalDivider = divider ?? formConfig.fieldsetConfig?.divider ?? false;

  const isHorizontal = finalLayout === 'horizontal';

  // Base classes for the layout
  // Horizontal layout uses flex on large screens to allow dynamic width classes (titleWidth).
  // Vertical layout is always full-width stack.
  const containerClasses = isHorizontal
    ? 'lg:flex lg:gap-6 py-6'
    : 'flex flex-col py-6 space-y-2';

  // Classes for the title/description area
  // isSticky only applies to large screens (lg:)
  const titleContainerClasses = isHorizontal
    ? `${finalTitleWidth} pr-4 flex-shrink-0 ${finalIsSticky ? 'lg:sticky lg:self-start pt-2' : ''}`
    : 'pb-1';

  // Inline style for sticky offset
  const titleStyle =
    finalIsSticky && isHorizontal
      ? { top: `${finalStickyOffset}px` }
      : undefined;

  // Classes for the input/children area
  // In horizontal mode, it uses flex-grow-1 to take up the remaining space.
  const contentContainerClasses = isHorizontal ? 'lg:flex-grow' : 'w-full';

  return (
    <div id={id}>
      <div className={containerClasses}>
        {/* Title and Subtitle Area */}
        <div className={titleContainerClasses} style={titleStyle}>
          <h3
            className={`text-md font-semibold text-foreground ${isHorizontal ? '' : 'lg:text-xl'}`}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={`mt-1 text-xs text-muted-foreground ${isHorizontal ? '' : 'lg:text-base'}`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Content Area */}
        <div className={contentContainerClasses}>
          {/* Form content wrapper with simplified style (p-0). */}
          {isHorizontal ? (
            <div className='p-0'>{children}</div>
          ) : (
            <div className='w-full'>{children}</div>
          )}
        </div>
      </div>

      {/* Divider */}
      {finalDivider && <RSeparator />}
    </div>
  );
};
