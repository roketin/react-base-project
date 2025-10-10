import RBtn from '@/modules/app/components/base/r-btn';
import { useState } from 'react';

const Dashboard = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className='mb-3'>Count is {count}</p>
      <RBtn size='sm' onClick={() => setCount((c) => c + 1)}>
        Increment
      </RBtn>
    </div>
  );
};

export default Dashboard;
