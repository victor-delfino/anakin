// ============================================
// DOMAIN LAYER - VALUE OBJECT: FORCE CONNECTION
// ============================================
// Representa a conexão de Anakin com a Força
// O "Escolhido" tem uma conexão extraordinária

export type ForceConnectionLevel = 
  | 'dormant'       // Dormente - ainda não despertou
  | 'awakening'     // Despertar - primeiros sinais
  | 'trained'       // Treinado - padawan/cavaleiro
  | 'powerful'      // Poderoso - acima da média
  | 'extraordinary' // Extraordinário - nível de mestre
  | 'chosen_one';   // O Escolhido - conexão única

export interface ForceConnectionMetadata {
  displayName: string;
  description: string;
  midiChlorianRange: string;
  powerMultiplier: number;
}

/**
 * Force Connection - Value Object
 * Representa a conexão com a Força
 * 
 * Anakin tem a maior contagem de midi-chlorians já registrada,
 * superando até Yoda. Isso reflete sua natureza como "O Escolhido".
 */
export class ForceConnection {
  private readonly _level: ForceConnectionLevel;
  private readonly _midiChlorians: number;

  private static readonly FORCE_METADATA: Record<ForceConnectionLevel, ForceConnectionMetadata> = {
    dormant: {
      displayName: 'Dormente',
      description: 'A Força existe, mas ainda não foi despertada',
      midiChlorianRange: '< 5.000',
      powerMultiplier: 0.5,
    },
    awakening: {
      displayName: 'Despertar',
      description: 'Os primeiros sinais da conexão com a Força',
      midiChlorianRange: '5.000 - 10.000',
      powerMultiplier: 0.8,
    },
    trained: {
      displayName: 'Treinado',
      description: 'Conexão desenvolvida através de treinamento Jedi',
      midiChlorianRange: '10.000 - 15.000',
      powerMultiplier: 1.0,
    },
    powerful: {
      displayName: 'Poderoso',
      description: 'Conexão acima da média dos Jedi',
      midiChlorianRange: '15.000 - 20.000',
      powerMultiplier: 1.3,
    },
    extraordinary: {
      displayName: 'Extraordinário',
      description: 'Nível de Mestre Jedi como Yoda ou Windu',
      midiChlorianRange: '20.000 - 25.000',
      powerMultiplier: 1.6,
    },
    chosen_one: {
      displayName: 'O Escolhido',
      description: 'Aquele que trará equilíbrio à Força',
      midiChlorianRange: '> 25.000',
      powerMultiplier: 2.0,
    },
  };

  // Anakin tem mais de 20.000 midi-chlorians (maior que Yoda)
  private static readonly ANAKIN_MIDICHLORIANS = 27000;

  private constructor(level: ForceConnectionLevel, midiChlorians: number) {
    this._level = level;
    this._midiChlorians = midiChlorians;
  }

  /**
   * Factory: Cria conexão inicial de Anakin (poderoso mas não treinado)
   */
  static createForAnakin(): ForceConnection {
    return new ForceConnection('powerful', this.ANAKIN_MIDICHLORIANS);
  }

  /**
   * Factory: Cria com nível específico
   */
  static create(level: ForceConnectionLevel, midiChlorians?: number): ForceConnection {
    const defaultMidi = this.getDefaultMidiChlorians(level);
    return new ForceConnection(level, midiChlorians ?? defaultMidi);
  }

  /**
   * REGRA DE DOMÍNIO: Evolui a conexão baseado no estado moral
   * Se lightSide >= 90, alcança o nível "Escolhido"
   */
  static determineFromMoralState(
    currentConnection: ForceConnection,
    lightSide: number,
    darkSide: number
  ): ForceConnection {
    // O Escolhido - extrema conexão com a luz
    if (lightSide >= 90 && darkSide <= 20) {
      return new ForceConnection('chosen_one', currentConnection.midiChlorians);
    }

    // Extraordinário - grande domínio
    if (lightSide >= 80 && darkSide <= 30) {
      return new ForceConnection('extraordinary', currentConnection.midiChlorians);
    }

    // Poderoso - acima da média
    if (lightSide >= 60 || darkSide >= 60) {
      return new ForceConnection('powerful', currentConnection.midiChlorians);
    }

    // Treinado - nível padrão
    return new ForceConnection('trained', currentConnection.midiChlorians);
  }

  private static getDefaultMidiChlorians(level: ForceConnectionLevel): number {
    const defaults: Record<ForceConnectionLevel, number> = {
      dormant: 3000,
      awakening: 7500,
      trained: 12000,
      powerful: 17000,
      extraordinary: 22000,
      chosen_one: 27000,
    };
    return defaults[level];
  }

  // ============================================
  // GETTERS
  // ============================================

  get level(): ForceConnectionLevel {
    return this._level;
  }

  get midiChlorians(): number {
    return this._midiChlorians;
  }

  get metadata(): ForceConnectionMetadata {
    return ForceConnection.FORCE_METADATA[this._level];
  }

  get displayName(): string {
    return this.metadata.displayName;
  }

  get description(): string {
    return this.metadata.description;
  }

  get powerMultiplier(): number {
    return this.metadata.powerMultiplier;
  }

  // ============================================
  // REGRAS DE NEGÓCIO
  // ============================================

  /**
   * Verifica se é o Escolhido
   */
  isChosenOne(): boolean {
    return this._level === 'chosen_one';
  }

  /**
   * Verifica se tem conexão extraordinária ou superior
   */
  isExtraordinary(): boolean {
    return ['extraordinary', 'chosen_one'].includes(this._level);
  }

  /**
   * Verifica se a Força está em desequilíbrio
   * (alto poder mas usada para o lado sombrio)
   */
  isCorrupted(darkSide: number): boolean {
    return this._level === 'chosen_one' && darkSide >= 80;
  }

  /**
   * Calcula o impacto amplificado baseado na conexão
   */
  amplifyImpact(baseImpact: number): number {
    return Math.round(baseImpact * this.powerMultiplier);
  }

  // ============================================
  // COMPARAÇÃO
  // ============================================

  equals(other: ForceConnection): boolean {
    return this._level === other.level && this._midiChlorians === other.midiChlorians;
  }

  /**
   * Verifica se esta conexão é mais forte que outra
   */
  isStrongerThan(other: ForceConnection): boolean {
    const order: ForceConnectionLevel[] = [
      'dormant', 'awakening', 'trained', 'powerful', 'extraordinary', 'chosen_one'
    ];
    return order.indexOf(this._level) > order.indexOf(other.level);
  }

  toString(): string {
    return `${this.displayName} (${this._midiChlorians} midi-chlorians)`;
  }

  toJSON(): { level: ForceConnectionLevel; midiChlorians: number } {
    return {
      level: this._level,
      midiChlorians: this._midiChlorians,
    };
  }
}
