// ============================================
// COMPONENTS - Decision: DecisionCard
// ============================================
// Card para exibir uma opção de decisão

import React from 'react';
import { motion } from 'framer-motion';
import type { EventDecision } from '../../types';

interface DecisionCardProps {
  decision: EventDecision;
  index: number;
  onSelect: (decision: EventDecision) => void;
  isDisabled?: boolean;
  isSelected?: boolean;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  index,
  onSelect,
  isDisabled = false,
  isSelected = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isDisabled ? { scale: 1.02, x: 10 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={() => !isDisabled && onSelect(decision)}
      className={`
        relative p-5 rounded-lg border cursor-pointer
        transition-all duration-300
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-700' 
          : isSelected
            ? 'bg-jedi-blue/20 border-jedi-blue shadow-lg shadow-jedi-blue/20'
            : 'bg-imperial-light/60 border-gray-600 hover:border-gray-400 hover:bg-imperial-light/80'
        }
      `}
    >
      {/* Decision number */}
      <div className={`
        absolute -left-3 top-1/2 -translate-y-1/2 
        w-8 h-8 rounded-full flex items-center justify-center
        font-bold text-sm
        ${isSelected 
          ? 'bg-jedi-blue text-white' 
          : 'bg-imperial border border-gray-500 text-gray-300'
        }
      `}>
        {index + 1}
      </div>

      {/* Decision text */}
      <p className="ml-4 text-gray-200 leading-relaxed">
        {decision.text}
      </p>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.05) 50%, transparent 100%)',
        }}
      />

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-jedi-blue flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
