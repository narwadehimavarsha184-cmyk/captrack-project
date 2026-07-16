export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description?: string;
}
