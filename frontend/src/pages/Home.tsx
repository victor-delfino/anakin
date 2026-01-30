// ============================================
// PAGES - Home
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui';
import { useSession } from '../hooks';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { startNewSession, isSessionActive, isLoading } = useSession();

  const handleStart = async () => {
    const result = await startNewSession();
    if (result) {
      navigate('/timeline');
    }
  };

  const handleContinue = () => {
    navigate('/timeline');
  };

  return (
    <div className="min-h-screen bg-imperial-dark bg-stars flex flex-col items-center justify-center p-8">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-imperial-dark/50 to-imperial-dark pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-3xl"
      >
        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-star-wars text-yellow-400 mb-4"
          style={{ textShadow: '0 0 30px rgba(255, 193, 7, 0.5)' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ANAKIN
        </motion.h1>
        <motion.h2
          className="text-3xl md:text-5xl font-star-wars text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          SKYWALKER
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-gray-400 font-narrative italic mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          "O medo é o caminho para o lado sombrio.
          <br />
          O medo leva à raiva, a raiva leva ao ódio,
          <br />
          o ódio leva ao sofrimento."
        </motion.p>

        {/* Description */}
        <motion.div
          className="bg-imperial-light/30 rounded-xl p-6 mb-10 border border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-gray-300 leading-relaxed">
            Embarque em uma jornada narrativa interativa através da vida de Anakin Skywalker.
            Cada decisão que você tomar moldará seu destino, aproximando-o da luz ou
            empurrando-o para as trevas. A Força está em equilíbrio... por enquanto.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            variant="light"
            size="lg"
            onClick={handleStart}
            isLoading={isLoading}
          >
            {isSessionActive ? 'Nova Jornada' : 'Iniciar Jornada'}
          </Button>

          {isSessionActive && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleContinue}
            >
              Continuar Jornada
            </Button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-16 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
        </motion.p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="fixed left-10 top-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 191, 255, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="fixed right-10 top-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
};
