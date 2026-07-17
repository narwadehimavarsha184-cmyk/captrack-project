import axios from 'axios';
import { type Transaction } from '../types';



const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/transactions');
  return response.data;
};

export const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const response = await api.post('/transactions', transaction);
  return response.data;
};

export const updateTransaction = async (id: number, transaction: Transaction): Promise<Transaction> => {
  const response = await api.put(`/transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};
