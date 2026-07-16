import React, { useState } from 'react';
import { type Transaction } from '../types';
import { Download, X } from 'lucide-react';

interface ExportDataProps {
  transactions: Transaction[];
}

const ExportData: React.FC<ExportDataProps> = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<string>('30'); // 'today', '7', '30', 'custom'
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const handleDownload = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    let startDate = new Date(today);
    let endDate = new Date(today);

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7') {
      startDate.setDate(today.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30') {
      startDate.setDate(today.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'custom') {
      if (!customStart || !customEnd) {
        alert('Please select both start and end dates.');
        return;
      }
      startDate = new Date(customStart);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(customEnd);
      endDate.setHours(23, 59, 59, 999);
      
      // Validation: Ensure custom date is within the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      
      if (startDate < thirtyDaysAgo) {
        alert('Custom date range must be within the last 30 days.');
        return;
      }
      if (startDate > endDate) {
        alert('Start date cannot be after end date.');
        return;
      }
    }

    // Filter transactions
    const filteredTx = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      // Ensure we compare just the date part properly
      txDate.setHours(12, 0, 0, 0); 
      return txDate >= startDate && txDate <= endDate;
    });

    if (filteredTx.length === 0) {
      alert('No transactions found in this date range.');
      return;
    }

    // Generate CSV
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = filteredTx.map(tx => [
      tx.date,
      tx.type,
      `"${tx.category}"`, // Escape commas
      tx.amount,
      `"${(tx.description || '').replace(/"/g, '""')}"` // Escape quotes and commas
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md font-medium transition-colors text-sm border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <Download size={16} className="text-slate-500 dark:text-slate-400" />
        Export
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-md shadow-xl border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-all w-full max-w-sm">
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-5 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
          <Download size={18} className="text-slate-500 dark:text-slate-400" />
          Export Data
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Date Range</label>
            <select 
              value={range} 
              onChange={(e) => setRange(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {range === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                <input 
                  type="date" 
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
          )}
          
          <button 
            type="button"
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors text-sm shadow-sm flex justify-center items-center gap-2"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportData;
