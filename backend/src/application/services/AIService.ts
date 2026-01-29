// ============================================
// APPLICATION LAYER - AI SERVICE INTERFACE
// ============================================
// Contrato para serviço de IA
// A IA apenas gera narrativa, NUNCA toma decisões

import { NarrativeContext } from '../../domain/services/NarrativeContextService.js';

export interface GeneratedNarrative {
  text: string;
  generatedAt: Date;
  tokensUsed?: number;
}

/**
 * Interface do Serviço de IA
 * 
 * CONTRATO FUNDAMENTAL:
 * - A IA recebe APENAS contexto
 * - A IA retorna APENAS texto narrativo
 * - A IA NUNCA modifica estado
 * - A IA NUNCA toma decisões
 */ 
export interface AIService {
  /**
   * Gera narrativa interpretativa baseada no contexto
   * @param context - Contexto preparado pelo domínio
   * @param promptTemplate - Template de prompt com instruções
   * @returns Narrativa gerada
   */
  generateNarrative(
    context: NarrativeContext,
    promptTemplate: string
  ): Promise<GeneratedNarrative>;

  /**
   * Verifica se o serviço está disponível
   */
  isAvailable(): Promise<boolean>;
}
