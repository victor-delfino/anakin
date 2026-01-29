// ============================================
// HOOKS - useDecision
// ============================================

import { useState, useCallback } from 'react';
import { decisionService } from '../services';
import { useAnakinStore } from '../stores';
import type { EventDecision, DecisionResult, EventDetailResponse } from '../types';

export function useDecision() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetailResponse | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);

  const { 
    sessionId, 
    updateCharacterState, 
    setDecisionResult: storeSetDecisionResult,
    setTimeline,
  } = useAnakinStore();

  const loadEventDetails = useCallback(async (eventId: string) => {
    if (!sessionId) {
      setError('Sessão não encontrada');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await decisionService.getEventDetails(sessionId, eventId);
      setEventDetails(details);
      return details;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar evento';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const processDecision = useCallback(async (
    eventId: string, 
    decision: EventDecision
  ): Promise<DecisionResult | null> => {
    if (!sessionId) {
      setError('Sessão não encontrada');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await decisionService.processDecision(
        sessionId,
        eventId,
        decision.id
      );

      // Atualizar estado global
      updateCharacterState({
        name: result.characterState.name,
        title: result.characterState.title,
        lightSide: result.characterState.lightSide,
        darkSide: result.characterState.darkSide,
        emotion: result.characterState.emotion,
        emotionDescription: result.characterState.emotionDescription,
        hasFallen: result.progression.triggeredFall,
      });

      storeSetDecisionResult(result);
      setDecisionResult(result);

      // Recarregar timeline
      const timeline = await decisionService.getTimeline(sessionId);
      setTimeline(timeline);

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar decisão';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, updateCharacterState, storeSetDecisionResult, setTimeline]);

  const clearDecisionResult = useCallback(() => {
    setDecisionResult(null);
    setEventDetails(null);
  }, []);

  return {
    isLoading,
    error,
    eventDetails,
    decisionResult,
    loadEventDetails,
    processDecision,
    clearDecisionResult,
  };
}
