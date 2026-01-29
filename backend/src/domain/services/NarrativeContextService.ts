// ============================================
// DOMAIN LAYER - SERVICE: NARRATIVE CONTEXT
// ============================================
// Serviço de domínio para preparar contexto narrativo
// Este contexto será enviado para o serviço de IA

import { Character } from '../entities/Character.js';
import { CanonicalEvent } from '../entities/CanonicalEvent.js';
import { Decision } from '../entities/Decision.js';
import { MoralProgressionResult } from '../rules/MoralProgressionRules.js';

export interface NarrativeContext {
  character: {
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: string;
    emotionDescription: string;
    alignment: string;
    isInConflict: boolean;
    hasFallen: boolean;
  };
  event: {
    title: string;
    description: string;
    era: string;
    isKeyMoment: boolean;
  };
  decision: {
    text: string;
    alignment: string;
    narrativeContext: string;
  };
  progression: {
    titleChanged: boolean;
    previousTitle: string;
    newTitle: string;
    triggeredFall: boolean;
    triggeredRedemption: boolean;
    moralShift: string;
  };
}

/**
 * Serviço de Contexto Narrativo
 * Prepara dados do domínio para interpretação pela IA
 * 
 * IMPORTANTE: Este serviço NÃO executa IA
 * Apenas estrutura o contexto para ser enviado ao serviço de IA
 */
export class NarrativeContextService {
  
  /**
   * Monta contexto completo para geração de narrativa
   */
  static buildContext(
    character: Character,
    event: CanonicalEvent,
    decision: Decision,
    progression: MoralProgressionResult
  ): NarrativeContext {
    return {
      character: {
        name: character.name,
        title: character.title.displayName,
        lightSide: character.moralState.lightSide,
        darkSide: character.moralState.darkSide,
        emotion: character.currentEmotion.displayName,
        emotionDescription: character.currentEmotion.description,
        alignment: character.moralState.getDominantAlignment(),
        isInConflict: character.moralState.isInConflict(),
        hasFallen: character.hasFallen(),
      },
      event: {
        title: event.title,
        description: event.description,
        era: event.getEraDisplayName(),
        isKeyMoment: event.isKeyMoment,
      },
      decision: {
        text: decision.text,
        alignment: decision.alignment,
        narrativeContext: decision.narrativeContext,
      },
      progression: {
        titleChanged: progression.titleChanged,
        previousTitle: progression.previousTitle,
        newTitle: progression.newTitle,
        triggeredFall: progression.triggeredFall,
        triggeredRedemption: progression.triggeredRedemption,
        moralShift: progression.moralShift,
      },
    };
  }

  /**
   * Gera prompt base para a IA
   * Define o papel e restrições da IA
   */
  static generatePromptTemplate(context: NarrativeContext): string {
    return `Você é a consciência interna de ${context.character.name}.

ESTADO ATUAL:
- Título: ${context.character.title}
- Lado Luminoso: ${context.character.lightSide}/100
- Lado Sombrio: ${context.character.darkSide}/100
- Emoção Dominante: ${context.character.emotion} - "${context.character.emotionDescription}"
- Alinhamento: ${context.character.alignment}
- Em Conflito Interno: ${context.character.isInConflict ? 'Sim' : 'Não'}
- Caiu para o Lado Sombrio: ${context.character.hasFallen ? 'Sim' : 'Não'}

EVENTO ATUAL:
- "${context.event.title}" (${context.event.era})
- ${context.event.description}
${context.event.isKeyMoment ? '⚡ Este é um MOMENTO DECISIVO na história.' : ''}

DECISÃO TOMADA:
- "${context.decision.text}"
- Alinhamento da decisão: ${context.decision.alignment}
- Contexto: ${context.decision.narrativeContext}

CONSEQUÊNCIAS:
${context.progression.titleChanged ? `- Título mudou de ${context.progression.previousTitle} para ${context.progression.newTitle}` : '- Título mantido'}
${context.progression.triggeredFall ? '⚠️ A QUEDA PARA O LADO SOMBRIO FOI ATIVADA' : ''}
${context.progression.triggeredRedemption ? '✨ UM CAMINHO PARA REDENÇÃO SE ABRIU' : ''}
- Mudança moral: ${context.progression.moralShift}

INSTRUÇÕES:
1. Narre o conflito interno de Anakin após esta decisão
2. Descreva as consequências emocionais
3. Adapte o tom ao estado moral atual
4. Use segunda pessoa ("você sente...", "você percebe...")
5. Mantenha consistência com o cânone Star Wars
6. Se houve queda, narre a transformação dramática
7. Máximo 3 parágrafos

IMPORTANTE: Você apenas NARRA e INTERPRETA. Você NÃO toma decisões nem altera estados.`;
  }
}
