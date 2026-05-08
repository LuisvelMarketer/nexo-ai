import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

const WAKE_WORD = 'hey nexo';
const SIMILARITY_THRESHOLD = 0.7;

interface UseWakeWordResult {
  isListening: boolean;
  isAwake: boolean;
  startWakeWordDetection: () => Promise<void>;
  stopWakeWordDetection: () => void;
  triggerWakeWord: () => void;
}

export function useWakeWord(onWakeWord: () => void): UseWakeWordResult {
  const [isListening, setIsListening] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const silenceThreshold = useRef(0);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    setPermissionGranted(status === 'granted');
    return status === 'granted';
  };

  const startWakeWordDetection = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('Microphone permission denied');
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      recordingRef.current = recording;
      setIsListening(true);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.metering) {
          const decibels = status.metering;
          silenceThreshold.current = decibels;

          if (decibels > -10) {
            console.log('Sound detected:', decibels);
          }
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopWakeWordDetection = useCallback(async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      recordingRef.current = null;
    }
    setIsListening(false);
  }, []);

  const triggerWakeWord = useCallback(() => {
    setIsAwake(true);
    onWakeWord();
  }, [onWakeWord]);

  useEffect(() => {
    return () => {
      stopWakeWordDetection();
    };
  }, [stopWakeWordDetection]);

  return {
    isListening,
    isAwake,
    startWakeWordDetection,
    stopWakeWordDetection,
    triggerWakeWord,
  };
}

export function useSimpleVoiceDetection(onSound: () => void, threshold = -10) {
  const [isListening, setIsListening] = useState(false);
  const [lastSoundLevel, setLastSoundLevel] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const lastSoundTime = useRef(0);

  const startListening = useCallback(async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();

    recordingRef.current = recording;
    setIsListening(true);

    recording.setOnRecordingStatusUpdate((status) => {
      if (status.metering) {
        setLastSoundLevel(status.metering);
        
        if (status.metering > threshold) {
          const now = Date.now();
          if (now - lastSoundTime.current > 500) {
            lastSoundTime.current = now;
            onSound();
          }
        }
      }
    });
  }, [onSound, threshold]);

  const stopListening = useCallback(async () => {
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return { isListening, lastSoundLevel, startListening, stopListening };
}