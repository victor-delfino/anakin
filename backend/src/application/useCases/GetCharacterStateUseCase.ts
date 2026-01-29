// ============================================
// APPLICATION LAYER - USE CASE: GET CHARACTER STATE
// ============================================
// Retorna o estado atual do personagem

import { CharacterRepository, UserDecisionRecordRepository } from '../repositories/index.js';

export interface GetCharacterStateInput {
  sessionId: string;
}

export interface GetCharacterStateOutput {
  character: {
    id: string;
    name: string;
    title: string;
    titleDescription: string;
    lightSide: number;
    darkSide: number;
    emotion: string;
    emotionDescription: string;
    alignment: string;
    isInConflict: boolean;
    hasFallen: boolean;
  };
  stats: {
    decisionsCount: number;
    lightDecisions: number;
    darkDecisions: number;
  };
}

export class GetCharacterStateUseCase {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly userDecisionRepository: UserDecisionRecordRepository
  ) {}

  async execute(input: GetCharacterStateInput): Promise<GetCharacterStateOutput> {
    const character = await this.characterRepository.findBySessionId(input.sessionId);
    if (!character) {
      throw new Error('Session not found');
    }

    const decisions = await this.userDecisionRepository.findBySessionId(input.sessionId);
    
    // Calcular estatísticas
    let lightDecisions = 0;
    let darkDecisions = 0;

    for (const record of decisions) {
      const shift = record.lightSideAfter - record.lightSideBefore;
      if (shift > 0) lightDecisions++;
      if (shift < 0) darkDecisions++;
    }

    return {
      character: {
        id: character.id,
        name: character.name,
        title: character.title.displayName,
        titleDescription: character.title.description,
        lightSide: character.moralState.lightSide,
        darkSide: character.moralState.darkSide,
        emotion: character.currentEmotion.value,
        emotionDescription: character.currentEmotion.description,
        alignment: character.moralState.getDominantAlignment(),
        isInConflict: character.moralState.isInConflict(),
        hasFallen: character.hasFallen(),
      },
      stats: {
        decisionsCount: decisions.length,
        lightDecisions,
        darkDecisions,
      },
    };
  }
}
