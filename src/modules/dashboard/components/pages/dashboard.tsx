import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Count:', count);
  }, [count]);

  return (
    <div>
      <p>Count is {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default Dashboard;
