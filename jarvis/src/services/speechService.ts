import * as Speech from 'expo-speech';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';

class SpeechService {
  private isSpeaking = false;

  async speak(text: string): Promise<void> {
    if (this.isSpeaking) {
      await this.stop();
    }

    this.isSpeaking = true;

    try {
      await Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          this.isSpeaking = false;
        },
        onError: () => {
          this.isSpeaking = false;
        },
      });
    } catch (error) {
      this.isSpeaking = false;
      console.error('Speech error:', error);
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }

  async speakWithCallback(text: string, onStart?: () => void, onDone?: () => void): Promise<void> {
    if (this.isSpeaking) {
      await this.stop();
    }

    this.isSpeaking = true;
    onStart?.();

    try {
      await Speech.speak(text, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          this.isSpeaking = false;
          onDone?.();
        },
        onError: () => {
          this.isSpeaking = false;
          onDone?.();
        },
      });
    } catch (error) {
      this.isSpeaking = false;
      console.error('Speech error:', error);
    }
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  async copyToClipboard(text: string): Promise<void> {
    await Clipboard.setStringAsync(text);
  }
}

export const speechService = new SpeechService();