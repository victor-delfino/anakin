// ============================================
// HOOKS - useSession
// ============================================

import { useState, useCallback, useEffect } from 'react';
import { anakinService, decisionService } from '../services';
import { useAnakinStore } from '../stores';

export function useSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    sessionId,
    isSessionActive,
    setSession,
    setTimeline,
    updateCharacterState,
    clearSession,
    setLoading,
    setError: setStoreError,
  } = useAnakinStore();

  // Iniciar nova sessão
  const startNewSession = useCallback(async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const response = await anakinService.startSession();
      
      setSession(response.sessionId, response.character);

      // Carregar timeline inicial
      const timeline = await decisionService.getTimeline(response.sessionId);
      setTimeline(timeline);

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao iniciar sessão';
      setError(message);
      setStoreError(message);
      return null;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [setSession, setTimeline, setLoading, setStoreError]);

  // Restaurar sessão existente
  const restoreSession = useCallback(async () => {
    if (!sessionId) return false;

    setIsLoading(true);
    setLoading(true);

    try {
      // Carregar estado do personagem
      const state = await anakinService.getCharacterState(sessionId);
      
      updateCharacterState({
        name: state.character.name,
        title: state.character.title,
        titleDescription: state.character.titleDescription,
        lightSide: state.character.lightSide,
        darkSide: state.character.darkSide,
        emotion: state.character.emotion,
        emotionDescription: state.character.emotionDescription,
        alignment: state.character.alignment,
        isInConflict: state.character.isInConflict,
        hasFallen: state.character.hasFallen,
      });

      // Carregar timeline
      const timeline = await decisionService.getTimeline(sessionId);
      setTimeline(timeline);

      return true;
    } catch (err) {
      // Sessão inválida, limpar
      clearSession();
      return false;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [sessionId, updateCharacterState, setTimeline, clearSession, setLoading]);

  // Tentar restaurar sessão ao montar
  useEffect(() => {
    if (sessionId && isSessionActive) {
      restoreSession();
    }
  }, []); // Apenas na montagem

  const endSession = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    sessionId,
    isSessionActive,
    isLoading,
    error,
    startNewSession,
    restoreSession,
    endSession,
  };
}
