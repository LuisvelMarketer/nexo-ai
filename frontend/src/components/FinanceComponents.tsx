import { colors, spacing, borderRadius } from '@/theme';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import type { Transaction } from '@/types';
import { format } from 'date-fns';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const categoryIcons: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    entertainment: '🎬',
    shopping: '🛒',
    health: '💊',
    home: '🏠',
    education: '📚',
    travel: '✈️',
    income: '💰',
    other: '📦',
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-surface rounded-xl">
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
        {categoryIcons[transaction.category] || '📦'}
      </div>
      <div className="flex-1">
        <p className="text-white font-medium capitalize">{transaction.category.replace('_', ' ')}</p>
        <p className="text-xs text-textSecondary">
          {format(new Date(transaction.created_at), 'dd MMM, HH:mm')}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-mono font-bold ${transaction.type === 'income' ? 'text-success' : 'text-accent'}`}>
          {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

interface FinanceSummaryProps {
  balance: number;
  monthExpenses: number;
  monthIncome: number;
}

export function FinanceSummary({ balance, monthExpenses, monthIncome }: FinanceSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4 text-secondary" />
          <span className="text-textSecondary text-sm">Balance</span>
        </div>
        <p className={`text-2xl font-mono font-bold ${balance >= 0 ? 'text-success' : 'text-accent'}`}>
          ${balance.toFixed(2)}
        </p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="w-4 h-4 text-success" />
          <span className="text-textSecondary text-sm">Ingresos</span>
        </div>
        <p className="text-2xl font-mono font-bold text-success">
          ${monthIncome.toFixed(2)}
        </p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-4 h-4 text-accent" />
          <span className="text-textSecondary text-sm">Gastos</span>
        </div>
        <p className="text-2xl font-mono font-bold text-accent">
          ${monthExpenses.toFixed(2)}
        </p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-warning" />
          <span className="text-textSecondary text-sm">Ahorro</span>
        </div>
        <p className="text-2xl font-mono font-bold text-warning">
          ${(monthIncome - monthExpenses).toFixed(2)}
        </p>
      </div>
    </div>
  );
}