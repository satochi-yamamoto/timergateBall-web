import { useState, useEffect, useRef, useCallback } from 'react';

const initScores = () => {
  const s = {};
  for (let i = 1; i <= 10; i++) s[i] = 0;
  return s;
};

export const useLocalGame = () => {
  const [status, setStatus] = useState('lobby');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [scores, setScores] = useState(initScores);
  const timerRef = useRef(null);

  const teamScores = {
    red: Object.entries(scores).filter(([id]) => parseInt(id) % 2 === 1).reduce((s, [,v]) => s + v, 0),
    white: Object.entries(scores).filter(([id]) => parseInt(id) % 2 === 0).reduce((s, [,v]) => s + v, 0)
  };

  const startGame = useCallback(() => {
    if (status === 'lobby' || status === 'paused') setStatus('running');
  }, [status]);

  const pauseGame = useCallback(() => {
    if (status === 'running') setStatus('paused');
  }, [status]);

  const resetGame = useCallback(() => {
    setStatus('lobby');
    setTimeLeft(1800);
    setScores(initScores());
  }, []);

  const updatePlayerScore = useCallback((playerId) => {
    const sequence = [1,2,3,5];
    setScores(prev => {
      const current = prev[playerId];
      const next = current === 5 ? 0 : sequence[(sequence.indexOf(current) + 1) % sequence.length];
      return { ...prev, [playerId]: next };
    });
  }, []);

  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => (t > 0 ? t - 1 : 0));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  return {
    loading: false,
    error: null,
    status,
    timeLeft,
    playerScores: scores,
    teamScores,
    startGame,
    pauseGame,
    resetGame,
    updatePlayerScore,
  };
};
