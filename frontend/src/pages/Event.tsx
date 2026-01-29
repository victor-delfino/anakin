// ============================================
// PAGES - Event
// ============================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { Card, Button, PageLoader } from '../components/ui';
import { ForceMeter, EmotionBadge } from '../components/force';
import { NarrativeBox } from '../components/narrative';
import { DecisionList } from '../components/decision';
import { useDecision, useNarrative } from '../hooks';
import { useAnakinStore } from '../stores';
import type { EventDecision } from '../types';

type EventPhase = 'reading' | 'deciding' | 'result';

export const Event: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [phase, setPhase] = useState<EventPhase>('reading');
  
  const { 
    eventDetails, 
    decisionResult, 
    isLoading, 
    error,
    loadEventDetails, 
    processDecision,
    clearDecisionResult,
  } = useDecision();
  
  const { getNarrativeVariant } = useNarrative();
  
  const sessionId = useAnakinStore(state => state.sessionId);

  // Carregar detalhes do evento
  useEffect(() => {
    if (eventId && sessionId) {
      loadEventDetails(eventId);
    }
  }, [eventId, sessionId, loadEventDetails]);

  // Handler para submissão de decisão
  const handleDecisionSubmit = async (decision: EventDecision) => {
    if (!eventId) return;
    
    const result = await processDecision(eventId, decision);
    if (result) {
      setPhase('result');
    }
  };

  // Handler para continuar após resultado
  const handleContinue = () => {
    clearDecisionResult();
    navigate('/timeline');
  };

  // Handler para voltar
  const handleBack = () => {
    if (phase === 'deciding') {
      setPhase('reading');
    } else {
      navigate('/timeline');
    }
  };

  if (!sessionId) {
    navigate('/');
    return null;
  }

  if (isLoading && !eventDetails) {
    return <PageLoader text="Carregando evento..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-imperial-dark flex items-center justify-center p-6">
        <Card variant="dark" className="max-w-md text-center">
          <h2 className="text-xl text-sith-red mb-4">Erro</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/timeline')}>
            Voltar à Timeline
          </Button>
        </Card>
      </div>
    );
  }

  if (!eventDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-imperial-dark bg-stars">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{phase === 'deciding' ? 'Voltar' : 'Timeline'}</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-star-wars text-white">
                  {eventDetails.event.title}
                </h1>
                {eventDetails.event.isKeyMoment && (
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <p className="text-gray-400">
                {eventDetails.event.eraDisplayName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Character Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="!p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400">
                  {eventDetails.characterState.name} • {eventDetails.characterState.title}
                </span>
                <EmotionBadge 
                  emotion={eventDetails.characterState.emotion} 
                  size="sm"
                />
              </div>
              <div className="w-48">
                <ForceMeter
                  lightSide={eventDetails.characterState.lightSide}
                  darkSide={eventDetails.characterState.darkSide}
                  showLabels={false}
                  size="sm"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {/* Phase: Reading */}
          {phase === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant={eventDetails.event.isKeyMoment ? 'highlighted' : 'default'}>
                <p className="text-lg text-gray-200 leading-relaxed font-narrative">
                  {eventDetails.event.description}
                </p>
              </Card>

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setPhase('deciding')}
                >
                  Fazer Minha Escolha
                </Button>
              </div>
            </motion.div>
          )}

          {/* Phase: Deciding */}
          {phase === 'deciding' && (
            <motion.div
              key="deciding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <DecisionList
                  decisions={eventDetails.decisions}
                  onSubmit={handleDecisionSubmit}
                  isLoading={isLoading}
                />
              </Card>
            </motion.div>
          )}

          {/* Phase: Result */}
          {phase === 'result' && decisionResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Decision Made */}
              <Card className="border-l-4 border-l-jedi-blue">
                <p className="text-sm text-gray-400 mb-2">Sua escolha:</p>
                <p className="text-gray-200 italic">"{decisionResult.decision.text}"</p>
              </Card>

              {/* Narrative */}
              <NarrativeBox
                narrative={decisionResult.narrative}
                title="Conflito Interior"
                variant={getNarrativeVariant() as 'default' | 'fall' | 'redemption' | 'conflict'}
              />

              {/* State Changes */}
              <Card>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                  Consequências
                </h3>
                
                <div className="space-y-4">
                  {/* Moral shift */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Mudança Moral</span>
                    <span className={`font-medium ${
                      decisionResult.progression.moralShift === 'toward_light'
                        ? 'text-jedi-blue'
                        : decisionResult.progression.moralShift === 'toward_dark'
                          ? 'text-sith-red'
                          : 'text-gray-400'
                    }`}>
                      {decisionResult.progression.moralShift === 'toward_light'
                        ? '↑ Em direção à Luz'
                        : decisionResult.progression.moralShift === 'toward_dark'
                          ? '↓ Em direção às Trevas'
                          : '― Estável'}
                    </span>
                  </div>

                  {/* Title change */}
                  {decisionResult.progression.titleChanged && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Título</span>
                      <span className="text-yellow-400">
                        {decisionResult.characterState.previousTitle} → {decisionResult.characterState.title}
                      </span>
                    </div>
                  )}

                  {/* New emotion */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Emoção</span>
                    <EmotionBadge emotion={decisionResult.characterState.emotion} size="sm" />
                  </div>

                  {/* Updated force meter */}
                  <ForceMeter
                    lightSide={decisionResult.characterState.lightSide}
                    darkSide={decisionResult.characterState.darkSide}
                  />
                </div>

                {/* Fall warning */}
                {decisionResult.progression.triggeredFall && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-sith-red/20 border border-sith-red/50 rounded-lg text-center"
                  >
                    <p className="text-sith-red font-bold text-lg">
                      ⚠️ A QUEDA ESTÁ COMPLETA
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Anakin Skywalker se foi. Apenas Darth Vader permanece.
                    </p>
                  </motion.div>
                )}
              </Card>

              {/* Continue button */}
              <div className="flex justify-center">
                <Button
                  variant={decisionResult.progression.triggeredFall ? 'danger' : 'primary'}
                  size="lg"
                  onClick={handleContinue}
                >
                  Continuar Jornada
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
