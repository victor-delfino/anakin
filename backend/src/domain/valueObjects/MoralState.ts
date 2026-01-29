// ============================================
// DOMAIN LAYER - VALUE OBJECT: MORAL STATE
// ============================================
// Value Object imutável que representa o estado moral
// Contém regras de domínio para progressão e queda

export interface MoralStateProps {
  lightSide: number;
  darkSide: number;
}

/**
 * Estado Moral - Value Object
 * Representa o equilíbrio entre Lado Luminoso e Lado Sombrio
 * 
 * Regras de Domínio:
 * - Valores variam de 0 a 100
 * - darkSide >= 80 = Queda para o Lado Sombrio
 * - lightSide >= 80 = Maestria Jedi
 */
export class MoralState {
  private readonly _lightSide: number;
  private readonly _darkSide: number;

  private constructor(props: MoralStateProps) {
    this._lightSide = this.clamp(props.lightSide, 0, 100);
    this._darkSide = this.clamp(props.darkSide, 0, 100);
  }

  // Factory para estado inicial de Anakin (jovem esperançoso)
  static createInitial(): MoralState {
    return new MoralState({
      lightSide: 60,
      darkSide: 20,
    });
  }

  // Factory para criar com valores específicos
  static create(props: MoralStateProps): MoralState {
    return new MoralState(props);
  }

  // Getters
  get lightSide(): number {
    return this._lightSide;
  }

  get darkSide(): number {
    return this._darkSide;
  }

  /**
   * Aplica impacto moral e retorna novo estado
   * Imutabilidade garantida
   */
  applyImpact(lightDelta: number, darkDelta: number): MoralState {
    return new MoralState({
      lightSide: this._lightSide + lightDelta,
      darkSide: this._darkSide + darkDelta,
    });
  }

  /**
   * REGRA DE DOMÍNIO: Verifica queda para o Lado Sombrio
   * darkSide >= 80 indica corrupção irreversível
   */
  hasFallenToDarkSide(): boolean {
    return this._darkSide >= 80;
  }

  /**
   * REGRA DE DOMÍNIO: Verifica maestria no Lado Luminoso
   */
  hasAchievedMastery(): boolean {
    return this._lightSide >= 80 && this._darkSide <= 30;
  }

  /**
   * Calcula o equilíbrio moral (-100 a +100)
   * Positivo = tendência luminosa
   * Negativo = tendência sombria
   */
  getBalance(): number {
    return this._lightSide - this._darkSide;
  }

  /**
   * Retorna a tendência dominante
   */
  getDominantAlignment(): 'light' | 'dark' | 'balanced' {
    const balance = this.getBalance();
    if (balance > 20) return 'light';
    if (balance < -20) return 'dark';
    return 'balanced';
  }

  /**
   * Verifica se está em estado de conflito interno
   */
  isInConflict(): boolean {
    const balance = Math.abs(this.getBalance());
    return balance <= 30 && this._lightSide >= 40 && this._darkSide >= 40;
  }

  /**
   * Comparação por valor (característica de Value Objects)
   */
  equals(other: MoralState): boolean {
    return this._lightSide === other.lightSide && this._darkSide === other.darkSide;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  toJSON(): MoralStateProps {
    return {
      lightSide: this._lightSide,
      darkSide: this._darkSide,
    };
  }
}
