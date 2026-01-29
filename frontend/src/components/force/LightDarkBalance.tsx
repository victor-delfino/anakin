// ============================================
// COMPONENTS - Force: LightDarkBalance
// ============================================
// Visualização do equilíbrio entre Luz e Trevas

import React from 'react';
import { motion } from 'framer-motion';

interface LightDarkBalanceProps {
  lightSide: number;
  darkSide: number;
  hasFallen?: boolean;
}

export const LightDarkBalance: React.FC<LightDarkBalanceProps> = ({
  lightSide,
  darkSide,
  hasFallen = false,
}) => {
  const balance = lightSide - darkSide;
  const centerOffset = (balance / 200) * 100; // -50 a +50

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background track */}
      <div className="relative h-16 bg-gradient-to-r from-jedi-blue via-gray-600 to-sith-red rounded-full overflow-hidden">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 transform -translate-x-1/2" />

        {/* Balance indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8"
          initial={{ left: '50%' }}
          animate={{ 
            left: `calc(50% + ${centerOffset}%)`,
          }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-full blur-md ${
              hasFallen 
                ? 'bg-sith-red' 
                : balance > 0 
                  ? 'bg-jedi-blue' 
                  : 'bg-sith-red'
            }`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Indicator ball */}
          <div 
            className={`relative w-8 h-8 rounded-full border-2 ${
              hasFallen
                ? 'bg-force-dark-800 border-sith-red'
                : 'bg-imperial-dark border-white'
            } flex items-center justify-center`}
          >
            <span className="text-xs">
              {hasFallen ? '💀' : balance > 20 ? '✨' : balance < -20 ? '🔥' : '⚖️'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-sm">
        <div className="text-jedi-blue">
          <span className="font-bold">{lightSide}</span>
          <span className="ml-1 text-gray-400">Luz</span>
        </div>
        <div className="text-gray-400 text-center">
          {hasFallen ? (
            <span className="text-sith-red font-bold">CAÍDO</span>
          ) : (
            <span>
              {Math.abs(balance) <= 10 ? 'Equilibrado' : 
               balance > 0 ? 'Tendência à Luz' : 'Tendência às Trevas'}
            </span>
          )}
        </div>
        <div className="text-sith-red text-right">
          <span className="text-gray-400 mr-1">Trevas</span>
          <span className="font-bold">{darkSide}</span>
        </div>
      </div>
    </div>
  );
};
