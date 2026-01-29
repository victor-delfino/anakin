// ============================================
// APPLICATION LAYER - REPOSITORY INTERFACES
// ============================================
// Contratos para acesso a dados
// Implementação na camada de infraestrutura

import { Character } from '../../domain/entities/Character.js';
import { CanonicalEvent } from '../../domain/entities/CanonicalEvent.js';
import { Decision } from '../../domain/entities/Decision.js';
import { UserDecisionRecord } from '../../domain/entities/UserDecisionRecord.js';

export interface CharacterRepository {
  findById(id: string): Promise<Character | null>;
  findBySessionId(sessionId: string): Promise<Character | null>;
  save(character: Character): Promise<void>;
  create(character: Character, sessionId: string): Promise<void>;
}

export interface EventRepository {
  findById(id: string): Promise<CanonicalEvent | null>;
  findAll(): Promise<CanonicalEvent[]>;
  findByEra(era: string): Promise<CanonicalEvent[]>;
  findNextEvents(completedEventIds: string[]): Promise<CanonicalEvent[]>;
}

export interface DecisionRepository {
  findById(id: string): Promise<Decision | null>;
  findByEventId(eventId: string): Promise<Decision[]>;
}

export interface UserDecisionRecordRepository {
  save(record: UserDecisionRecord): Promise<void>;
  findBySessionId(sessionId: string): Promise<UserDecisionRecord[]>;
  findByCharacterId(characterId: string): Promise<UserDecisionRecord[]>;
  getCompletedEventIds(sessionId: string): Promise<string[]>;
}
