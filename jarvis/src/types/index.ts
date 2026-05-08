export interface Message {
  id: string;
  role: 'user' | 'jarvis';
  content: string;
  timestamp: Date;
  action?: string;
}

export interface ConversationContext {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  lastIntent?: string;
}

export interface JarvisState {
  isListening: boolean;
  isSpeaking: boolean;
  isAwake: boolean;
  currentMessage: string;
  messages: Message[];
  error: string | null;
}