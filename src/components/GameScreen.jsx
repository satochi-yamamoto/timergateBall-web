import React, { useState, useEffect, useCallback } from 'react';
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

const GameScreen = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const { isCaptain } = useGame();
  
  const {
    loading,
    error,
    status,
    timeLeft,
    playerScores,
    teamScores,
    startGame,
    pauseGame,
    resetGame,
    updatePlayerScore,
  } = useGameState(gameId);
  
  useWakeLock(status === 'running');
  const { playSound, initializeAudio } = useAudioManager();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

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
      if (status === 'lobby' || status === 'paused') {
        startGame();
      } else if (status === 'running') {
        pauseGame();
      }
    }
    setLastTapTime(now);
  }, [status, lastTapTime, startGame, pauseGame, handleFirstInteraction, isCaptain, toast]);

  const handlePlayerScoreUpdate = useCallback(async (playerId) => {
    await handleFirstInteraction();
    if (!isCaptain) {
      toast({ title: "Apenas capitães podem alterar o placar.", variant: "destructive"});
      return;
    }
    updatePlayerScore(playerId);
    if (navigator.vibrate) navigator.vibrate(50);
  }, [updatePlayerScore, handleFirstInteraction, isCaptain, toast]);

  const handleResetConfirm = useCallback(() => {
    if (!isCaptain) return;
    resetGame();
    setShowConfirmDialog(false);
    toast({ title: "Jogo Reiniciado", description: "O estado do jogo foi zerado." });
  }, [resetGame, toast, isCaptain]);

  useEffect(() => {
    if (status === 'running' && isAudioInitialized) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      
      if (seconds === 0 && [15, 10, 5, 2, 1].includes(minutes)) playSound('alert');
      if (timeLeft <= 10 && timeLeft > 0) playSound('beep');
      if (timeLeft === 0) playSound('gameEnd');
    }
  }, [timeLeft, status, isAudioInitialized, playSound]);

  if (loading) {
    return <div className="h-screen w-screen bg-gray-900 flex items-center justify-center text-white">Carregando Jogo...</div>;
  }
  
  if (error) {
    toast({ variant: 'destructive', title: 'Erro de Jogo', description: error });
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col p-4 gap-4">
      <div className="flex gap-4 h-20">
        <TeamScore team="red" score={teamScores.red} label="EQUIPE VERMELHA" />
        <TeamScore team="white" score={teamScores.white} label="EQUIPE BRANCA" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Timer timeLeft={timeLeft} gameState={status} onClick={handleTimerClick} />
      </div>

      <div className="grid grid-cols-5 grid-rows-2 gap-3 h-32">
        {playerScores && Object.keys(playerScores).map((pId) => {
          const playerId = parseInt(pId, 10);
          return (
            <PlayerScore
              key={playerId}
              playerId={playerId}
              score={playerScores[playerId]}
              isRedTeam={playerId % 2 === 1}
              onClick={() => handlePlayerScoreUpdate(playerId)}
            />
          );
        })}
      </div>

      {isCaptain && (
        <div className="flex justify-center gap-4 h-12">
          <Button variant="outline" size="sm" onClick={handleTimerClick} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
            {status === 'running' ? <><Pause className="w-4 h-4 mr-2" /> Pausar</> : <><Play className="w-4 h-4 mr-2" /> Iniciar</>}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowConfirmDialog(true)} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
            <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar
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
  );
};

export default GameScreen;