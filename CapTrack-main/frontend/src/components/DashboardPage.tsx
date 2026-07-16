import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import ExportData from './ExportData';
import { type Transaction } from '../types';
import { getTransactions, createTransaction, deleteTransaction } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Wallet, Moon, Sun } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreateTransaction = async (transaction: Transaction) => {
    try {
      const newTx = await createTransaction(transaction);
      setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      console.error('Failed to create transaction:', err);
      alert('Failed to save transaction');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Failed to delete transaction');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 dark:bg-blue-500 p-1.5 rounded-md text-white">
                <Wallet size={20} />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">CapTrack</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Welcome, {user?.name || user?.email}
              </div>
              
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md font-medium transition-colors border border-transparent"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-8">
            <section>
              <Dashboard transactions={transactions}>
                <TransactionForm onSubmit={handleCreateTransaction} />
              </Dashboard>
            </section>
            
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Transactions</h2>
                <ExportData transactions={transactions} />
              </div>
              {loading ? (
                <div className="h-48 flex items-center justify-center bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="animate-pulse flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">Loading transactions...</span>
                  </div>
                </div>
              ) : (
                <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
              )}
            </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
