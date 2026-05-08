import { colors, spacing } from '@/theme';
import { useNEXOStore } from '@/store/nexo';
import { nexoService } from '@/services/api';
import { useState } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { Sparkles, Zap } from 'lucide-react';

export function ChatScreen() {
  const { messages, addMessage, setLoading, isLoading } = useNEXOStore();
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    addMessage({ role: 'user', content: message });
    setLoading(true);

    try {
      const response = await nexoService.chat(message);
      
      addMessage({
        role: 'nexo',
        content: response.response,
        action: response.action,
        data: response,
      });

      if (response.summary) {
        console.log('Summary:', response.summary);
      }
    } catch (error) {
      addMessage({
        role: 'nexo',
        content: 'Disculpa, tuve un problema. Puedes intentar de nuevo?',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">NEXO</h2>
            <p className="text-xs text-secondary">Asistente IA • Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-white font-semibold mb-2">Hola! Soy NEXO</h3>
            <p className="text-textSecondary text-sm max-w-xs mx-auto">
              Puedo ayudarte con gastos, eventos, contactos y más. 
              Solo escribe lo que necesitas!
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-textSecondary">Ejemplos:</p>
              <p className="text-secondary">"Gasté $50 en almuerzo"</p>
              <p className="text-secondary">"Tengo reunión mañana a las 9"</p>
              <p className="text-secondary">"Qué tengo hoy?"</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-surface px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}