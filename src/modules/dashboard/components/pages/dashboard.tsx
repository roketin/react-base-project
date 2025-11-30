import RStatisticDashboard, {
  type TRStatisticMetric,
} from '@/modules/app/components/base/r-statistic-dashboard';
import { RCard } from '@/modules/app/components/base/r-card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  RTable,
  RTbody,
  RTd,
  RTh,
  RThead,
} from '@/modules/app/components/base/r-simple-table';
import { RTableRow } from '@/modules/app/components/base/r-table-simple';

const Dashboard = () => {
  // Mock Data for Stats
  const stats: TRStatisticMetric[] = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: 'IDR 150.000.000',
      icon: <DollarSign className='size-5' />,
      trend: {
        value: '12%',
        direction: 'up',
        label: 'vs last month',
      },
    },
    {
      id: 'users',
      label: 'Active Users',
      value: '1,234',
      icon: <Users className='size-5' />,
      trend: {
        value: '5%',
        direction: 'up',
        label: 'vs last month',
      },
    },
    {
      id: 'orders',
      label: 'New Orders',
      value: '56',
      icon: <ShoppingCart className='size-5' />,
      trend: {
        value: '2%',
        direction: 'down',
        label: 'vs yesterday',
      },
    },
    {
      id: 'growth',
      label: 'Growth',
      value: '+12.5%',
      icon: <TrendingUp className='size-5' />,
      trend: {
        value: '1%',
        direction: 'up',
        label: 'vs last week',
      },
    },
  ];

  // Mock Data for Chart
  const chartData = [
    { name: 'Jan', total: 12000000 },
    { name: 'Feb', total: 18000000 },
    { name: 'Mar', total: 15000000 },
    { name: 'Apr', total: 22000000 },
    { name: 'May', total: 28000000 },
    { name: 'Jun', total: 25000000 },
    { name: 'Jul', total: 32000000 },
  ];

  // Mock Data for Recent Activity
  const recentActivity = [
    {
      id: 'TRX-9871',
      user: 'Imam Stevano',
      status: 'Completed',
      amount: 'IDR 250.000',
      date: '20 Nov 2025, 10:00',
    },
    {
      id: 'TRX-9872',
      user: 'Teguh Muhammad Zundi',
      status: 'Pending',
      amount: 'IDR 1.200.000',
      date: '20 Nov 2025, 10:15',
    },
    {
      id: 'TRX-9873',
      user: 'Naufal Al-Ghifarri',
      status: 'Completed',
      amount: 'IDR 750.000',
      date: '20 Nov 2025, 11:30',
    },
    {
      id: 'TRX-9874',
      user: 'Rafli Jatnika',
      status: 'Failed',
      amount: 'IDR 500.000',
      date: '20 Nov 2025, 12:45',
    },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <RStatisticDashboard metrics={stats} columns={4} className='mb-4' />

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Chart Section */}
        <RCard
          description='Transaction Overview'
          header={
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold leading-none tracking-tight'>
                Revenue Overview
              </h3>
              <Activity className='text-muted-foreground size-4' />
            </div>
          }
          className='col-span-4'
        >
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%' debounce={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='name'
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `IDR ${value / 1000000}M`}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar
                  dataKey='total'
                  fill='var(--primary)'
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </RCard>

        {/* Recent Activity Table */}
        <RCard
          title='Recent Activity'
          description='Latest transactions from users.'
          className='col-span-3'
        >
          <RTable>
            <RThead>
              <RTableRow>
                <RTh>User</RTh>
                <RTh>Status</RTh>
                <RTh className='text-right'>Amount</RTh>
              </RTableRow>
            </RThead>
            <RTbody>
              {recentActivity.map((item) => (
                <RTableRow key={item.id}>
                  <RTd>
                    <div className='font-medium'>{item.user}</div>
                    <div className='text-muted-foreground text-xs hidden md:inline'>
                      {item.id}
                    </div>
                  </RTd>
                  <RTd>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </RTd>
                  <RTd className='text-right font-medium'>{item.amount}</RTd>
                </RTableRow>
              ))}
            </RTbody>
          </RTable>
        </RCard>
      </div>
    </div>
  );
};

export default Dashboard;
