
import React from 'react';
import { motion } from 'framer-motion';

const Timer = ({ timeLeft, gameState, onClick }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const isLowTime = timeLeft <= 300; // 5 minutes or less
  const isCriticalTime = timeLeft <= 60; // 1 minute or less
  
  const circumference = 2 * Math.PI * 140; // radius = 140
  const progress = timeLeft / 1800; // 30 minutes = 1800 seconds
  const strokeDashoffset = circumference * (1 - progress);

  const getStatusText = () => {
    switch(gameState) {
      case 'lobby': return 'Toque para iniciar';
      case 'countdown': return 'Preparando...';
      case 'running': return 'Em andamento';
      case 'paused': return 'Pausado';
      case 'finished': return 'Finalizado';
      default: return '';
    }
  }

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      animate={isCriticalTime && gameState === 'running' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: isCriticalTime ? Infinity : 0 }}
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-xl animate-pulse" />
      
      {/* Main timer circle */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Background circle */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 320 320">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="rgba(255, 214, 0, 0.2)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            stroke="#FFD600"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`${isLowTime ? 'drop-shadow-lg' : ''}`}
            style={{
              filter: isLowTime ? 'drop-shadow(0 0 10px #FFD600)' : 'none'
            }}
          />
        </svg>
        
        {/* Timer display */}
        <div className="relative z-10 text-center">
          <motion.div
            className={`timer-font text-7xl font-bold ${
              isCriticalTime ? 'text-red-400' : isLowTime ? 'text-yellow-300' : 'text-yellow-400'
            }`}
            animate={isCriticalTime && gameState === 'running' ? { 
              textShadow: [
                '0 0 10px rgba(239, 68, 68, 0.5)',
                '0 0 20px rgba(239, 68, 68, 0.8)',
                '0 0 10px rgba(239, 68, 68, 0.5)'
              ]
            } : {}}
            transition={{ duration: 1, repeat: isCriticalTime ? Infinity : 0 }}
          >
            {timeString}
          </motion.div>
          
          {/* Game state indicator */}
          <div className="mt-2 text-sm font-medium text-gray-400">
            {getStatusText()}
          </div>
        </div>
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-yellow-400 rounded-full z-20" />
      </div>
      
      {/* Tap instruction */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center">
        Toque: Pausar/Retomar • Duplo toque: Reiniciar
      </div>
    </motion.div>
  );
};

export default Timer;
