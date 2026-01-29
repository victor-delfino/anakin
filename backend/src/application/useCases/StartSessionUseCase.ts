// ============================================
// APPLICATION LAYER - USE CASE: START SESSION
// ============================================
// Inicia uma nova sessão narrativa para o usuário
// Cria Anakin no estado inicial

import { v4 as uuid } from 'uuid';
import { Character } from '../../domain/entities/Character.js';
import { CharacterRepository } from '../repositories/index.js';
import { CacheService } from '../services/CacheService.js';

export interface StartSessionInput {
  userId?: string;
}

export interface StartSessionOutput {
  sessionId: string;
  character: {
    id: string;
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: string;
  };
}

export class StartSessionUseCase {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly cacheService: CacheService
  ) {}

  async execute(input: StartSessionInput): Promise<StartSessionOutput> {
    // Gerar ID de sessão
    const sessionId = uuid();

    // Criar Anakin no estado inicial
    const anakin = Character.createAnakin();

    // Persistir
    await this.characterRepository.create(anakin, sessionId);

    // Cachear sessão
    await this.cacheService.set(
      `session:${sessionId}`,
      {
        characterId: anakin.id,
        startedAt: new Date().toISOString(),
      },
      60 * 60 * 24 // 24 horas TTL
    );

    return {
      sessionId,
      character: {
        id: anakin.id,
        name: anakin.name,
        title: anakin.title.displayName,
        lightSide: anakin.moralState.lightSide,
        darkSide: anakin.moralState.darkSide,
        emotion: anakin.currentEmotion.value,
      },
    };
  }
}
