import { useEffect, useState } from 'react';

const Home = () => {
  const [count, setCount] = useState(0);

  // ❌ Ini seharusnya trigger error dari react-hooks/exhaustive-deps
  useEffect(() => {
    console.log('Count:', count);
  }, [count]); // <-- count tidak masuk ke dependency array

  return (
    <div>
      <p>Count is {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
};

export default Home;
