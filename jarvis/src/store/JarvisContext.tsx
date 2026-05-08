import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { speechService } from '../services/speechService';
import { jarvisApi } from '../services/apiService';
import type { Message } from '../types';
import type { NEXOResponse } from '../services/apiService';

interface JarvisContextType {
  isListening: boolean;
  isSpeaking: boolean;
  isAwake: boolean;
  messages: Message[];
  wakeWord: string;
  setWakeWord: (word: string) => void;
  startListening: () => void;
  stopListening: () => void;
  sendMessage: (text: string) => Promise<void>;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => Promise<void>;
  activateJarvis: () => void;
  deactivateJarvis: () => void;
}

const JarvisContext = createContext<JarvisContextType | null>(null);

export function JarvisProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wakeWord] = useState('Hey NEXO');

  const addMessage = useCallback((role: 'user' | 'jarvis', content: string, action?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      action,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    await speechService.speakWithCallback(text, undefined, () => {
      setIsSpeaking(false);
    });
  }, []);

  const stopSpeaking = useCallback(async () => {
    await speechService.stop();
    setIsSpeaking(false);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    addMessage('user', text);
    setIsListening(true);

    try {
      const response: NEXOResponse = await jarvisApi.chat(text);
      
      addMessage('jarvis', response.response, response.action);
      await speak(response.response);
    } catch (error) {
      addMessage('jarvis', 'Disculpa, tuve un problema. Puedes intentar de nuevo?');
      await speak('Disculpa, tuve un problema. Puedes intentar de nuevo?');
    } finally {
      setIsListening(false);
    }
  }, [addMessage, speak]);

  const startListening = useCallback(() => {
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const activateJarvis = useCallback(() => {
    setIsAwake(true);
    speak('¡Hola! Soy NEXO, tu asistente JARVIS. ¿En qué puedo ayudarte?');
  }, [speak]);

  const deactivateJarvis = useCallback(() => {
    setIsAwake(false);
    stopSpeaking();
  }, [stopSpeaking]);

  return (
    <JarvisContext.Provider
      value={{
        isListening,
        isSpeaking,
        isAwake,
        messages,
        wakeWord,
        setWakeWord: () => {},
        startListening,
        stopListening,
        sendMessage,
        speak,
        stopSpeaking,
        activateJarvis,
        deactivateJarvis,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within JarvisProvider');
  }
  return context;
}