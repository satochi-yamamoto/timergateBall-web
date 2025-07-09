import { useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

export const useWakeLock = (isActive) => {
  const wakeLockRef = useRef(null);
  const noSleepRef = useRef(null);

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

    if (isActive) {
      requestWakeLock();
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleVisibilityChange);
    };
  }, [isActive]);};