// ============================================
// APPLICATION LAYER - USE CASE: GET TIMELINE
// ============================================
// Retorna a linha do tempo de eventos com status de progresso

import { CanonicalEvent } from '../../domain/entities/CanonicalEvent.js';
import { EventProgressionRules } from '../../domain/rules/EventProgressionRules.js';
import { 
  EventRepository, 
  UserDecisionRecordRepository, 
  CharacterRepository 
} from '../repositories/index.js';

export interface GetTimelineInput {
  sessionId: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  era: string;
  eraDisplayName: string;
  chronologicalOrder: number;
  isKeyMoment: boolean;
  status: 'completed' | 'available' | 'locked';
}

export interface GetTimelineOutput {
  events: TimelineEvent[];
  progress: number;
  currentEra: string;
}

export class GetTimelineUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userDecisionRepository: UserDecisionRecordRepository,
    private readonly characterRepository: CharacterRepository
  ) {}

  async execute(input: GetTimelineInput): Promise<GetTimelineOutput> {
    // Buscar todos os eventos
    const allEvents = await this.eventRepository.findAll();
    
    // Buscar eventos completados pelo usuário
    const completedEventIds = await this.userDecisionRepository.getCompletedEventIds(
      input.sessionId
    );

    // Buscar personagem para verificar acesso
    const character = await this.characterRepository.findBySessionId(input.sessionId);
    if (!character) {
      throw new Error('Session not found');
    }

    // Mapear eventos com status
    const events: TimelineEvent[] = allEvents.map(event => {
      let status: 'completed' | 'available' | 'locked';

      if (completedEventIds.includes(event.id)) {
        status = 'completed';
      } else {
        const access = EventProgressionRules.canAccessEvent(
          event,
          completedEventIds,
          character
        );
        status = access.canAccess ? 'available' : 'locked';
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        era: event.era,
        eraDisplayName: event.getEraDisplayName(),
        chronologicalOrder: event.chronologicalOrder,
        isKeyMoment: event.isKeyMoment,
        status,
      };
    });

    // Ordenar por ordem cronológica
    events.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);

    // Calcular progresso
    const progress = EventProgressionRules.calculateProgress(
      allEvents.length,
      completedEventIds.length
    );

    // Determinar era atual
    const nextAvailable = events.find(e => e.status === 'available');
    const currentEra = nextAvailable?.eraDisplayName || 'Jornada Completa';

    return {
      events,
      progress,
      currentEra,
    };
  }
}
