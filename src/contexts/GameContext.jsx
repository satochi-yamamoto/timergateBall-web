
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);

  // Placeholder for future game state logic
  const [gameState, setGameState] = useState(null);

  const value = {
    gameId,
    setGameId,
    isCaptain,
    setIsCaptain,
    gameState,
    setGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
