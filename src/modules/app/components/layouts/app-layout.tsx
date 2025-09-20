import AppLayoutHeader from '@/modules/app/components/layouts/app-layout-header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <AppLayoutHeader />
      <div>AppLayout</div>
      <Outlet />
    </div>
  );
};
export default AppLayout;
