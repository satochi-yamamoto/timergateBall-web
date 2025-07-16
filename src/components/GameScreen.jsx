import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import PlayerScore from '@/components/PlayerScore';
import TeamScore from '@/components/TeamScore';
import Timer from '@/components/Timer';
import { useGameState } from '@/hooks/useGameState';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useGame } from '@/contexts/GameContext.jsx';
import { useWakeLock } from '@/hooks/useWakeLock';

const GameScreen = memo(() => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const { isCaptain } = useGame();
  
  const {
    loading,
    error,
    status,
    timeLeft,
    playerScores,
    playerOuts,
    teamScores,
    startGame,
    pauseGame,
    resetGame,
    updatePlayerScore,
    togglePlayerOut,
  } = useGameState(gameId);
  
  useWakeLock(status === 'running');
  const { playSound, initializeAudio } = useAudioManager();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [playerTapTimes, setPlayerTapTimes] = useState({});

  const handleFirstInteraction = useCallback(async () => {
    if (!isAudioInitialized) {
      await initializeAudio();
      setIsAudioInitialized(true);
    }
  }, [isAudioInitialized, initializeAudio]);

  const handleTimerClick = useCallback(async () => {
    await handleFirstInteraction();
    if (!isCaptain) {
      toast({ title: "Apenas capitães podem controlar o jogo.", variant: "destructive"});
      return;
    }

    const now = Date.now();
    if (now - lastTapTime < 300) {
      setShowConfirmDialog(true);
    } else {
      if (status === 'lobby') {
        await playSound('parte1');
        startGame();
      } else if (status === 'paused') {
        startGame();
      } else if (status === 'running') {
        pauseGame();
      }
    }
    setLastTapTime(now);
  }, [status, lastTapTime, startGame, pauseGame, handleFirstInteraction, isCaptain, toast, playSound]);

  const handlePlayerScoreUpdate = useCallback(async (playerId) => {
    await handleFirstInteraction();
    if (!isCaptain) {
      toast({ title: "Apenas capitães podem alterar o placar.", variant: "destructive"});
      return;
    }
    const now = Date.now();
    const last = playerTapTimes[playerId] || 0;
    if (now - last < 300) {
      togglePlayerOut(playerId);
    } else {
      updatePlayerScore(playerId);
      if (navigator.vibrate) navigator.vibrate(50);
    }
    setPlayerTapTimes((prev) => ({ ...prev, [playerId]: now }));
  }, [updatePlayerScore, togglePlayerOut, handleFirstInteraction, isCaptain, toast, playerTapTimes]);

  const handleResetConfirm = useCallback(() => {
    if (!isCaptain) return;
    resetGame();
    setShowConfirmDialog(false);
    toast({ title: "Jogo Reiniciado", description: "O estado do jogo foi zerado." });
  }, [resetGame, toast, isCaptain]);

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

  if (loading) {
    return <div className="min-h-screen w-screen overflow-y-auto bg-gray-900 flex items-center justify-center text-white">Carregando Jogo...</div>;
  }
  
  if (error) {
    toast({ variant: 'destructive', title: 'Erro de Jogo', description: error });
    return <Navigate to="/" />;
  }

  const oddPlayers = playerScores
    ? Object.keys(playerScores)
        .map((id) => parseInt(id, 10))
        .filter((id) => id % 2 === 1)
        .sort((a, b) => a - b)
    : [];
  const evenPlayers = playerScores
    ? Object.keys(playerScores)
        .map((id) => parseInt(id, 10))
        .filter((id) => id % 2 === 0)
        .sort((a, b) => a - b)
    : [];

  return (
    <>
    <div className="min-h-screen w-screen overflow-y-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col p-2 sm:p-4 gap-2">
      <div className="flex gap-2 sm:gap-4 h-14 sm:h-16">
        <TeamScore team="red" score={teamScores.red} label="EQUIPE VERMELHA" />
        <TeamScore team="white" score={teamScores.white} label="EQUIPE BRANCA" />
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
        <div className="grid grid-rows-5 gap-2 sm:gap-3 w-16 sm:w-20">
          {oddPlayers.map((playerId) => (
            <PlayerScore
              key={playerId}
              playerId={playerId}
              score={playerScores[playerId]}
              isRedTeam={true}
              isOut={playerOuts?.[playerId]}
              onClick={() => handlePlayerScoreUpdate(playerId)}
            />
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Timer timeLeft={timeLeft} gameState={status} onClick={handleTimerClick} />
        </div>

        <div className="grid grid-rows-5 gap-2 sm:gap-3 w-16 sm:w-20">
          {evenPlayers.map((playerId) => (
            <PlayerScore
              key={playerId}
              playerId={playerId}
              score={playerScores[playerId]}
              isRedTeam={false}
              isOut={playerOuts?.[playerId]}
              onClick={() => handlePlayerScoreUpdate(playerId)}
            />
          ))}
        </div>
      </div>

      {isCaptain && (
        <div className="flex justify-center gap-2 sm:gap-4 h-10 sm:h-12">
          <Button variant="outline" size="sm" onClick={handleTimerClick} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
            {status === 'running' ? <><Pause className="w-3 h-3 mr-2" /> Pausar</> : <><Play className="w-3 h-3 mr-2" /> Iniciar</>}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowConfirmDialog(true)} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
            <RotateCcw className="w-3 h-3 mr-2" /> Reiniciar
          </Button>
        </div>
      )}
      
      {!isCaptain && <div className="h-12 flex items-center justify-center text-gray-400">Modo Convidado: Apenas visualização</div>}

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleResetConfirm}
        title="Finalizar Jogo"
        description="Deseja zerar o cronômetro e todos os placares? Esta ação é irreversível."
        confirmText="Sim"
        cancelText="Cancelar"
      />
    </div>
    </>
  );
});

GameScreen.displayName = 'GameScreen';

export default GameScreen;