import { RBrand } from '@/modules/app/components/base/r-brand';
import { RLoading } from '@/modules/app/components/base/r-loading';

export function AppBootstrapLoading() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-8 bg-auth text-slate-900'>
      <RBrand
        direction='vertical'
        align='center'
        className='text-center'
        showTagline={false}
        titleClassName='flowing-gradient-text text-4xl font-bold sm:text-5xl'
      />
      <RLoading label='Loading workspace…' />

      <style>{`
        @keyframes flowingGradient {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .flowing-gradient-text {
          background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6, #f59e0b, #3b82f6);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: flowingGradient 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
