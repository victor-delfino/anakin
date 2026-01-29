// ============================================
// DOMAIN LAYER - RULES: EVENT PROGRESSION
// ============================================
// Regras para progressão entre eventos canônicos

import { CanonicalEvent } from '../entities/CanonicalEvent.js';
import { Character } from '../entities/Character.js';

export interface EventAccessResult {
  canAccess: boolean;
  reason?: string;
  requiredEventTitle?: string;
}

/**
 * Regras de Progressão de Eventos
 * Define a ordem e requisitos para acessar eventos canônicos
 */
export class EventProgressionRules {
  
  /**
   * REGRA: Verifica se um evento pode ser acessado
   */
  static canAccessEvent(
    event: CanonicalEvent,
    completedEventIds: string[],
    character: Character
  ): EventAccessResult {
    // Verificar pré-requisito de evento anterior
    if (event.requiredPreviousEventId) {
      if (!completedEventIds.includes(event.requiredPreviousEventId)) {
        return {
          canAccess: false,
          reason: 'Evento anterior não completado',
          requiredEventTitle: event.requiredPreviousEventId,
        };
      }
    }

    // Eventos especiais podem ter requisitos de estado moral
    if (event.isKeyMoment) {
      // Momentos-chave sempre são acessíveis se pré-requisitos cumpridos
      return { canAccess: true };
    }

    return { canAccess: true };
  }

  /**
   * REGRA: Determina próximos eventos disponíveis
   */
  static getNextAvailableEvents(
    allEvents: CanonicalEvent[],
    completedEventIds: string[],
    character: Character
  ): CanonicalEvent[] {
    return allEvents
      .filter(event => !completedEventIds.includes(event.id))
      .filter(event => {
        const access = this.canAccessEvent(event, completedEventIds, character);
        return access.canAccess;
      })
      .sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
  }

  /**
   * REGRA: Agrupa eventos por era
   */
  static groupEventsByEra(events: CanonicalEvent[]): Map<string, CanonicalEvent[]> {
    const grouped = new Map<string, CanonicalEvent[]>();
    
    for (const event of events) {
      const era = event.era;
      if (!grouped.has(era)) {
        grouped.set(era, []);
      }
      grouped.get(era)!.push(event);
    }

    // Ordenar eventos dentro de cada era
    grouped.forEach((events, era) => {
      events.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
    });

    return grouped;
  }

  /**
   * REGRA: Calcula progresso na timeline
   */
  static calculateProgress(
    totalEvents: number,
    completedEvents: number
  ): number {
    if (totalEvents === 0) return 0;
    return Math.round((completedEvents / totalEvents) * 100);
  }

  /**
   * REGRA: Determina se a jornada está completa
   */
  static isJourneyComplete(
    allEvents: CanonicalEvent[],
    completedEventIds: string[]
  ): boolean {
    const keyMoments = allEvents.filter(e => e.isKeyMoment);
    return keyMoments.every(e => completedEventIds.includes(e.id));
  }
}
