// ============================================
// APPLICATION LAYER - USE CASE: GET EVENT
// ============================================
// Retorna detalhes de um evento com suas decisões disponíveis

import { 
  EventRepository, 
  DecisionRepository,
  CharacterRepository,
  UserDecisionRecordRepository 
} from '../repositories/index.js';
import { EventProgressionRules } from '../../domain/rules/EventProgressionRules.js';

export interface GetEventInput {
  sessionId: string;
  eventId: string;
}

export interface EventDecision {
  id: string;
  text: string;
  order: number;
  // Não expor alignment para não influenciar o usuário
}

export interface GetEventOutput {
  event: {
    id: string;
    title: string;
    description: string;
    era: string;
    eraDisplayName: string;
    isKeyMoment: boolean;
  };
  decisions: EventDecision[];
  characterState: {
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: string;
    emotionDescription: string;
  };
}

export class GetEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly decisionRepository: DecisionRepository,
    private readonly characterRepository: CharacterRepository,
    private readonly userDecisionRepository: UserDecisionRecordRepository
  ) {}

  async execute(input: GetEventInput): Promise<GetEventOutput> {
    // Buscar evento
    const event = await this.eventRepository.findById(input.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Buscar personagem
    const character = await this.characterRepository.findBySessionId(input.sessionId);
    if (!character) {
      throw new Error('Session not found');
    }

    // Verificar se pode acessar o evento
    const completedEventIds = await this.userDecisionRepository.getCompletedEventIds(
      input.sessionId
    );

    const access = EventProgressionRules.canAccessEvent(
      event,
      completedEventIds,
      character
    );

    if (!access.canAccess) {
      throw new Error(`Cannot access event: ${access.reason}`);
    }

    // Verificar se já foi completado
    if (completedEventIds.includes(event.id)) {
      throw new Error('Event already completed');
    }

    // Buscar decisões do evento
    const decisions = await this.decisionRepository.findByEventId(event.id);

    return {
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        era: event.era,
        eraDisplayName: event.getEraDisplayName(),
        isKeyMoment: event.isKeyMoment,
      },
      decisions: decisions
        .sort((a, b) => a.order - b.order)
        .map(d => ({
          id: d.id,
          text: d.text,
          order: d.order,
        })),
      characterState: {
        name: character.name,
        title: character.title.displayName,
        lightSide: character.moralState.lightSide,
        darkSide: character.moralState.darkSide,
        emotion: character.currentEmotion.value,
        emotionDescription: character.currentEmotion.description,
      },
    };
  }
}
