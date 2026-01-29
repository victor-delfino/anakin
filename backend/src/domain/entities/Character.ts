// ============================================
// DOMAIN LAYER - ENTITIES
// ============================================
// Representam conceitos centrais do domínio narrativo
// Entidades possuem identidade única e ciclo de vida

import { v4 as uuid } from 'uuid';
import { MoralState, MoralStateProps } from '../valueObjects/MoralState.js';
import { Emotion } from '../valueObjects/Emotion.js';
import { Title, TitleType } from '../valueObjects/Title.js';

export interface CharacterProps {
  id?: string;
  name: string;
  moralState: MoralState;
  currentEmotion: Emotion;
  title: Title;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Entidade Personagem - Representa Anakin Skywalker
 * Possui estado moral, emoção dominante e título atual
 */
export class Character {
  private readonly _id: string;
  private readonly _name: string;
  private _moralState: MoralState;
  private _currentEmotion: Emotion;
  private _title: Title;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CharacterProps) {
    this._id = props.id ?? uuid();
    this._name = props.name;
    this._moralState = props.moralState;
    this._currentEmotion = props.currentEmotion;
    this._title = props.title;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  // Factory method para criar Anakin no estado inicial
  static createAnakin(): Character {
    return new Character({
      name: 'Anakin Skywalker',
      moralState: MoralState.createInitial(),
      currentEmotion: Emotion.create('hope'),
      title: Title.create('padawan'),
    });
  }

  // Factory para reconstituir do banco de dados
  static reconstitute(props: CharacterProps): Character {
    return new Character(props);
  }

  // Getters - Expõem estado de forma imutável
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get moralState(): MoralState {
    return this._moralState;
  }

  get currentEmotion(): Emotion {
    return this._currentEmotion;
  }

  get title(): Title {
    return this._title;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de domínio - Aplicam regras de negócio

  /**
   * Aplica impacto moral baseado em uma decisão
   * Retorna novo estado (imutabilidade)
   */
  applyMoralImpact(lightDelta: number, darkDelta: number): Character {
    const newMoralState = this._moralState.applyImpact(lightDelta, darkDelta);
    
    return new Character({
      id: this._id,
      name: this._name,
      moralState: newMoralState,
      currentEmotion: this._currentEmotion,
      title: this._title,
      createdAt: this._createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Atualiza emoção dominante
   */
  updateEmotion(emotion: Emotion): Character {
    return new Character({
      id: this._id,
      name: this._name,
      moralState: this._moralState,
      currentEmotion: emotion,
      title: this._title,
      createdAt: this._createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Promove ou degrada título baseado no estado moral
   */
  updateTitle(title: Title): Character {
    return new Character({
      id: this._id,
      name: this._name,
      moralState: this._moralState,
      currentEmotion: this._currentEmotion,
      title: title,
      createdAt: this._createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Verifica se caiu para o Lado Sombrio
   */
  hasFallen(): boolean {
    return this._moralState.hasFallenToDarkSide();
  }

  /**
   * Serializa para persistência
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      name: this._name,
      moralState: this._moralState.toJSON(),
      currentEmotion: this._currentEmotion.value,
      title: this._title.value,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
