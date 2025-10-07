import StatusPage from '@/modules/app/components/pages/status-page';
import Button from '@/modules/app/components/ui/button';

const AppGlobalError = () => {
  return (
    <StatusPage
      code='500'
      title='Something went wrong'
      description='An unexpected error occurred. Please try again or contact support if the problem persists.'
      action={
        <Button onClick={() => window.location.reload()}>Try again</Button>
      }
    />
  );
};
export default AppGlobalError;
