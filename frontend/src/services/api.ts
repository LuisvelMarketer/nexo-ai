import axios from 'axios';
import type { NEXOResponse, DashboardData, Transaction, Event, Task, Contact } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nexoService = {
  chat: async (message: string): Promise<NEXOResponse> => {
    const response = await api.post<NEXOResponse>('/chat/', { message });
    return response.data;
  },

  dashboard: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/dashboard/');
    return response.data;
  },
};

export const financeService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions/');
    return response.data;
  },

  addTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions/', data);
    return response.data;
  },

  quickExpense: async (text: string): Promise<Transaction> => {
    const response = await api.post<Transaction>('/expense/', { text });
    return response.data;
  },
};

export const agendaService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/');
    return response.data;
  },

  addEvent: async (data: Partial<Event>): Promise<Event> => {
    const response = await api.post<Event>('/events/', data);
    return response.data;
  },

  getToday: async () => {
    const response = await api.get('/agenda/today/');
    return response.data;
  },

  getTomorrow: async () => {
    const response = await api.get('/agenda/tomorrow/');
    return response.data;
  },
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/');
    return response.data;
  },

  addTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', data);
    return response.data;
  },
};

export const contactService = {
  getContacts: async (query?: string): Promise<Contact[]> => {
    const response = await api.get<Contact[]>('/contacts/', {
      params: query ? { q: query } : undefined,
    });
    return response.data;
  },

  addContact: async (data: Partial<Contact>): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts/', data);
    return response.data;
  },
};

export default api;