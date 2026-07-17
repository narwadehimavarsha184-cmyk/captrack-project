export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description?: string;
}