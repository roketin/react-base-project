import { RBrand } from '@/modules/app/components/base/r-brand';
import { useSidebar } from '../../contexts/sidebar-context';
import { Link } from 'react-router-dom';
import { useNamedRoute } from '../../hooks/use-named-route';
import { cn } from '../../libs/utils';
import { RSidebarHeader } from '@/modules/app/components/base/r-sidebar';

const AppSidebarHeader = () => {
  const { isCollapsed } = useSidebar();
  const { linkTo } = useNamedRoute();

  if (isCollapsed) {
    return null;
  }

  return (
    <RSidebarHeader
      className={cn('transition-all duration-300 backface-visible pb-1 mt-2')}
    >
      <Link to={linkTo('DashboardIndex')}>
        <RBrand
          subtitleClassName='text-xs text-sidebar-foreground/60 whitespace-nowrap'
          titleClassName='text-base font-semibold leading-tight text-sidebar-foreground whitespace-nowrap'
          iconClassName='size-10'
        />
      </Link>
    </RSidebarHeader>
  );
};
export default AppSidebarHeader;
