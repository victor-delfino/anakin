// ============================================
// COMPONENTS - Narrative: InnerConflict
// ============================================
// Visualização do conflito interno de Anakin

import React from 'react';
import { motion } from 'framer-motion';

interface InnerConflictProps {
  lightSide: number;
  darkSide: number;
  isInConflict: boolean;
  emotion: string;
}

export const InnerConflict: React.FC<InnerConflictProps> = ({
  lightSide,
  darkSide,
  isInConflict,
  emotion,
}) => {
  const balance = lightSide - darkSide;
  
  // Calcular intensidade do conflito
  const conflictIntensity = isInConflict 
    ? 100 - Math.abs(balance) 
    : Math.max(0, 50 - Math.abs(balance));

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, 
            rgba(0, 191, 255, ${lightSide / 200}) 0%, 
            transparent 40%, 
            rgba(255, 0, 0, ${darkSide / 200}) 100%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: isInConflict ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: isInConflict ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Light side orb */}
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, #00BFFF 0%, #0066CC 100%)',
          boxShadow: '0 0 30px rgba(0, 191, 255, 0.6)',
          left: '20%',
          top: '30%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: isInConflict ? [0, 10, -10, 0] : [0, 5, 0],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-2 rounded-full bg-white/30 blur-sm" />
      </motion.div>

      {/* Dark side orb */}
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle, #FF0000 0%, #8B0000 100%)',
          boxShadow: '0 0 30px rgba(255, 0, 0, 0.6)',
          right: '20%',
          bottom: '30%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: isInConflict ? [0, -10, 10, 0] : [0, -5, 0],
          y: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-white/20 blur-sm" />
      </motion.div>

      {/* Center - Anakin's soul */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
        style={{
          background: balance > 0 
            ? `radial-gradient(circle, white 0%, rgba(0, 191, 255, 0.5) 50%, transparent 100%)`
            : `radial-gradient(circle, white 0%, rgba(255, 0, 0, 0.5) 50%, transparent 100%)`,
          boxShadow: isInConflict 
            ? '0 0 40px rgba(128, 0, 128, 0.8)' 
            : balance > 0 
              ? '0 0 30px rgba(0, 191, 255, 0.5)'
              : '0 0 30px rgba(255, 0, 0, 0.5)',
        }}
        animate={{
          scale: isInConflict ? [1, 1.3, 0.9, 1] : [1, 1.1, 1],
          rotate: isInConflict ? [0, 10, -10, 0] : 0,
        }}
        transition={{
          duration: isInConflict ? 1 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Core */}
        <div className="absolute inset-4 rounded-full bg-white/80" />
      </motion.div>

      {/* Conflict lightning */}
      {isInConflict && (
        <>
          <motion.div
            className="absolute left-1/2 top-1/2 w-px h-16 bg-purple-400 origin-center"
            style={{ rotate: '45deg' }}
            animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 w-px h-16 bg-purple-400 origin-center"
            style={{ rotate: '-45deg' }}
            animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.7 }}
          />
        </>
      )}

      {/* Status text */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <motion.p
          className={`text-sm font-medium ${
            isInConflict 
              ? 'text-purple-400' 
              : balance > 0 
                ? 'text-jedi-blue' 
                : 'text-sith-red'
          }`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isInConflict 
            ? '⚡ Conflito Interno Intenso' 
            : balance > 20 
              ? '✨ Alinhado com a Luz'
              : balance < -20
                ? '🔥 Inclinado às Trevas'
                : '⚖️ Equilibrado'}
        </motion.p>
      </div>
    </div>
  );
};
