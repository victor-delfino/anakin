// ============================================
// PAGES - Timeline
// ============================================

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Lock, CheckCircle } from 'lucide-react';
import { Card, Button, PageLoader } from '../components/ui';
import { ForceMeter, LightDarkBalance, EmotionBadge } from '../components/force';
import { useAnakinStore, selectTimeline, selectMoralState, selectCharacterInfo } from '../stores';
import { useSession } from '../hooks';
import { decisionService } from '../services';
import type { TimelineEvent } from '../types';

export const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId, isSessionActive, restoreSession: _restoreSession, isLoading } = useSession();
  
  const { events, progress, currentEra } = useAnakinStore(selectTimeline);
  const { lightSide, darkSide } = useAnakinStore(selectMoralState);
  const { name, title, emotion, hasFallen } = useAnakinStore(selectCharacterInfo);
  const setTimeline = useAnakinStore(state => state.setTimeline);

  // Redirecionar se não tiver sessão
  useEffect(() => {
    if (!isSessionActive && !sessionId) {
      navigate('/');
    }
  }, [isSessionActive, sessionId, navigate]);

  // Carregar timeline
  useEffect(() => {
    if (sessionId && events.length === 0) {
      decisionService.getTimeline(sessionId).then(setTimeline);
    }
  }, [sessionId, events.length, setTimeline]);

  const handleEventClick = (event: TimelineEvent) => {
    if (event.status === 'available') {
      navigate(`/event/${event.id}`);
    }
  };

  const getEventIcon = (status: TimelineEvent['status'], isKeyMoment: boolean) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (status === 'locked') {
      return <Lock className="w-5 h-5 text-gray-600" />;
    }
    if (isKeyMoment) {
      return <Star className="w-5 h-5 text-yellow-400" />;
    }
    return <ChevronRight className="w-5 h-5 text-jedi-blue" />;
  };

  if (isLoading) {
    return <PageLoader text="Carregando sua jornada..." />;
  }

  // Agrupar eventos por era
  const eventsByEra = events.reduce((acc, event) => {
    if (!acc[event.eraDisplayName]) {
      acc[event.eraDisplayName] = [];
    }
    acc[event.eraDisplayName].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  return (
    <div className="min-h-screen bg-imperial-dark bg-stars">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-star-wars text-white mb-2">
                {name}
              </h1>
              <p className="text-gray-400">
                {title} • {currentEra || 'Início da Jornada'}
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          </div>
        </motion.div>

        {/* Character Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card variant={hasFallen ? 'dark' : 'default'}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Force Balance */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                  Equilíbrio da Força
                </h3>
                <LightDarkBalance 
                  lightSide={lightSide} 
                  darkSide={darkSide}
                  hasFallen={hasFallen}
                />
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                  Estado Atual
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Emoção Dominante</span>
                    <EmotionBadge emotion={emotion} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Progresso</span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>
                  <ForceMeter lightSide={lightSide} darkSide={darkSide} size="sm" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-star-wars text-white mb-6">
            Linha do Tempo
          </h2>

          <div className="space-y-8">
            {Object.entries(eventsByEra).map(([era, eraEvents], eraIndex) => (
              <motion.div
                key={era}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * eraIndex }}
              >
                {/* Era header */}
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  {era}
                </h3>

                {/* Events */}
                <div className="space-y-3 ml-4 border-l-2 border-gray-700 pl-6">
                  {eraEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      onClick={() => handleEventClick(event)}
                      className={`
                        relative p-4 rounded-lg border transition-all duration-200
                        ${event.status === 'available'
                          ? 'bg-imperial-light/60 border-jedi-blue/50 cursor-pointer hover:border-jedi-blue hover:shadow-lg hover:shadow-jedi-blue/20'
                          : event.status === 'completed'
                            ? 'bg-green-900/20 border-green-700/30'
                            : 'bg-gray-800/30 border-gray-700/30 opacity-50'
                        }
                      `}
                    >
                      {/* Connection dot */}
                      <div className={`
                        absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2
                        ${event.status === 'completed'
                          ? 'bg-green-500 border-green-400'
                          : event.status === 'available'
                            ? 'bg-jedi-blue border-force-light-400'
                            : 'bg-gray-700 border-gray-600'
                        }
                      `} />

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-semibold ${
                              event.status === 'locked' ? 'text-gray-500' : 'text-white'
                            }`}>
                              {event.title}
                            </h4>
                            {event.isKeyMoment && event.status !== 'locked' && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                Momento Decisivo
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            event.status === 'locked' ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {event.status === 'locked' 
                              ? 'Complete o evento anterior para desbloquear'
                              : event.description.slice(0, 100) + '...'
                            }
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {getEventIcon(event.status, event.isKeyMoment)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhum evento encontrado. Inicie uma nova jornada.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
