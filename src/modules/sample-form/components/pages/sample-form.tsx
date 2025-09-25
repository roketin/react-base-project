import Button from '@/modules/app/components/ui/button';
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
      <div className='block mb-4'>
        <Button onClick={handleAdd}>Sample Form</Button>
      </div>
      Sample List
    </div>
  );
};
export default Todo;
