// ============================================
// DOMAIN LAYER - VALUE OBJECT: TITLE
// ============================================
// Representa o título/rank de Anakin na narrativa
// Títulos evoluem baseados em eventos e estado moral

export type TitleType = 
  | 'slave'           // Escravo em Tatooine
  | 'padawan'         // Aprendiz Jedi
  | 'jedi_knight'     // Cavaleiro Jedi
  | 'jedi_master'     // Mestre Jedi (nunca alcançado)
  | 'fallen_jedi'     // Jedi Caído
  | 'darth_vader';    // Lorde Sith

export interface TitleMetadata {
  displayName: string;
  description: string;
  era: string;
  requiredDarkSide?: number;
  requiredLightSide?: number;
}

/**
 * Título - Value Object
 * Representa a posição/identidade de Anakin na saga
 */
export class Title {
  private readonly _value: TitleType;

  private static readonly TITLE_METADATA: Record<TitleType, TitleMetadata> = {
    slave: {
      displayName: 'Escravo',
      description: 'Nascido em correntes, mas destinado a algo maior',
      era: 'Infância em Tatooine',
    },
    padawan: {
      displayName: 'Padawan',
      description: 'Aprendiz Jedi sob tutela de Obi-Wan Kenobi',
      era: 'Treinamento Jedi',
    },
    jedi_knight: {
      displayName: 'Cavaleiro Jedi',
      description: 'Herói Sem Medo, general das Guerras Clônicas',
      era: 'Guerras Clônicas',
    },
    jedi_master: {
      displayName: 'Mestre Jedi',
      description: 'O título que lhe foi negado',
      era: 'Nunca alcançado',
      requiredLightSide: 85,
    },
    fallen_jedi: {
      displayName: 'Jedi Caído',
      description: 'Perdido entre a luz e a escuridão',
      era: 'Transição',
      requiredDarkSide: 60,
    },
    darth_vader: {
      displayName: 'Darth Vader',
      description: 'Lorde Sith, servo do Imperador',
      era: 'Era Imperial',
      requiredDarkSide: 80,
    },
  };

  private constructor(value: TitleType) {
    this._value = value;
  }

  static create(value: TitleType): Title {
    if (!this.TITLE_METADATA[value]) {
      throw new Error(`Invalid title type: ${value}`);
    }
    return new Title(value);
  }

  /**
   * REGRA DE DOMÍNIO: Determina título baseado no estado moral
   */
  static determineFromMoralState(
    currentTitle: Title,
    lightSide: number,
    darkSide: number
  ): Title {
    // Queda para Darth Vader
    if (darkSide >= 80) {
      return Title.create('darth_vader');
    }

    // Jedi Caído
    if (darkSide >= 60 && currentTitle.value !== 'darth_vader') {
      return Title.create('fallen_jedi');
    }

    // Mestre Jedi (caminho alternativo)
    if (lightSide >= 85 && darkSide <= 30) {
      return Title.create('jedi_master');
    }

    // Mantém título atual se não houver mudança significativa
    return currentTitle;
  }

  get value(): TitleType {
    return this._value;
  }

  get metadata(): TitleMetadata {
    return Title.TITLE_METADATA[this._value];
  }

  get displayName(): string {
    return this.metadata.displayName;
  }

  get description(): string {
    return this.metadata.description;
  }

  get era(): string {
    return this.metadata.era;
  }

  /**
   * Verifica se é um título Sith
   */
  isSith(): boolean {
    return this._value === 'darth_vader';
  }

  /**
   * Verifica se é um título Jedi
   */
  isJedi(): boolean {
    return ['padawan', 'jedi_knight', 'jedi_master'].includes(this._value);
  }

  /**
   * Verifica se pode ser promovido
   */
  canBePromoted(): boolean {
    const promotionPath: Partial<Record<TitleType, TitleType>> = {
      slave: 'padawan',
      padawan: 'jedi_knight',
      jedi_knight: 'jedi_master',
    };
    return this._value in promotionPath;
  }

  /**
   * Retorna o próximo título na hierarquia Jedi
   */
  getNextPromotion(): Title | null {
    const promotionPath: Partial<Record<TitleType, TitleType>> = {
      slave: 'padawan',
      padawan: 'jedi_knight',
      jedi_knight: 'jedi_master',
    };
    const next = promotionPath[this._value];
    return next ? Title.create(next) : null;
  }

  equals(other: Title): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this.displayName;
  }
}
