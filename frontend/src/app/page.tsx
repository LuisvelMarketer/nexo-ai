'use client';

import { useState } from 'react';
import { Home, MessageCircle, DollarSign, Calendar, Settings, Mic } from 'lucide-react';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { FinanceScreen } from '@/screens/FinanceScreen';
import { AgendaScreen } from '@/screens/AgendaScreen';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'NEXO', icon: MessageCircle },
  { id: 'finance', label: 'Finanzas', icon: DollarSign },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
];

const screens: Record<string, React.ComponentType> = {
  home: DashboardScreen,
  chat: ChatScreen,
  finance: FinanceScreen,
  agenda: AgendaScreen,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const ActiveScreen = screens[activeTab];

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <ActiveScreen />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-textSecondary hover:text-white'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {activeTab === 'chat' && (
        <button className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg z-40">
          <Mic className="w-6 h-6 text-background" />
        </button>
      )}
    </div>
  );
}