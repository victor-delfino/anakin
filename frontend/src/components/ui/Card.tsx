// ============================================
// COMPONENTS - UI: Card
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'dark' | 'light';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseStyles = `
    rounded-xl p-6 backdrop-blur-sm
    transition-all duration-300 ease-in-out
  `;

  const variants = {
    default: 'bg-imperial-light/80 border border-gray-700/50',
    highlighted: 'bg-imperial-light/90 border-2 border-jedi-blue/50 shadow-lg shadow-jedi-blue/20',
    dark: 'bg-imperial-dark/90 border border-force-dark-700/50 shadow-lg shadow-force-dark-900/30',
    light: 'bg-white/10 border border-force-light-400/30 shadow-lg shadow-force-light-500/10',
  };

  const hoverStyles = hoverable
    ? 'cursor-pointer hover:border-jedi-blue/70 hover:shadow-jedi-blue/30 hover:-translate-y-1'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Card Header
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

// Card Title
export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white font-star-wars ${className}`}>
    {children}
  </h3>
);

// Card Content
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`text-gray-300 ${className}`}>{children}</div>
);

// Card Footer
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-700/50 ${className}`}>
    {children}
  </div>
);
