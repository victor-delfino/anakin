// ============================================
// DOMAIN LAYER - RULES: MORAL PROGRESSION
// ============================================
// Regras determinísticas para progressão moral
// Estas regras definem como decisões afetam o estado

import { Character } from '../entities/Character.js';
import { Decision } from '../entities/Decision.js';
import { Title } from '../valueObjects/Title.js';
import { Emotion } from '../valueObjects/Emotion.js';

export interface MoralProgressionResult {
  character: Character;
  titleChanged: boolean;
  previousTitle: string;
  newTitle: string;
  triggeredFall: boolean;
  triggeredRedemption: boolean;
  moralShift: 'toward_light' | 'toward_dark' | 'stable';
}

/**
 * Regras de Progressão Moral
 * Define como decisões afetam o estado de Anakin
 * 
 * IMPORTANTE: Estas são regras DETERMINÍSTICAS
 * A IA NÃO participa destas regras
 */
export class MoralProgressionRules {
  
  /**
   * REGRA PRINCIPAL: Aplica decisão ao personagem
   * Retorna novo estado do personagem com todas as consequências
   * 
   * SISTEMA BALANCEADO:
   * - Decisão LUZ: +luz, -trevas
   * - Decisão NEUTRA: +luz, +trevas (conflito interno)
   * - Decisão TREVAS: -luz, +trevas
   */
  static applyDecision(character: Character, decision: Decision): MoralProgressionResult {
    const previousTitle = character.title.value;
    const wasNotFallen = !character.hasFallen();
    
    // 1. Calcular intensidade baseada nos deltas da decisão
    const intensity = Math.max(
      Math.abs(decision.impact.lightSideDelta),
      Math.abs(decision.impact.darkSideDelta)
    );
    
    // 2. Aplicar impacto moral BALANCEADO
    let updatedCharacter = character.applyBalancedMoralImpact(
      decision.alignment,
      intensity
    );

    // 2. Atualizar emoção
    const newEmotion = decision.getResultingEmotion();
    updatedCharacter = updatedCharacter.updateEmotion(newEmotion);

    // 3. Calcular novo título baseado no estado moral
    const newTitle = Title.determineFromMoralState(
      updatedCharacter.title,
      updatedCharacter.moralState.lightSide,
      updatedCharacter.moralState.darkSide
    );
    
    if (!newTitle.equals(updatedCharacter.title)) {
      updatedCharacter = updatedCharacter.updateTitle(newTitle);
    }

    // 4. Detectar queda
    const triggeredFall = wasNotFallen && updatedCharacter.hasFallen();

    // 5. Detectar redenção (caminho alternativo)
    const triggeredRedemption = this.checkRedemption(character, updatedCharacter);

    // 6. Determinar direção da mudança moral
    const moralShift = this.determineMoralShift(character, updatedCharacter);

    return {
      character: updatedCharacter,
      titleChanged: previousTitle !== updatedCharacter.title.value,
      previousTitle,
      newTitle: updatedCharacter.title.value,
      triggeredFall,
      triggeredRedemption,
      moralShift,
    };
  }

  /**
   * REGRA: Verifica queda para o Lado Sombrio
   * darkSide >= 80 é o limiar de corrupção
   */
  static checkFall(darkSide: number): boolean {
    return darkSide >= 80;
  }

  /**
   * REGRA: Verifica elegibilidade para redenção
   */
  private static checkRedemption(before: Character, after: Character): boolean {
    // Só pode haver redenção se já estava caído
    if (!before.hasFallen()) return false;
    
    // Redenção requer queda significativa no darkSide
    const darkDrop = before.moralState.darkSide - after.moralState.darkSide;
    return darkDrop >= 20 && after.moralState.darkSide < 60;
  }

  /**
   * REGRA: Determina direção da mudança moral
   */
  private static determineMoralShift(
    before: Character,
    after: Character
  ): 'toward_light' | 'toward_dark' | 'stable' {
    const beforeBalance = before.moralState.getBalance();
    const afterBalance = after.moralState.getBalance();
    const shift = afterBalance - beforeBalance;

    if (shift > 5) return 'toward_light';
    if (shift < -5) return 'toward_dark';
    return 'stable';
  }

  /**
   * REGRA: Calcula multiplicador de impacto baseado no estado atual
   * Quando em conflito interno, impactos são amplificados
   */
  static calculateImpactMultiplier(character: Character): number {
    if (character.moralState.isInConflict()) {
      return 1.5; // Conflito amplifica decisões
    }
    return 1.0;
  }

  /**
   * REGRA: Verifica se título pode mudar
   */
  static canTitleChange(
    currentTitle: string,
    darkSide: number,
    lightSide: number
  ): boolean {
    // Darth Vader é irreversível (canonicamente)
    if (currentTitle === 'darth_vader') {
      // Exceto por redenção extrema
      return lightSide >= 90 && darkSide <= 40;
    }
    return true;
  }

  /**
   * REGRA: Valida se decisão pode ser tomada
   */
  static validateDecision(character: Character, decision: Decision): boolean {
    // Decisões do lado luminoso são limitadas após a queda
    if (character.hasFallen() && decision.isLightSide()) {
      // Após a queda, decisões luminosas têm impacto reduzido
      return true; // Ainda permitido, mas com peso narrativo
    }
    return true;
  }
}
