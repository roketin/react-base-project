import { RBrand } from '@/modules/app/components/base/r-brand';

export function AppBootstrapLoading() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 bg-pattern text-slate-900'>
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
