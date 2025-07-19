import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/Timer';
import PlayerScore from '@/components/PlayerScore';
import TeamScore from '@/components/TeamScore';
import { Button } from '@/components/ui/button';
import { useLocalGame } from '@/hooks/useLocalGame';
import { useAudioManager } from '@/hooks/useAudioManager';

const HomeScreen = () => {
  const navigate = useNavigate();
  const {
    status,
    timeLeft,
    playerScores,
    playerOuts,
    teamScores,
    startGame,
    pauseGame,
    resetGame,
    updatePlayerScore,
    togglePlayerOut
  } = useLocalGame();

  const { playSound, initializeAudio } = useAudioManager();
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [playerTapTimes, setPlayerTapTimes] = useState({});
  const scoreUpdateTimeoutsRef = useRef({});

  const handleFirstInteraction = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio();
      setIsAudioInitialized(true);
    }
  }, [isAudioInitialized, initializeAudio]);

  const handleTimer = useCallback(async () => {
    await handleFirstInteraction();
    if (status === 'lobby') {
      await playSound('parte1');
      startGame();
    } else if (status === 'paused') {
      startGame();
    } else if (status === 'running') {
      pauseGame();
    }
  }, [status, pauseGame, startGame, handleFirstInteraction, playSound]);

  useEffect(() => {
    if (status === 'running') {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const elapsed = 1800 - timeLeft;

      if (elapsed === 900) playSound('parte2');
      if (elapsed === 1200) playSound('parte3');
      if (elapsed === 1500) playSound('parte4');
      if (timeLeft === 0) playSound('parte5');

      if (seconds === 0 && [15, 10, 5, 2, 1].includes(minutes)) playSound('alert');
      if (timeLeft <= 10 && timeLeft > 0) playSound('beep');
    }
  }, [timeLeft, status, playSound]);

  const handlePlayerScore = useCallback(async (id) => {
    await handleFirstInteraction();
    const now = Date.now();
    const last = playerTapTimes[id] || 0;
    const diff = now - last;

    setPlayerTapTimes((prev) => ({ ...prev, [id]: now }));

    if (diff < 1000) {
      const timeoutId = scoreUpdateTimeoutsRef.current[id];
      if (timeoutId) {
        clearTimeout(timeoutId);
        delete scoreUpdateTimeoutsRef.current[id];
      }
      togglePlayerOut(id);
      return;
    }

    const timeoutId = setTimeout(() => {
      updatePlayerScore(id);
      if (navigator.vibrate) navigator.vibrate(50);
      delete scoreUpdateTimeoutsRef.current[id];
    }, 1000);

    scoreUpdateTimeoutsRef.current[id] = timeoutId;
  }, [playerTapTimes, updatePlayerScore, togglePlayerOut, handleFirstInteraction]);

  const handleReset = useCallback(() => {
    Object.values(scoreUpdateTimeoutsRef.current).forEach((timeoutId) => {
      if (timeoutId) clearTimeout(timeoutId);
    });
    scoreUpdateTimeoutsRef.current = {};
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    return () => {
      Object.values(scoreUpdateTimeoutsRef.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  const oddPlayers = Object.keys(playerScores)
    .map((id) => parseInt(id, 10))
    .filter((id) => id % 2 === 1)
    .sort((a, b) => a - b);
  const evenPlayers = Object.keys(playerScores)
    .map((id) => parseInt(id, 10))
    .filter((id) => id % 2 === 0)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col p-2 sm:p-4 gap-2">
      <header className="flex justify-between items-center text-white mb-2">
        <h1 className="text-xl font-bold">Gateball Timer</h1>
        <Button variant="ghost" className="text-yellow-400" onClick={() => navigate('/auth')}>Equipe</Button>
      </header>
      <div className="flex gap-2 sm:gap-4 h-14 sm:h-16">
        <TeamScore team="red" score={teamScores.red} label="EQUIPE VERMELHA" />
        <TeamScore team="white" score={teamScores.white} label="EQUIPE BRANCA" />
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
        <div className="grid grid-rows-5 gap-2 sm:gap-3 w-16 sm:w-20">
          {oddPlayers.map((id) => (
            <PlayerScore
              key={id}
              playerId={id}
              score={playerScores[id]}
              isRedTeam={true}
              isOut={playerOuts?.[id]}
              onClick={() => handlePlayerScore(id)}
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Timer timeLeft={timeLeft} gameState={status} onClick={handleTimer} />
        </div>

        <div className="grid grid-rows-5 gap-2 sm:gap-3 w-16 sm:w-20">
          {evenPlayers.map((id) => (
            <PlayerScore
              key={id}
              playerId={id}
              score={playerScores[id]}
              isRedTeam={false}
              isOut={playerOuts?.[id]}
              onClick={() => handlePlayerScore(id)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 sm:gap-4 h-10 sm:h-12">
        <Button variant="outline" size="sm" onClick={handleTimer} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
          {status === 'running' ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
          Reiniciar
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
