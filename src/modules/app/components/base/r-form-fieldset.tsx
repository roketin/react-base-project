// Type for RFormFieldSet props
type RFormFieldSetProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical'; // Default: horizontal
  isSticky?: boolean; // Only applies to 'horizontal' layout
  // Prop to set the width of the title column.
  // Can be relative (e.g., 'lg:w-1/3') or fixed (e.g., 'lg:w-64' or 'lg:w-[200px]').
  titleWidth?: string;
};

export const RFormFieldSet: React.FC<RFormFieldSetProps> = ({
  title,
  subtitle,
  children,
  layout = 'horizontal',
  isSticky = false,
  titleWidth = 'lg:w-1/3', // Default ratio: 1/3 for title, 2/3 for content
}) => {
  const isHorizontal = layout === 'horizontal';

  // Base classes for the layout
  // Horizontal layout uses flex on large screens to allow dynamic width classes (titleWidth).
  // Vertical layout is always full-width stack.
  const containerClasses = isHorizontal
    ? 'lg:flex lg:gap-6 py-6'
    : 'flex flex-col py-6 space-y-2';

  // Classes for the title/description area
  // isSticky only applies to large screens (lg:)
  const titleContainerClasses = isHorizontal
    ? `${titleWidth} pr-4 flex-shrink-0 ${isSticky ? 'lg:sticky lg:top-0 lg:self-start pt-2' : ''}`
    : 'pb-1';

  // Classes for the input/children area
  // In horizontal mode, it uses flex-grow-1 to take up the remaining space.
  const contentContainerClasses = isHorizontal ? 'lg:flex-grow' : 'w-full';

  return (
    <div className={containerClasses}>
      {/* Title and Subtitle Area */}
      <div className={titleContainerClasses}>
        <h3
          className={`text-lg font-semibold text-gray-900 ${isHorizontal ? '' : 'lg:text-xl'}`}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={`mt-1 text-sm text-gray-500 ${isHorizontal ? '' : 'lg:text-base'}`}
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
  );
};
