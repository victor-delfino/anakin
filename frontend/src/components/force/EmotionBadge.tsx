// ============================================
// COMPONENTS - Force: EmotionBadge
// ============================================
// Badge que exibe a emoção dominante

import React from 'react';
import { motion } from 'framer-motion';
import type { EmotionType } from '../../types';
import { EMOTION_DISPLAY } from '../../types';

interface EmotionBadgeProps {
  emotion: EmotionType;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({
  emotion,
  showDescription = false,
  size = 'md',
}) => {
  const emotionData = EMOTION_DISPLAY[emotion];

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const alignmentStyles = {
    light: 'border-jedi-blue/50 bg-jedi-blue/10',
    dark: 'border-sith-red/50 bg-sith-red/10',
    neutral: 'border-gray-400/50 bg-gray-400/10',
    balanced: 'border-purple-400/50 bg-purple-400/10',
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-2 rounded-full border
        ${sizes[size]}
        ${alignmentStyles[emotionData.alignment]}
      `}
      style={{ 
        boxShadow: `0 0 10px ${emotionData.color}30`,
      }}
    >
      <span className={iconSizes[size]}>{emotionData.icon}</span>
      <span className="font-medium" style={{ color: emotionData.color }}>
        {emotionData.displayName}
      </span>
      
      {showDescription && (
        <span className="text-gray-400 text-xs italic hidden sm:inline">
          - {emotionData.description}
        </span>
      )}
    </motion.div>
  );
};

// Compact version for lists
export const EmotionBadgeCompact: React.FC<{ emotion: EmotionType }> = ({ emotion }) => {
  const emotionData = EMOTION_DISPLAY[emotion];
  
  return (
    <span 
      className="inline-flex items-center gap-1 text-sm"
      style={{ color: emotionData.color }}
    >
      <span>{emotionData.icon}</span>
      <span>{emotionData.displayName}</span>
    </span>
  );
};
