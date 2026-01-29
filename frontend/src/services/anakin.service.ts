// ============================================
// SERVICES - Anakin Service
// ============================================

import { api } from './api';
import type { SessionResponse, CharacterState } from '../types';

export const anakinService = {
  /**
   * Inicia uma nova sessão narrativa
   */
  async startSession(): Promise<SessionResponse> {
    return api.post<SessionResponse>('/session');
  },

  /**
   * Obtém o estado atual do personagem
   */
  async getCharacterState(sessionId: string): Promise<CharacterState> {
    return api.get<CharacterState>(`/session/${sessionId}/character`);
  },
};
