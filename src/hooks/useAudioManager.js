
import { useCallback, useRef } from 'react';

export const useAudioManager = () => {
  const audioContextRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
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

  // Play different sound types
  const playSound = useCallback((soundType) => {
    if (!isInitializedRef.current) return;

    switch (soundType) {
      case 'beep':
        generateBeep(1000, 150, 'sine');
        break;
      case 'alert':
        generateBeep(800, 300, 'square');
        break;
      case 'gameStart':
        // Play sequence for game start
        setTimeout(() => generateBeep(600, 200), 0);
        setTimeout(() => generateBeep(800, 200), 250);
        setTimeout(() => generateBeep(1000, 400), 500);
        break;
      case 'gameEnd':
        // Play sequence for game end
        generateBeep(400, 800, 'sawtooth');
        break;
      case 'score':
        generateBeep(1200, 100, 'sine');
        break;
      default:
        generateBeep();
    }
  }, [generateBeep]);

  return {
    initializeAudio,
    playSound,
    isInitialized: isInitializedRef.current
  };
};
