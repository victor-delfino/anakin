// ============================================
// DOMAIN LAYER - CANONICAL EVENT ENTITY
// ============================================
// Representa eventos canônicos da saga Star Wars
// Eventos são imutáveis - representam fatos históricos

import { v4 as uuid } from 'uuid';

export type EventEra = 'phantom_menace' | 'attack_of_clones' | 'clone_wars' | 'revenge_of_sith';

export interface CanonicalEventProps {
  id?: string;
  title: string;
  description: string;
  era: EventEra;
  chronologicalOrder: number;
  isKeyMoment: boolean;
  requiredPreviousEventId?: string;
  createdAt?: Date;
}

/**
 * Evento Canônico - Momentos fixos da história de Anakin
 * Estes eventos são pré-definidos e não podem ser alterados
 */
export class CanonicalEvent {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _description: string;
  private readonly _era: EventEra;
  private readonly _chronologicalOrder: number;
  private readonly _isKeyMoment: boolean;
  private readonly _requiredPreviousEventId?: string;
  private readonly _createdAt: Date;

  private constructor(props: CanonicalEventProps) {
    this._id = props.id ?? uuid();
    this._title = props.title;
    this._description = props.description;
    this._era = props.era;
    this._chronologicalOrder = props.chronologicalOrder;
    this._isKeyMoment = props.isKeyMoment;
    this._requiredPreviousEventId = props.requiredPreviousEventId;
    this._createdAt = props.createdAt ?? new Date();
  }

  static create(props: CanonicalEventProps): CanonicalEvent {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Event title is required');
    }
    if (props.chronologicalOrder < 0) {
      throw new Error('Chronological order must be non-negative');
    }
    return new CanonicalEvent(props);
  }

  static reconstitute(props: CanonicalEventProps): CanonicalEvent {
    return new CanonicalEvent(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get era(): EventEra {
    return this._era;
  }

  get chronologicalOrder(): number {
    return this._chronologicalOrder;
  }

  get isKeyMoment(): boolean {
    return this._isKeyMoment;
  }

  get requiredPreviousEventId(): string | undefined {
    return this._requiredPreviousEventId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Verifica se este evento pode ser acessado dado o evento anterior
   */
  canBeAccessedAfter(previousEventId?: string): boolean {
    if (!this._requiredPreviousEventId) {
      return true;
    }
    return this._requiredPreviousEventId === previousEventId;
  }

  /**
   * Retorna nome legível da era
   */
  getEraDisplayName(): string {
    const eraNames: Record<EventEra, string> = {
      phantom_menace: 'A Ameaça Fantasma',
      attack_of_clones: 'Ataque dos Clones',
      clone_wars: 'Guerras Clônicas',
      revenge_of_sith: 'A Vingança dos Sith',
    };
    return eraNames[this._era];
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      era: this._era,
      eraDisplayName: this.getEraDisplayName(),
      chronologicalOrder: this._chronologicalOrder,
      isKeyMoment: this._isKeyMoment,
      requiredPreviousEventId: this._requiredPreviousEventId,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
