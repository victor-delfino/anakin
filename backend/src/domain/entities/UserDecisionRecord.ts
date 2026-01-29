// ============================================
// DOMAIN LAYER - USER DECISION RECORD ENTITY
// ============================================
// Registra as decisões tomadas pelo usuário
// Mantém histórico completo da jornada narrativa

import { v4 as uuid } from 'uuid';

export interface UserDecisionRecordProps {
  id?: string;
  sessionId: string;
  characterId: string;
  eventId: string;
  decisionId: string;
  lightSideBefore: number;
  darkSideBefore: number;
  lightSideAfter: number;
  darkSideAfter: number;
  emotionBefore: string;
  emotionAfter: string;
  titleBefore: string;
  titleAfter: string;
  narrativeGenerated?: string;
  createdAt?: Date;
}

/**
 * Registro de Decisão do Usuário
 * Captura snapshot do estado antes e depois da decisão
 */
export class UserDecisionRecord {
  private readonly _id: string;
  private readonly _sessionId: string;
  private readonly _characterId: string;
  private readonly _eventId: string;
  private readonly _decisionId: string;
  private readonly _lightSideBefore: number;
  private readonly _darkSideBefore: number;
  private readonly _lightSideAfter: number;
  private readonly _darkSideAfter: number;
  private readonly _emotionBefore: string;
  private readonly _emotionAfter: string;
  private readonly _titleBefore: string;
  private readonly _titleAfter: string;
  private _narrativeGenerated?: string;
  private readonly _createdAt: Date;

  private constructor(props: UserDecisionRecordProps) {
    this._id = props.id ?? uuid();
    this._sessionId = props.sessionId;
    this._characterId = props.characterId;
    this._eventId = props.eventId;
    this._decisionId = props.decisionId;
    this._lightSideBefore = props.lightSideBefore;
    this._darkSideBefore = props.darkSideBefore;
    this._lightSideAfter = props.lightSideAfter;
    this._darkSideAfter = props.darkSideAfter;
    this._emotionBefore = props.emotionBefore;
    this._emotionAfter = props.emotionAfter;
    this._titleBefore = props.titleBefore;
    this._titleAfter = props.titleAfter;
    this._narrativeGenerated = props.narrativeGenerated;
    this._createdAt = props.createdAt ?? new Date();
  }

  static create(props: UserDecisionRecordProps): UserDecisionRecord {
    return new UserDecisionRecord(props);
  }

  static reconstitute(props: UserDecisionRecordProps): UserDecisionRecord {
    return new UserDecisionRecord(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  get characterId(): string {
    return this._characterId;
  }

  get eventId(): string {
    return this._eventId;
  }

  get decisionId(): string {
    return this._decisionId;
  }

  get lightSideBefore(): number {
    return this._lightSideBefore;
  }

  get darkSideBefore(): number {
    return this._darkSideBefore;
  }

  get lightSideAfter(): number {
    return this._lightSideAfter;
  }

  get darkSideAfter(): number {
    return this._darkSideAfter;
  }

  get emotionBefore(): string {
    return this._emotionBefore;
  }

  get emotionAfter(): string {
    return this._emotionAfter;
  }

  get titleBefore(): string {
    return this._titleBefore;
  }

  get titleAfter(): string {
    return this._titleAfter;
  }

  get narrativeGenerated(): string | undefined {
    return this._narrativeGenerated;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Adiciona narrativa gerada pela IA
   */
  attachNarrative(narrative: string): UserDecisionRecord {
    return new UserDecisionRecord({
      id: this._id,
      sessionId: this._sessionId,
      characterId: this._characterId,
      eventId: this._eventId,
      decisionId: this._decisionId,
      lightSideBefore: this._lightSideBefore,
      darkSideBefore: this._darkSideBefore,
      lightSideAfter: this._lightSideAfter,
      darkSideAfter: this._darkSideAfter,
      emotionBefore: this._emotionBefore,
      emotionAfter: this._emotionAfter,
      titleBefore: this._titleBefore,
      titleAfter: this._titleAfter,
      narrativeGenerated: narrative,
      createdAt: this._createdAt,
    });
  }

  /**
   * Verifica se houve queda para o lado sombrio nesta decisão
   */
  triggeredFall(): boolean {
    const wasFallen = this._darkSideBefore >= 80;
    const isFallen = this._darkSideAfter >= 80;
    return !wasFallen && isFallen;
  }

  /**
   * Calcula a mudança líquida de alinhamento
   */
  getAlignmentShift(): number {
    const beforeBalance = this._lightSideBefore - this._darkSideBefore;
    const afterBalance = this._lightSideAfter - this._darkSideAfter;
    return afterBalance - beforeBalance;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      sessionId: this._sessionId,
      characterId: this._characterId,
      eventId: this._eventId,
      decisionId: this._decisionId,
      lightSideBefore: this._lightSideBefore,
      darkSideBefore: this._darkSideBefore,
      lightSideAfter: this._lightSideAfter,
      darkSideAfter: this._darkSideAfter,
      emotionBefore: this._emotionBefore,
      emotionAfter: this._emotionAfter,
      titleBefore: this._titleBefore,
      titleAfter: this._titleAfter,
      narrativeGenerated: this._narrativeGenerated,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
