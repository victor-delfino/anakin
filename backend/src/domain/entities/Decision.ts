// ============================================
// DOMAIN LAYER - DECISION ENTITY
// ============================================
// Representa uma decisão que o usuário pode tomar
// Decisões têm impacto moral determinístico

import { v4 as uuid } from 'uuid';
import { Emotion, EmotionType } from '../valueObjects/Emotion.js';

export type DecisionAlignment = 'light' | 'dark' | 'neutral';

export interface DecisionImpact {
  lightSideDelta: number;
  darkSideDelta: number;
  resultingEmotion: EmotionType;
}

export interface DecisionProps {
  id?: string;
  eventId: string;
  text: string;
  alignment: DecisionAlignment;
  impact: DecisionImpact;
  narrativeContext: string;
  order: number;
  createdAt?: Date;
}

/**
 * Decisão - Escolha disponível em um evento
 * Cada decisão tem impacto determinístico no estado moral
 */
export class Decision {
  private readonly _id: string;
  private readonly _eventId: string;
  private readonly _text: string;
  private readonly _alignment: DecisionAlignment;
  private readonly _impact: DecisionImpact;
  private readonly _narrativeContext: string;
  private readonly _order: number;
  private readonly _createdAt: Date;

  private constructor(props: DecisionProps) {
    this._id = props.id ?? uuid();
    this._eventId = props.eventId;
    this._text = props.text;
    this._alignment = props.alignment;
    this._impact = props.impact;
    this._narrativeContext = props.narrativeContext;
    this._order = props.order;
    this._createdAt = props.createdAt ?? new Date();
  }

  static create(props: DecisionProps): Decision {
    if (!props.text || props.text.trim().length === 0) {
      throw new Error('Decision text is required');
    }
    if (!props.eventId) {
      throw new Error('Event ID is required');
    }
    return new Decision(props);
  }

  static reconstitute(props: DecisionProps): Decision {
    return new Decision(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get eventId(): string {
    return this._eventId;
  }

  get text(): string {
    return this._text;
  }

  get alignment(): DecisionAlignment {
    return this._alignment;
  }

  get impact(): DecisionImpact {
    return { ...this._impact };
  }

  get narrativeContext(): string {
    return this._narrativeContext;
  }

  get order(): number {
    return this._order;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Verifica se é uma decisão do lado luminoso
   */
  isLightSide(): boolean {
    return this._alignment === 'light';
  }

  /**
   * Verifica se é uma decisão do lado sombrio
   */
  isDarkSide(): boolean {
    return this._alignment === 'dark';
  }

  /**
   * Retorna a emoção resultante como Value Object
   */
  getResultingEmotion(): Emotion {
    return Emotion.create(this._impact.resultingEmotion);
  }

  /**
   * Calcula o peso moral líquido (-100 a +100)
   * Positivo = tendência luminosa, Negativo = tendência sombria
   */
  getNetMoralWeight(): number {
    return this._impact.lightSideDelta - this._impact.darkSideDelta;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      eventId: this._eventId,
      text: this._text,
      alignment: this._alignment,
      impact: this._impact,
      narrativeContext: this._narrativeContext,
      order: this._order,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
