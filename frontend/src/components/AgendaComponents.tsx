import { colors, spacing, borderRadius } from '@/theme';
import { format } from 'date-fns';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import type { Event, Task } from '@/types';

interface EventCardProps {
  event: Event;
  onComplete?: (id: number) => void;
}

export function EventCard({ event, onComplete }: EventCardProps) {
  const eventDate = new Date(event.datetime);
  const isPast = eventDate < new Date();

  return (
    <div className={`bg-surface rounded-xl p-4 border-l-4 ${isPast ? 'border-textSecondary' : 'border-secondary'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-white">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-textSecondary mt-1">{event.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-textSecondary">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(eventDate, 'HH:mm')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
          </div>
        </div>
        {onComplete && !event.completed && (
          <button
            onClick={() => onComplete(event.id)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-success" />
          </button>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle?: (id: number) => void;
}

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const priorityColors = {
    high: colors.accent,
    medium: colors.warning,
    low: colors.success,
  };

  return (
    <div className="bg-surface rounded-xl p-4 flex items-center gap-3">
      <button
        onClick={() => onToggle?.(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed 
            ? 'bg-success border-success' 
            : 'border-textSecondary hover:border-secondary'
        }`}
      >
        {task.completed && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <p className={`text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </p>
      </div>
      <span 
        className="text-xs px-2 py-1 rounded-full font-mono"
        style={{ backgroundColor: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}
      >
        {task.priority}
      </span>
    </div>
  );
}