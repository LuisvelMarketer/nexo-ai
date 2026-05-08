import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface NEXOResponse {
  action: string;
  response: string;
  params: Record<string, any>;
  transaction?: any;
  event?: any;
  task?: any;
  summary?: {
    today: number;
    week: number;
    month_expenses: number;
    month_income: number;
    balance: number;
  };
}

class JarvisApiService {
  async chat(message: string): Promise<NEXOResponse> {
    try {
      const response = await api.post<NEXOResponse>('/chat/', { message });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        action: 'error',
        response: 'No pude conectar con el servidor. Intenta de nuevo.',
        params: {},
      };
    }
  }

  async getDashboard() {
    try {
      const response = await api.get('/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Dashboard Error:', error);
      return null;
    }
  }

  async getTransactions() {
    try {
      const response = await api.get('/transactions/');
      return response.data;
    } catch (error) {
      console.error('Transactions Error:', error);
      return [];
    }
  }

  async getTodayAgenda() {
    try {
      const response = await api.get('/agenda/today/');
      return response.data;
    } catch (error) {
      console.error('Agenda Error:', error);
      return null;
    }
  }
}

export const jarvisApi = new JarvisApiService();