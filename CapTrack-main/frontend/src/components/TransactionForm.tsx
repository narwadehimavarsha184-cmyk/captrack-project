import React, { useState } from 'react';
import { TransactionType, type Transaction } from '../types';
import { PlusCircle, X } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
}

const CATEGORIES = [
  'Cost of Goods', 
  'Operating Expenses', 
  'Marketing', 
  'Client Revenue',
  'Salary',
  'Software Subscriptions',
  'Other'
];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[3]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) return;

    onSubmit({
      type,
      amount: Number(amount),
      category,
      date,
      description
    });
    
    // Reset form and close
    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors text-sm border border-transparent shadow-sm"
      >
        <PlusCircle size={18} />
        Add Transaction
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-md shadow-xl border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-all w-full max-w-lg">
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={20} />
        </button>
      
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">New Transaction</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <div className="flex rounded-md border border-slate-300 dark:border-slate-600 overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => { setType(TransactionType.INCOME); setCategory('Client Revenue'); }}
              >
                Income
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-600 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => { setType(TransactionType.EXPENSE); setCategory('Operating Expenses'); }}
              >
                Expense
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="What was this for?"
          />
        </div>
        
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors text-sm shadow-sm"
          >
            Save Transaction
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default TransactionForm;
