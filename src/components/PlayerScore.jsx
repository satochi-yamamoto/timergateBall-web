
import React from 'react';
import { motion } from 'framer-motion';

const PlayerScore = ({ playerId, score, isRedTeam, onClick }) => {
  return (
    <motion.div
      className={`rounded-lg border-2 box-border aspect-square w-full cursor-pointer select-none flex flex-col items-center justify-center transition-all duration-200 ${
        isRedTeam
          ? 'bg-red-600 text-white border-red-700 hover:bg-red-500 active:bg-red-700'
          : 'bg-white text-black border-gray-300 hover:bg-gray-50 active:bg-gray-200'
      }`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="text-xs font-medium opacity-90">
        Jogador {playerId}
      </div>
      <motion.div
        className="score-font text-2xl font-bold"
        key={score}
        initial={{ scale: 1.3, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {score}
      </motion.div>
    </motion.div>
  );
};

export default PlayerScore;

