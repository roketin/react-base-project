import StatusPage from '@/modules/app/components/pages/status-page';
import RBtn from '@/modules/app/components/base/r-btn';

const AppNotFound = () => {
  return (
    <StatusPage
      title='Page not found'
      description="The page you're looking for could not be found or may have been moved."
      action={
        <RBtn onClick={() => (window.location.href = '/')}>Back to Home</RBtn>
      }
    />
  );
};
export default AppNotFound;
