// ============================================
// SERVICES - Decision Service
// ============================================

import { api } from './api';
import type { 
  TimelineResponse, 
  EventDetailResponse, 
  DecisionResult 
} from '../types';

export const decisionService = {
  /**
   * Obtém a linha do tempo de eventos
   */
  async getTimeline(sessionId: string): Promise<TimelineResponse> {
    return api.get<TimelineResponse>(`/session/${sessionId}/timeline`);
  },

  /**
   * Obtém detalhes de um evento específico
   */
  async getEventDetails(sessionId: string, eventId: string): Promise<EventDetailResponse> {
    return api.get<EventDetailResponse>(`/session/${sessionId}/event/${eventId}`);
  },

  /**
   * Processa uma decisão do usuário
   */
  async processDecision(
    sessionId: string,
    eventId: string,
    decisionId: string
  ): Promise<DecisionResult> {
    return api.post<DecisionResult>(`/session/${sessionId}/event/${eventId}/decision`, {
      decisionId,
    });
  },
};
