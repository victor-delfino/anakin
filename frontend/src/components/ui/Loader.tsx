// ============================================
// COMPONENTS - UI: Loader
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'force';
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  variant = 'default',
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  if (variant === 'force') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Outer glow */}
          <motion.div
            className={`${sizes[size]} rounded-full bg-gradient-to-r from-jedi-blue to-sith-red`}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              filter: 'blur(8px)',
            }}
          />
          {/* Inner circle */}
          <motion.div
            className={`absolute inset-0 ${sizes[size]} rounded-full bg-imperial-dark border-2 border-white/20`}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="absolute top-1 left-1/2 w-2 h-2 bg-jedi-blue rounded-full -translate-x-1/2" />
            <div className="absolute bottom-1 left-1/2 w-2 h-2 bg-sith-red rounded-full -translate-x-1/2" />
          </motion.div>
        </div>
        {text && (
          <motion.p
            className="text-gray-400 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizes[size]} border-4 border-gray-600 border-t-jedi-blue rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

// Full page loader
export const PageLoader: React.FC<{ text?: string }> = ({ 
  text = 'A Força está se concentrando...' 
}) => (
  <div className="fixed inset-0 bg-imperial-dark flex items-center justify-center z-50">
    <div className="text-center">
      <Loader size="lg" variant="force" />
      <motion.p
        className="mt-6 text-xl text-gray-300 font-narrative italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {text}
      </motion.p>
    </div>
  </div>
);
