import StatusPage from '@/modules/app/components/pages/status-page';
import Button from '@/modules/app/components/ui/button';

const AppNotFound = () => {
  return (
    <StatusPage
      code='404'
      title='Page not found'
      description="The page you're looking for could not be found or may have been moved."
      action={
        <Button onClick={() => (window.location.href = '/')}>
          Back to Home
        </Button>
      }
    />
  );
};
export default AppNotFound;
