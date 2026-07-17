import React, { useMemo } from 'react';
import { TransactionType, type Transaction } from '../types';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, children }) => {
  const { totalRevenue, totalExpenses, netProfit, chartData } = useMemo(() => {
    let revenue = 0;
    let expenses = 0;
    
    // Sort transactions by date and id for chronological order
    const sortedTx = [...transactions].sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff === 0 && a.id && b.id) return a.id - b.id;
      return dateDiff;
    });

    let runningNet = 0;
    const data: any[] = [];
    
    if (sortedTx.length > 0) {
      const earliestDate = new Date(sortedTx[0].date);
      earliestDate.setDate(earliestDate.getDate() - 1);
      data.push({
        id: 'start',
        displayDate: earliestDate.toISOString().split('T')[0],
        change: 0,
        net: 0,
        label: 'Start'
      });
    }

    sortedTx.forEach((tx, index) => {
      const amount = Number(tx.amount);
      const isIncome = tx.type === TransactionType.INCOME;
      
      if (isIncome) {
        revenue += amount;
        runningNet += amount;
      } else {
        expenses += amount;
        runningNet -= amount;
      }
      
      data.push({
        id: `tx-${index}`,
        displayDate: tx.date,
        change: isIncome ? amount : -amount,
        net: runningNet,
        label: tx.description || tx.category || `Tx ${index + 1}`
      });
    });

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      chartData: data
    };
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-100 dark:border-slate-700 shadow-lg rounded-xl">
          <p className="font-semibold text-slate-800 dark:text-white mb-1">{data.displayDate}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{data.label}</p>
          <p className="text-sm font-medium">
            <span className="text-slate-500 dark:text-slate-400">Transaction: </span>
            <span className={data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.change >= 0 ? '+' : '-'}${Math.abs(data.change).toFixed(2)}
            </span>
          </p>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Cumulative: ${data.net.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded text-blue-600 dark:text-blue-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded text-red-600 dark:text-red-400">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded text-indigo-600 dark:text-indigo-400">
              <DollarSign size={20} />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Balance</h3>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">Cash Flow Over Time</h3>
          {children}
        </div>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} opacity={0.3} />
<XAxis
  dataKey="id"
  stroke="#94a3b8"
  fontSize={12}
  tickLine={false}
  axisLine={false}
  tickFormatter={(_, index) => chartData[index]?.displayDate || ''}
/>                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="change" radius={[4, 4, 4, 4]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'currentColor' }} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                  className="text-white dark:text-slate-800"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500">
              No data available to display chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
