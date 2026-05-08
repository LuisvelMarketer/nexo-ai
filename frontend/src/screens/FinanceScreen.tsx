import { colors } from '@/theme';
import { useNEXOStore } from '@/store/nexo';
import { useEffect, useState } from 'react';
import { nexoService, financeService } from '@/services/api';
import { FinanceSummary } from '@/components/FinanceComponents';
import { TransactionItem } from '@/components/FinanceComponents';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

export function FinanceScreen() {
  const { dashboard, transactions, setDashboard } = useNEXOStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await nexoService.dashboard();
        setDashboard(data);
        
        const txns = await financeService.getTransactions();
        useNEXOStore.getState().transactions.length || useNEXOStore.setState({ transactions: txns });
      } catch (error) {
        console.error('Error loading finance data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Finanzas</h1>
        <button className="p-2 rounded-full bg-primary">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {dashboard && (
        <FinanceSummary 
          balance={dashboard.balance}
          monthExpenses={dashboard.month_expenses}
          monthIncome={dashboard.month_income}
        />
      )}

      <div>
        <h3 className="text-textSecondary text-sm mb-3">Transacciones Recientes</h3>
        <div className="space-y-2">
          {transactions.slice(0, 10).map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
          {transactions.length === 0 && (
            <p className="text-textSecondary text-center py-4">
              Sin transacciones. Prueba decir "Gasté $50 en almuerzo"
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-textSecondary text-sm">Este mes</span>
          </div>
          <p className="text-lg font-mono text-success">
            ${dashboard?.month_income.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-surface rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-accent" />
            <span className="text-textSecondary text-sm">Gastado</span>
          </div>
          <p className="text-lg font-mono text-accent">
            ${dashboard?.month_expenses.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}