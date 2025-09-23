import Button from '@/modules/app/components/ui/button';
import { useState } from 'react';

const Dashboard = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className='mb-3'>Count is {count}</p>
      <Button size='sm' onClick={() => setCount((c) => c + 1)}>
        Increment
      </Button>
    </div>
  );
};

export default Dashboard;
