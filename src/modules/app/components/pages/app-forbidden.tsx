import StatusPage from '@/modules/app/components/pages/status-page';
import RBtn from '@/modules/app/components/base/r-btn';

const AppForbidden = () => {
  return (
    <StatusPage
      code='403'
      title='Access denied'
      description='You do not have permission to view this page. If you believe this is a mistake, please contact your administrator.'
      action={<RBtn onClick={() => window.history.back()}>Go Back</RBtn>}
    />
  );
};

export default AppForbidden;
