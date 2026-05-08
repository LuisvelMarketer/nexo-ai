# NEXO JARVIS - Your AI Assistant

**JARVIS in your pocket.** Voice-activated AI assistant for iOS and Android.

## Features

- 🎙️ **Wake Word** - Say "Hey NEXO" to activate
- 🗣️ **Voice Commands** - Speak naturally
- 💬 **Conversational AI** - Powered by Groq (Llama 3.3)
- 💰 **Finance Tracking** - Expenses, income, balance
- 📅 **Smart Agenda** - Events and tasks
- 🔊 **Text-to-Speech** - NEXO speaks back

## Tech Stack

- **Expo** (React Native)
- **TypeScript**
- **Groq API** (Llama 3.3 70B)
- **Zustand** (State)
- **expo-speech** (TTS)
- **expo-av** (Audio)

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
cd jarvis
npm install
npx expo start
```

### Configuration

Create `src/config.ts` or set environment variables:

```typescript
export const API_URL = 'http://localhost:8080/api';
export const GROQ_API_KEY = 'your-key';
```

## Project Structure

```
jarvis/
├── App.tsx                 # Main app entry
├── src/
│   ├── components/        # UI components
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx # JARVIS activation
│   │   ├── ChatScreen.tsx # NEXO chat
│   │   ├── FinanceScreen.tsx
│   │   └── AgendaScreen.tsx
│   ├── services/          # API & Speech
│   ├── store/             # Zustand state
│   ├── navigation/        # React Navigation
│   ├── theme/             # Colors, styles
│   └── types/             # TypeScript types
└── package.json
```

## Screens

1. **Home** - Activate JARVIS with voice
2. **Chat** - Text/voice conversation with NEXO
3. **Finance** - Track expenses and income
4. **Agenda** - View and manage events

## Backend Required

NEXO JARVIS needs the Django backend running:

```bash
cd ../backend
python manage.py runserver 8080
```

## TODO

- [ ] Wake word detection (TensorFlow Lite)
- [ ] Background audio processing
- [ ] iOS Shortcuts integration
- [ ] Push notifications
- [ ] Offline mode

## License

MIT - Luis Alfredo Velasquez Duran
*2026*