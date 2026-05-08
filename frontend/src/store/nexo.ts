import { create } from 'zustand';
import type { NEXOResponse, Transaction, Event, Task, Contact, DashboardData } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'nexo';
  content: string;
  action?: string;
  data?: any;
}

export type { Message };

interface NEXOStore {
  messages: Message[];
  isLoading: boolean;
  dashboard: DashboardData | null;
  transactions: Transaction[];
  events: Event[];
  tasks: Task[];
  contacts: Contact[];
  
  addMessage: (message: Omit<Message, 'id'>) => void;
  setLoading: (loading: boolean) => void;
  setDashboard: (data: DashboardData) => void;
  addTransaction: (transaction: Transaction) => void;
  addEvent: (event: Event) => void;
  addTask: (task: Task) => void;
  setContacts: (contacts: Contact[]) => void;
  clearMessages: () => void;
}

export const useNEXOStore = create<NEXOStore>((set) => ({
  messages: [],
  isLoading: false,
  dashboard: null,
  transactions: [],
  events: [],
  tasks: [],
  contacts: [],

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now().toString() }]
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setDashboard: (dashboard) => set({ dashboard }),

  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),

  addEvent: (event) => set((state) => ({
    events: [event, ...state.events]
  })),

  addTask: (task) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),

  setContacts: (contacts) => set({ contacts }),

  clearMessages: () => set({ messages: [] }),
}));