import { RBrand } from '@/modules/app/components/base/r-brand';
import { useTheme } from '@/modules/app/hooks/use-theme';

export function AppBootstrapLoading() {
  // Initialize theme
  useTheme();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 text-foreground'>
      <RBrand
        direction='vertical'
        align='center'
        className='text-center'
        showTagline={false}
        titleClassName='flowing-gradient-text text-4xl font-bold sm:text-5xl mb-0'
      />
      <span className='flowing-gradient-text'>Preparing your workspace...</span>
    </div>
  );
}
