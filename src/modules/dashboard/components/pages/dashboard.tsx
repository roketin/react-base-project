import RBtn from '@/modules/app/components/base/r-btn';
import { PackageMinus, PackagePlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  // Translation
  const { t } = useTranslation('dashboard');

  const [count, setCount] = useState(0);

  return (
    <div>
      <p className='mb-3'>
        {t('count')}:{count}
      </p>

      <div className='space-x-2'>
        <RBtn
          iconStart={<PackagePlus />}
          onClick={() => setCount((c) => c + 1)}
        >
          {t('increment')}
        </RBtn>
        <RBtn
          iconStart={<PackageMinus />}
          onClick={() => setCount((c) => c - 1)}
        >
          {t('decrement')}
        </RBtn>
      </div>
    </div>
  );
};

export default Dashboard;
