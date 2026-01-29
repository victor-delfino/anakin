// ============================================
// COMPONENTS - Narrative: NarrativeBox
// ============================================
// Caixa de texto para exibir narrativas da IA

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NarrativeBoxProps {
  narrative: string;
  title?: string;
  isLoading?: boolean;
  variant?: 'default' | 'fall' | 'redemption' | 'conflict';
  typewriterEffect?: boolean;
}

export const NarrativeBox: React.FC<NarrativeBoxProps> = ({
  narrative,
  title,
  isLoading = false,
  variant = 'default',
  typewriterEffect = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!narrative || !typewriterEffect) {
      setDisplayedText(narrative || '');
      return;
    }

    setIsTyping(true);
    setDisplayedText('');

    let currentIndex = 0;
    const narrativeText = narrative; // Captura o valor atual
    
    const interval = setInterval(() => {
      if (currentIndex < narrativeText.length) {
        const char = narrativeText[currentIndex];
        if (char !== undefined) {
          setDisplayedText(prev => prev + char);
        }
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [narrative, typewriterEffect]);

  const variants = {
    default: {
      bg: 'bg-imperial-light/80',
      border: 'border-gray-600',
      glow: '',
    },
    fall: {
      bg: 'bg-gradient-to-br from-force-dark-900/90 to-imperial-dark/90',
      border: 'border-sith-red/50',
      glow: 'shadow-lg shadow-sith-red/20',
    },
    redemption: {
      bg: 'bg-gradient-to-br from-force-light-900/30 to-imperial-dark/90',
      border: 'border-jedi-blue/50',
      glow: 'shadow-lg shadow-jedi-blue/20',
    },
    conflict: {
      bg: 'bg-gradient-to-br from-force-dark-900/50 via-imperial-dark/90 to-force-light-900/30',
      border: 'border-purple-500/50',
      glow: 'shadow-lg shadow-purple-500/20',
    },
  };

  const currentVariant = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative rounded-xl p-6 border backdrop-blur-sm
        ${currentVariant.bg} ${currentVariant.border} ${currentVariant.glow}
      `}
    >
      {/* Decorative quote marks */}
      <div className="absolute top-4 left-4 text-4xl text-gray-600/30 font-serif">
        "
      </div>
      <div className="absolute bottom-4 right-4 text-4xl text-gray-600/30 font-serif">
        "
      </div>

      {/* Title */}
      {title && (
        <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-star-wars">
          {title}
        </h4>
      )}

      {/* Content */}
      <div className="relative z-10 pl-6 pr-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-gray-400 italic">
                A Força está revelando...
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-narrative text-lg leading-relaxed text-gray-200"
            >
              {(narrative || '').split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {typewriterEffect ? (
                    (displayedText || '').split('\n')[index] || ''
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
              
              {/* Typing cursor */}
              {isTyping && (
                <motion.span
                  className="inline-block w-0.5 h-5 bg-gray-300 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Variant-specific decorations */}
      {variant === 'fall' && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(139, 0, 0, 0.1) 100%)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};
