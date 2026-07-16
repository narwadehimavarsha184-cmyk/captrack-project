import React from 'react';
import { TransactionType, type Transaction } from '../types';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white">Transaction History</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          No transactions found. Add one to get started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {tx.description || '-'}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-right ${tx.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {tx.type === TransactionType.INCOME ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-sm text-center">
                    <button 
                      type="button"
                      onClick={() => tx.id && onDelete(tx.id)}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 inline-flex items-center justify-center"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
