
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const TeamScore = memo(({ team, score, label }) => {
  const isRed = team === 'red';
  
  const containerClasses = useMemo(() => {
    return `flex-1 rounded-lg flex flex-col items-center justify-center ${
      isRed 
        ? 'bg-red-600 text-white' 
        : 'bg-white text-black border-2 border-gray-300'
    }`;
  }, [isRed]);
  
  return (
    <motion.div
      className={containerClasses}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="text-xs font-medium opacity-90 mb-1">
        {label}
      </div>
      <motion.div
        className="score-font text-3xl font-bold"
        key={score}
        initial={{ scale: 1.2, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {score}
      </motion.div>
    </motion.div>
  );
});

TeamScore.displayName = 'TeamScore';

export default TeamScore;
