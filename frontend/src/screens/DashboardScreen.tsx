import { colors } from '@/theme';
import { StatCard } from '@/components/Card';
import { Calendar, Wallet, CheckSquare, Clock } from 'lucide-react';
import { useNEXOStore } from '@/store/nexo';
import { useEffect } from 'react';
import { nexoService } from '@/services/api';

export function DashboardScreen() {
  const { dashboard, setDashboard } = useNEXOStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await nexoService.dashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buenos días!</h1>
        <p className="text-textSecondary">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </div>

      {dashboard && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Balance"
              value={`$${dashboard.balance.toFixed(2)}`}
              subtitle="Este mes"
              icon="💰"
              color={dashboard.balance >= 0 ? colors.success : colors.accent}
            />
            <StatCard
              title="Eventos"
              value={dashboard.upcoming_events?.length || 0}
              subtitle="Próximos"
              icon="📅"
              color={colors.secondary}
            />
            <StatCard
              title="Tareas"
              value={dashboard.pending_tasks?.length || 0}
              subtitle="Pendientes"
              icon="✅"
              color={colors.warning}
            />
            <StatCard
              title="Gastado"
              value={`$${dashboard.month_expenses.toFixed(2)}`}
              subtitle="Este mes"
              icon="💸"
              color={colors.accent}
            />
          </div>

          {dashboard.upcoming_events && dashboard.upcoming_events.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Próximos eventos</h3>
              <div className="space-y-2">
                {dashboard.upcoming_events.slice(0, 3).map((event: any) => (
                  <div key={event.id} className="bg-surface rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-textSecondary text-sm">
                        {new Date(event.datetime).toLocaleString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dashboard.pending_tasks && dashboard.pending_tasks.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3">Tareas pendientes</h3>
              <div className="space-y-2">
                {dashboard.pending_tasks.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="bg-surface rounded-xl p-4 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed ? 'bg-success border-success' : 'border-textSecondary'
                    }`}>
                      {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className={`text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="bg-surface rounded-xl p-4 border-l-4 border-primary">
        <p className="text-secondary text-sm font-semibold mb-1">Tip de NEXO</p>
        <p className="text-white text-sm">
          Di "Gasté $50 en almuerzo" para registrar gastos automáticamente
        </p>
      </div>
    </div>
  );
}