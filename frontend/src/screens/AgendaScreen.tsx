import { colors } from '@/theme';
import { useNEXOStore } from '@/store/nexo';
import { useEffect, useState } from 'react';
import { agendaService } from '@/services/api';
import { EventCard, TaskCard } from '@/components/AgendaComponents';
import { Calendar, CheckSquare, Plus } from 'lucide-react';
import { format } from 'date-fns';

export function AgendaScreen() {
  const { events, tasks, addEvent, addTask, dashboard } = useNEXOStore();
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [tomorrowEvents, setTomorrowEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');

  useEffect(() => {
    const loadAgenda = async () => {
      try {
        const [today, tomorrow] = await Promise.all([
          agendaService.getToday(),
          agendaService.getTomorrow(),
        ]);
        setTodayEvents(today.events || []);
        setTodayTasks(today.tasks || []);
        setTomorrowEvents(tomorrow.events || []);
      } catch (error) {
        console.error('Error loading agenda:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAgenda();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayEvents = activeTab === 'today' ? todayEvents : tomorrowEvents;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Agenda</h1>
        <button className="p-2 rounded-full bg-primary">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex gap-2 bg-surface rounded-xl p-1">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'today' ? 'bg-primary text-white' : 'text-textSecondary'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Hoy
        </button>
        <button
          onClick={() => setActiveTab('tomorrow')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === 'tomorrow' ? 'bg-primary text-white' : 'text-textSecondary'
          }`}
        >
          Mañana
        </button>
      </div>

      <div>
        <h3 className="text-textSecondary text-sm mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Eventos
        </h3>
        <div className="space-y-3">
          {displayEvents.length > 0 ? (
            displayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-textSecondary text-center py-4">
              Sin eventos. Di "Tengo reunión mañana a las 9"
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-textSecondary text-sm mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Tareas
        </h3>
        <div className="space-y-3">
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="text-textSecondary text-center py-4">
              Sin tareas pendientes
            </p>
          )}
        </div>
      </div>

      {dashboard?.balance !== undefined && (
        <div className="bg-surface rounded-xl p-4 border-l-4 border-warning">
          <p className="text-sm text-textSecondary mb-1">Balance del mes</p>
          <p className="text-xl font-mono font-bold text-white">
            ${dashboard.balance.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}