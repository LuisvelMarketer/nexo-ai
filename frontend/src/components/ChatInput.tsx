import { colors, spacing, borderRadius } from '@/theme';
import { Send, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoice?: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onVoice, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 bg-surface rounded-2xl">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        disabled={disabled}
        className="flex-1 bg-transparent text-white placeholder:text-textSecondary outline-none text-base"
      />
      <button
        type="button"
        onClick={onVoice}
        className="p-3 rounded-full hover:bg-white/10 transition-colors"
        title="Grabación de voz"
      >
        <Mic className="w-5 h-5 text-secondary" />
      </button>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="p-3 rounded-full bg-primary hover:bg-primary/80 transition-colors disabled:opacity-50"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}