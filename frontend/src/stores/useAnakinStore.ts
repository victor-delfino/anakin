// ============================================
// STORES - Anakin Store (Zustand)
// ============================================
// Estado global da aplicação
// IMPORTANTE: O frontend NUNCA calcula regras de domínio
// Apenas exibe dados recebidos do backend

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  EmotionType, 
  Alignment,
  TimelineEvent,
  DecisionResult 
} from '../types';

interface AnakinState {
  // Sessão
  sessionId: string | null;
  isSessionActive: boolean;

  // Estado do personagem (recebido do backend)
  characterId: string | null;
  name: string;
  lightSide: number;
  darkSide: number;
  emotion: EmotionType;
  emotionDescription: string;
  title: string;
  titleDescription: string;
  alignment: Alignment;
  isInConflict: boolean;
  hasFallen: boolean;

  // Timeline
  timeline: TimelineEvent[];
  progress: number;
  currentEra: string;

  // Narrativa atual
  currentNarrative: string | null;
  lastDecisionResult: DecisionResult | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSession: (sessionId: string, characterData: {
    id: string;
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
  }) => void;
  
  updateCharacterState: (data: {
    name: string;
    title: string;
    titleDescription?: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
    emotionDescription?: string;
    alignment?: Alignment;
    isInConflict?: boolean;
    hasFallen?: boolean;
  }) => void;

  setTimeline: (data: {
    events: TimelineEvent[];
    progress: number;
    currentEra: string;
  }) => void;

  setNarrative: (narrative: string) => void;
  setDecisionResult: (result: DecisionResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
}

const initialState = {
  sessionId: null,
  isSessionActive: false,
  characterId: null,
  name: 'Anakin Skywalker',
  lightSide: 60,
  darkSide: 20,
  emotion: 'hope' as EmotionType,
  emotionDescription: '',
  title: 'Padawan',
  titleDescription: '',
  alignment: 'light' as Alignment,
  isInConflict: false,
  hasFallen: false,
  timeline: [],
  progress: 0,
  currentEra: '',
  currentNarrative: null,
  lastDecisionResult: null,
  isLoading: false,
  error: null,
};

export const useAnakinStore = create<AnakinState>()(
  persist(
    (set) => ({
      ...initialState,

      setSession: (sessionId, characterData) => set({
        sessionId,
        isSessionActive: true,
        characterId: characterData.id,
        name: characterData.name,
        title: characterData.title,
        lightSide: characterData.lightSide,
        darkSide: characterData.darkSide,
        emotion: characterData.emotion,
        error: null,
      }),

      updateCharacterState: (data) => set((state) => ({
        ...state,
        name: data.name,
        title: data.title,
        titleDescription: data.titleDescription ?? state.titleDescription,
        lightSide: data.lightSide,
        darkSide: data.darkSide,
        emotion: data.emotion,
        emotionDescription: data.emotionDescription ?? state.emotionDescription,
        alignment: data.alignment ?? state.alignment,
        isInConflict: data.isInConflict ?? state.isInConflict,
        hasFallen: data.hasFallen ?? state.hasFallen,
      })),

      setTimeline: (data) => set({
        timeline: data.events,
        progress: data.progress,
        currentEra: data.currentEra,
      }),

      setNarrative: (narrative) => set({
        currentNarrative: narrative,
      }),

      setDecisionResult: (result) => set({
        lastDecisionResult: result,
        currentNarrative: result.narrative,
      }),

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      clearSession: () => set(initialState),
    }),
    {
      name: 'anakin-narrative-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        isSessionActive: state.isSessionActive,
      }),
    }
  )
);

// Selectors para otimização
export const selectMoralState = (state: AnakinState) => ({
  lightSide: state.lightSide,
  darkSide: state.darkSide,
});

export const selectCharacterInfo = (state: AnakinState) => ({
  name: state.name,
  title: state.title,
  emotion: state.emotion,
  hasFallen: state.hasFallen,
});

export const selectNarrative = (state: AnakinState) => state.currentNarrative;

export const selectTimeline = (state: AnakinState) => ({
  events: state.timeline,
  progress: state.progress,
  currentEra: state.currentEra,
});
