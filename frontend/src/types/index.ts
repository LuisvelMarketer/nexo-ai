export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  recurring: boolean;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  datetime: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  reminder_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  due_date: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  relationship: string;
  birthday: string | null;
}

export interface NEXOResponse {
  action: string;
  response: string;
  params: Record<string, any>;
  transaction?: Transaction;
  event?: Event;
  task?: Task;
  summary?: {
    today: number;
    week: number;
    month_expenses: number;
    month_income: number;
    balance: number;
  };
  events?: Event[];
  tasks?: Task[];
}

export interface DashboardData {
  balance: number;
  month_expenses: number;
  month_income: number;
  upcoming_events: Event[];
  pending_tasks: Task[];
}

export type ActionType = 
  | 'financial_add'
  | 'financial_summary'
  | 'event_add'
  | 'agenda_view'
  | 'contact_call'
  | 'contact_message'
  | 'search_local'
  | 'task_add'
  | 'general';