import { useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

export const useWakeLock = (isActive) => {
  const wakeLockRef = useRef(null);
  const noSleepRef = useRef(null);
  const interactionRequestedRef = useRef(false);

  useEffect(() => {
    const requestWakeLock = async () => {
      if (!isActive) return;

      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock ativado.');
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      } else {
        try {
          if (!noSleepRef.current) {
            noSleepRef.current = new NoSleep();
          }
          noSleepRef.current.enable();
          console.log('NoSleep habilitado.');
        } catch (err) {
          console.error('Erro ao habilitar NoSleep:', err);
        }
      }
    };

    const releaseWakeLock = () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock liberado.');
      }
      if (noSleepRef.current) {
        noSleepRef.current.disable();
        noSleepRef.current = null;
        console.log('NoSleep desabilitado.');
      }
    };

    const handleUserInteraction = () => {
      requestWakeLock();
      interactionRequestedRef.current = true;
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    if (isActive) {
      requestWakeLock();
      if (!interactionRequestedRef.current) {
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
        document.addEventListener('click', handleUserInteraction, { once: true });
      }
    } else {
      interactionRequestedRef.current = false;
    }

    const handleVisibilityChange = () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleVisibilityChange);

    return () => {
      releaseWakeLock();
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    };
  }, [isActive]);};