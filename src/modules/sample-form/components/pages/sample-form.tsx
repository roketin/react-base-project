import Button from '@/modules/app/components/ui/button';
import { Separator } from '@/modules/app/components/ui/separator';
import { useNamedRoute } from '@/modules/app/hooks/use-named-route';
import { useCallback } from 'react';

const Todo = () => {
  const { navigate } = useNamedRoute();

  /**
   * Redirect to add page
   */
  const handleAdd = useCallback(() => {
    navigate('SampleFormAdd');
  }, [navigate]);

  return (
    <div>
      <div className='block'>
        <Button onClick={handleAdd}>Add Page</Button>
      </div>
      <Separator className='my-4' />
      Data Table (Coming Soon)
    </div>
  );
};
export default Todo;
