// ============================================
// PAGES - State (Character State View)
// ============================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { ForceMeter, LightDarkBalance, EmotionBadge } from '../components/force';
import { InnerConflict } from '../components/narrative';
import { useAnakinStore, selectMoralState, selectCharacterInfo } from '../stores';
import { TITLE_DISPLAY, type TitleType } from '../types';

export const State: React.FC = () => {
  const navigate = useNavigate();
  
  const { lightSide, darkSide } = useAnakinStore(selectMoralState);
  const { name, title, emotion, hasFallen } = useAnakinStore(selectCharacterInfo);
  const isInConflict = useAnakinStore(state => state.isInConflict);
  const sessionId = useAnakinStore(state => state.sessionId);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  // Encontrar info do título
  const titleKey = Object.keys(TITLE_DISPLAY).find(
    key => TITLE_DISPLAY[key as TitleType].name === title
  ) as TitleType | undefined;
  
  const titleInfo = titleKey ? TITLE_DISPLAY[titleKey] : null;

  return (
    <div className="min-h-screen bg-imperial-dark bg-stars">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/timeline')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Timeline</span>
          </button>

          <h1 className="text-3xl font-star-wars text-white">
            Estado do Personagem
          </h1>
        </motion.div>

        {/* Character Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card variant={hasFallen ? 'dark' : 'highlighted'}>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-star-wars text-white mb-2">
                {name}
              </h2>
              <p className={`text-xl ${hasFallen ? 'text-sith-red' : 'text-jedi-blue'}`}>
                {title}
              </p>
              {titleInfo && (
                <p className="text-gray-400 mt-2 italic">
                  "{titleInfo.description}"
                </p>
              )}
            </div>

            <div className="flex justify-center mb-6">
              <EmotionBadge emotion={emotion} size="lg" showDescription />
            </div>

            <LightDarkBalance 
              lightSide={lightSide} 
              darkSide={darkSide}
              hasFallen={hasFallen}
            />
          </Card>
        </motion.div>

        {/* Inner Conflict Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-lg font-star-wars text-white text-center mb-6">
              Conflito Interior
            </h3>
            <InnerConflict
              lightSide={lightSide}
              darkSide={darkSide}
              isInConflict={isInConflict}
              emotion={emotion}
            />
          </Card>
        </motion.div>

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <h3 className="text-lg font-star-wars text-white mb-6">
              Métricas da Força
            </h3>
            
            <div className="space-y-6">
              <ForceMeter lightSide={lightSide} darkSide={darkSide} size="lg" />
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-4xl font-bold text-jedi-blue">{lightSide}</p>
                  <p className="text-sm text-gray-400">Lado Luminoso</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-sith-red">{darkSide}</p>
                  <p className="text-sm text-gray-400">Lado Sombrio</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Equilíbrio</span>
                  <span className={`font-bold ${
                    lightSide > darkSide 
                      ? 'text-jedi-blue' 
                      : lightSide < darkSide 
                        ? 'text-sith-red' 
                        : 'text-gray-400'
                  }`}>
                    {lightSide > darkSide 
                      ? `+${lightSide - darkSide} Luz` 
                      : lightSide < darkSide 
                        ? `+${darkSide - lightSide} Trevas` 
                        : 'Equilibrado'}
                  </span>
                </div>
              </div>

              {hasFallen && (
                <div className="pt-4 border-t border-sith-red/30 bg-sith-red/10 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <p className="text-sith-red text-center font-bold">
                    ⚠️ CAÍDO PARA O LADO SOMBRIO
                  </p>
                  <p className="text-gray-400 text-sm text-center mt-2">
                    A escuridão consumiu seu coração
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-4"
        >
          <Button variant="primary" onClick={() => navigate('/timeline')}>
            Voltar à Timeline
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
