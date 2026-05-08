import { colors, spacing, borderRadius } from '@/theme';
import { format } from 'date-fns';
import type { Message } from '@/store/nexo';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-primary text-white rounded-br-md' 
            : 'bg-surface text-white rounded-bl-md'
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.action && !isUser && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-xs text-secondary font-mono">
              Acción: {message.action.replace('_', ' ')}
            </span>
          </div>
        )}
        <span className="text-xs opacity-50 mt-1 block">
          {format(new Date(), 'HH:mm')}
        </span>
      </div>
    </div>
  );
}