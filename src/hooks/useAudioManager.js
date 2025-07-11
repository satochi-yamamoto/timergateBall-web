
import { useCallback, useRef } from 'react';

export const useAudioManager = () => {
  const audioContextRef = useRef(null);
  const audioFilesRef = useRef({});
  const isInitializedRef = useRef(false);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      audioFilesRef.current = {
        parte1: new Audio('/sound/Parte-1.mp3'),
        parte2: new Audio('/sound/Parte-2.mp3'),
        parte3: new Audio('/sound/Parte-3.mp3'),
        parte4: new Audio('/sound/Parte-4.mp3'),
        parte5: new Audio('/sound/Parte-5.mp3'),
      };
      isInitializedRef.current = true;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }, []);

  // Generate beep sound
  const generateBeep = useCallback((frequency = 800, duration = 200, type = 'sine') => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, []);

  // Play an HTML audio file and return a promise when it ends
  const playAudioFile = useCallback((key) => {
    const audio = audioFilesRef.current[key];
    if (!audio) return Promise.resolve();
    audio.currentTime = 0;
    return new Promise((resolve) => {
      audio.onended = () => resolve();
      audio.play().catch(() => resolve());
    });
  }, []);

  // Play different sound types
  const playSound = useCallback((soundType) => {
    if (!isInitializedRef.current) return Promise.resolve();

    switch (soundType) {
      case 'beep':
        generateBeep(1000, 150, 'sine');
        return Promise.resolve();
      case 'alert':
        generateBeep(800, 300, 'square');
        return Promise.resolve();
      case 'parte1':
      case 'parte2':
      case 'parte3':
      case 'parte4':
      case 'parte5':
        return playAudioFile(soundType);
      case 'gameStart':
        // Play sequence for game start
        setTimeout(() => generateBeep(600, 200), 0);
        setTimeout(() => generateBeep(800, 200), 250);
        setTimeout(() => generateBeep(1000, 400), 500);
        return Promise.resolve();
      case 'gameEnd':
        // Play sequence for game end
        generateBeep(400, 800, 'sawtooth');
        return Promise.resolve();
      case 'score':
        generateBeep(1200, 100, 'sine');
        return Promise.resolve();
      default:
        generateBeep();
        return Promise.resolve();
    }
  }, [generateBeep]);

  return {
    initializeAudio,
    playSound,
    isInitialized: isInitializedRef.current
  };
};
