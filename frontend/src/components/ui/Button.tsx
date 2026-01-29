// ============================================
// COMPONENTS - UI: Button
// ============================================

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-imperial-dark
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: 'bg-jedi-blue hover:bg-force-light-600 text-white focus:ring-force-light-500',
    secondary: 'bg-imperial-light hover:bg-imperial text-gray-200 focus:ring-gray-500 border border-gray-600',
    danger: 'bg-sith-red hover:bg-force-dark-600 text-white focus:ring-force-dark-500',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-300 focus:ring-gray-500',
    light: 'bg-gradient-to-r from-force-light-400 to-force-light-600 hover:from-force-light-500 hover:to-force-light-700 text-white focus:ring-force-light-500',
    dark: 'bg-gradient-to-r from-force-dark-600 to-force-dark-800 hover:from-force-dark-700 hover:to-force-dark-900 text-white focus:ring-force-dark-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
