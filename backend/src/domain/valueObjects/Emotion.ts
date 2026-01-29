// ============================================
// DOMAIN LAYER - VALUE OBJECT: EMOTION
// ============================================
// Representa a emoção dominante de Anakin
// Emoções influenciam a narrativa da IA

export type EmotionType = 
  | 'hope'         // Esperança
  | 'fear'         // Medo
  | 'anger'        // Raiva
  | 'love'         // Amor
  | 'hatred'       // Ódio
  | 'peace'        // Paz
  | 'despair'      // Desespero
  | 'determination'// Determinação
  | 'confusion'    // Confusão
  | 'guilt'        // Culpa
  | 'pride'        // Orgulho
  | 'grief';       // Luto

export interface EmotionMetadata {
  displayName: string;
  description: string;
  alignment: 'light' | 'dark' | 'neutral';
  intensity: number; // 1-10
}

/**
 * Emoção - Value Object
 * Define o estado emocional dominante de Anakin
 */
export class Emotion {
  private readonly _value: EmotionType;
  
  private static readonly EMOTION_METADATA: Record<EmotionType, EmotionMetadata> = {
    hope: {
      displayName: 'Esperança',
      description: 'Uma luz que guia através da escuridão',
      alignment: 'light',
      intensity: 6,
    },
    fear: {
      displayName: 'Medo',
      description: 'O medo leva à raiva, a raiva leva ao ódio',
      alignment: 'dark',
      intensity: 7,
    },
    anger: {
      displayName: 'Raiva',
      description: 'Uma chama que consome de dentro para fora',
      alignment: 'dark',
      intensity: 8,
    },
    love: {
      displayName: 'Amor',
      description: 'A força mais poderosa do universo',
      alignment: 'neutral',
      intensity: 9,
    },
    hatred: {
      displayName: 'Ódio',
      description: 'A corrupção final do coração',
      alignment: 'dark',
      intensity: 10,
    },
    peace: {
      displayName: 'Paz',
      description: 'Harmonia com a Força',
      alignment: 'light',
      intensity: 5,
    },
    despair: {
      displayName: 'Desespero',
      description: 'Quando toda esperança parece perdida',
      alignment: 'dark',
      intensity: 9,
    },
    determination: {
      displayName: 'Determinação',
      description: 'A vontade inabalável de perseguir um objetivo',
      alignment: 'neutral',
      intensity: 7,
    },
    confusion: {
      displayName: 'Confusão',
      description: 'Perdido entre luz e sombra',
      alignment: 'neutral',
      intensity: 5,
    },
    guilt: {
      displayName: 'Culpa',
      description: 'O peso das escolhas passadas',
      alignment: 'neutral',
      intensity: 6,
    },
    pride: {
      displayName: 'Orgulho',
      description: 'A arrogância que precede a queda',
      alignment: 'dark',
      intensity: 6,
    },
    grief: {
      displayName: 'Luto',
      description: 'A dor da perda que ecoa na alma',
      alignment: 'neutral',
      intensity: 8,
    },
  };

  private constructor(value: EmotionType) {
    this._value = value;
  }

  static create(value: EmotionType): Emotion {
    if (!this.EMOTION_METADATA[value]) {
      throw new Error(`Invalid emotion type: ${value}`);
    }
    return new Emotion(value);
  }

  static getAllTypes(): EmotionType[] {
    return Object.keys(this.EMOTION_METADATA) as EmotionType[];
  }

  get value(): EmotionType {
    return this._value;
  }

  get metadata(): EmotionMetadata {
    return Emotion.EMOTION_METADATA[this._value];
  }

  get displayName(): string {
    return this.metadata.displayName;
  }

  get description(): string {
    return this.metadata.description;
  }

  get alignment(): 'light' | 'dark' | 'neutral' {
    return this.metadata.alignment;
  }

  get intensity(): number {
    return this.metadata.intensity;
  }

  /**
   * Verifica se é uma emoção do lado sombrio
   */
  isDarkSide(): boolean {
    return this.alignment === 'dark';
  }

  /**
   * Verifica se é uma emoção do lado luminoso
   */
  isLightSide(): boolean {
    return this.alignment === 'light';
  }

  equals(other: Emotion): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
