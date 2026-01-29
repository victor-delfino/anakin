// ============================================
// COMPONENTS - Force: ForceMeter
// ============================================
// Medidor visual do equilíbrio entre Luz e Trevas

import React from 'react';
import { motion } from 'framer-motion';

interface ForceMeterProps {
  lightSide: number;
  darkSide: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ForceMeter: React.FC<ForceMeterProps> = ({
  lightSide,
  darkSide,
  showLabels = true,
  size = 'md',
}) => {
  const total = lightSide + darkSide || 1;
  const lightPercent = (lightSide / 100) * 100;
  const darkPercent = (darkSide / 100) * 100;

  const heights = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full space-y-2">
      {showLabels && (
        <div className="flex justify-between text-sm">
          <span className="text-jedi-blue font-medium">
            Lado Luminoso: {lightSide}
          </span>
          <span className="text-sith-red font-medium">
            Lado Sombrio: {darkSide}
          </span>
        </div>
      )}

      {/* Barra de Luz */}
      <div className="relative">
        <div className={`w-full ${heights[size]} bg-gray-800 rounded-full overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-force-light-600 to-jedi-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${lightPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              boxShadow: lightSide > 50 ? '0 0 15px rgba(0, 191, 255, 0.5)' : 'none',
            }}
          />
        </div>
      </div>

      {/* Barra de Trevas */}
      <div className="relative">
        <div className={`w-full ${heights[size]} bg-gray-800 rounded-full overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-force-dark-600 to-sith-red rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${darkPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              boxShadow: darkSide > 50 ? '0 0 15px rgba(255, 0, 0, 0.5)' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};
