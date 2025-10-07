import StatusPage from '@/modules/app/components/pages/status-page';
import Button from '@/modules/app/components/ui/button';

const AppForbidden = () => {
  return (
    <StatusPage
      code='403'
      title='Access denied'
      description='You do not have permission to view this page. If you believe this is a mistake, please contact your administrator.'
      action={<Button onClick={() => window.history.back()}>Go Back</Button>}
    />
  );
};

export default AppForbidden;
