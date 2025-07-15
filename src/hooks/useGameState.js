import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useGame } from '@/contexts/GameContext.jsx';

export const useGameState = (gameId) => {
  const { user } = useAuth();
  const { isCaptain, setIsCaptain } = useGame();

  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const localTimerRef = useRef(null);

  // Memoize team scores calculation for better performance
  const teamScores = useMemo(() => {
    if (!gameState) return { red: 0, white: 0 };
    
    const redScore = Object.entries(gameState.scores)
      .filter(([playerId]) => parseInt(playerId) % 2 === 1)
      .reduce((sum, [, score]) => sum + score, 0);
    
    const whiteScore = Object.entries(gameState.scores)
      .filter(([playerId]) => parseInt(playerId) % 2 === 0)
      .reduce((sum, [, score]) => sum + score, 0);
    
    return { red: redScore, white: whiteScore };
  }, [gameState?.scores]);

  const updateRemoteState = useCallback(async (newState) => {
    const summaryStatus =
      newState.status === 'completed' || newState.status === 'deleted'
        ? newState.status
        : 'lobby';

    const { error } = await supabase
      .from('games')
      .update({ game_state: newState, status: summaryStatus })
      .eq('id', gameId);
    
    if (error) {
      console.error("Error updating game state:", error);
      setError("Falha ao sincronizar o estado do jogo.");
    }
  }, [gameId]);

  const finishGame = useCallback(async () => {
    if (!gameState || !isCaptain) return;
    const finishedState = { ...gameState, status: 'completed' };
    
    const { data: gameData } = await supabase
      .from('games')
      .select('team_red_id, team_white_id')
      .eq('id', gameId)
      .single();

    if (gameData) {
      await supabase.from('game_history').insert({
        game_id: gameId,
        team_red_id: gameData.team_red_id,
        team_white_id: gameData.team_white_id,
        final_state: finishedState,
      });
    }
    
    updateRemoteState(finishedState);
  }, [gameState, gameId, isCaptain, updateRemoteState]);
  
  const startGame = useCallback(() => {
    if (!gameState || (gameState.status !== 'lobby' && gameState.status !== 'paused') || !isCaptain) return;

    const newState = { ...gameState, status: 'running' };
    setGameState(newState);
    updateRemoteState(newState);
  }, [gameState, updateRemoteState, isCaptain]);

  const pauseGame = useCallback(() => {
    if (!gameState || gameState.status !== 'running' || !isCaptain) return;
    const newState = { ...gameState, status: 'paused' };
    updateRemoteState(newState);
  }, [gameState, updateRemoteState, isCaptain]);

  const resetGame = useCallback(() => {
    if (!isCaptain) return;
    const initialScores = {};
    for (let i = 1; i <= 10; i++) initialScores[i] = 0;
    
    const newState = {
      status: 'lobby',
      timeLeft: 1800,
      scores: initialScores
    };
    updateRemoteState(newState);
  }, [updateRemoteState, isCaptain]);
  
  const updatePlayerScore = useCallback((playerId) => {
    if (!gameState || !isCaptain) return;

    const scoreSequence = [1, 2, 3, 5];
    const currentScore = gameState.scores[playerId];
    let newScore;

    if (currentScore === 5) {
      newScore = 0; // reset after reaching 5
    } else {
      const currentIndex = scoreSequence.indexOf(currentScore);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % scoreSequence.length;
      newScore = scoreSequence[nextIndex];
    }


    const newScores = { ...gameState.scores, [playerId]: newScore };
    const newState = { ...gameState, scores: newScores };
    updateRemoteState(newState);
  }, [gameState, updateRemoteState, isCaptain]);

  useEffect(() => {
    if (!gameId || !user) return;

    const fetchInitialData = async () => {
      setLoading(true);
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*, team_red:teams!games_team_red_id_fkey(id), team_white:teams!games_team_white_id_fkey(id)')
        .eq('id', gameId)
        .single();
        
      if (gameError || !gameData) {
        setError("Não foi possível carregar o jogo.");
        setLoading(false);
        return;
      }
      
      setGameState(gameData.game_state);

      const { data: captainStatus, error: captainError } = await supabase
        .from('team_members')
        .select('is_captain')
        .or(`team_id.eq.${gameData.team_red?.id},team_id.eq.${gameData.team_white?.id}`)
        .eq('user_id', user.id)
        .eq('is_captain', true);

      if (!captainError && captainStatus.length > 0) {
        setIsCaptain(true);
      } else {
        setIsCaptain(false);
      }
      
      setLoading(false);
    };

    fetchInitialData();

    const channel = supabase
      .channel(`game-${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        setGameState(payload.new.game_state);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, user, setIsCaptain]);
  
  useEffect(() => {
    clearInterval(localTimerRef.current);

    if (gameState?.status === 'running') {
      localTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (!prev) return null;
          if (prev.timeLeft > 0) {
            const newTimeLeft = prev.timeLeft - 1;
            if (isCaptain && newTimeLeft % 5 === 0) {
              updateRemoteState({ ...prev, timeLeft: newTimeLeft });
            }
            return { ...prev, timeLeft: newTimeLeft };
          }
          if (prev.timeLeft <= 1) {
             clearInterval(localTimerRef.current);
             if (isCaptain) {
                finishGame();
             }
             return { ...prev, status: 'completed' };
          }
          return prev;
        });
      }, 1000);
    }
    
    return () => clearInterval(localTimerRef.current);
  }, [gameState?.status, isCaptain, updateRemoteState, finishGame]);


  return {
    loading,
    error,
    gameState,
    teamScores,
    startGame,
    pauseGame,
    resetGame,
    updatePlayerScore,
    finishGame,
    status: gameState?.status,
    timeLeft: gameState?.timeLeft,
    playerScores: gameState?.scores,
  };
};