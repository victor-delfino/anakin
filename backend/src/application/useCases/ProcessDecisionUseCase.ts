// ============================================
// APPLICATION LAYER - USE CASE: PROCESS DECISION
// ============================================
// Processa uma decisão do usuário e retorna resultado
// Este é o use case PRINCIPAL do fluxo narrativo

import { 
  CharacterRepository, 
  EventRepository, 
  DecisionRepository,
  UserDecisionRecordRepository 
} from '../repositories/index.js';
import { AIService } from '../services/AIService.js';
import { CacheService } from '../services/CacheService.js';
import { MoralProgressionRules } from '../../domain/rules/MoralProgressionRules.js';
import { NarrativeContextService } from '../../domain/services/NarrativeContextService.js';
import { UserDecisionRecord } from '../../domain/entities/UserDecisionRecord.js';

export interface ProcessDecisionInput {
  sessionId: string;
  eventId: string;
  decisionId: string;
}

export interface ProcessDecisionOutput {
  success: boolean;
  characterState: {
    name: string;
    title: string;
    previousTitle: string;
    lightSide: number;
    darkSide: number;
    emotion: string;
    emotionDescription: string;
  };
  progression: {
    titleChanged: boolean;
    triggeredFall: boolean;
    triggeredRedemption: boolean;
    moralShift: string;
  };
  narrative: string;
  event: {
    id: string;
    title: string;
  };
  decision: {
    id: string;
    text: string;
  };
}

export class ProcessDecisionUseCase {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly eventRepository: EventRepository,
    private readonly decisionRepository: DecisionRepository,
    private readonly userDecisionRepository: UserDecisionRecordRepository,
    private readonly aiService: AIService,
    private readonly cacheService: CacheService
  ) {}

  async execute(input: ProcessDecisionInput): Promise<ProcessDecisionOutput> {
    // 1. Buscar entidades
    const character = await this.characterRepository.findBySessionId(input.sessionId);
    if (!character) {
      throw new Error('Session not found');
    }

    const event = await this.eventRepository.findById(input.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const decision = await this.decisionRepository.findById(input.decisionId);
    if (!decision) {
      throw new Error('Decision not found');
    }

    // 2. Validar decisão pertence ao evento
    if (decision.eventId !== event.id) {
      throw new Error('Decision does not belong to event');
    }

    // 3. Capturar estado ANTES da decisão
    const stateBefore = {
      lightSide: character.moralState.lightSide,
      darkSide: character.moralState.darkSide,
      emotion: character.currentEmotion.value,
      title: character.title.value,
    };

    // 4. APLICAR REGRAS DE DOMÍNIO (determinísticas)
    const progression = MoralProgressionRules.applyDecision(character, decision);
    const updatedCharacter = progression.character;

    // 5. Persistir novo estado do personagem
    await this.characterRepository.save(updatedCharacter);

    // 6. Preparar contexto para IA
    const narrativeContext = NarrativeContextService.buildContext(
      updatedCharacter,
      event,
      decision,
      progression
    );

    const promptTemplate = NarrativeContextService.generatePromptTemplate(narrativeContext);

    // 7. Gerar narrativa via IA
    let narrative: string;
    try {
      const aiResponse = await this.aiService.generateNarrative(
        narrativeContext,
        promptTemplate
      );
      narrative = aiResponse.text;
    } catch (error) {
      // Fallback caso IA falhe
      narrative = this.generateFallbackNarrative(progression);
    }

    // 8. Registrar decisão
    const record = UserDecisionRecord.create({
      sessionId: input.sessionId,
      characterId: character.id,
      eventId: event.id,
      decisionId: decision.id,
      lightSideBefore: stateBefore.lightSide,
      darkSideBefore: stateBefore.darkSide,
      lightSideAfter: updatedCharacter.moralState.lightSide,
      darkSideAfter: updatedCharacter.moralState.darkSide,
      emotionBefore: stateBefore.emotion,
      emotionAfter: updatedCharacter.currentEmotion.value,
      titleBefore: stateBefore.title,
      titleAfter: updatedCharacter.title.value,
      narrativeGenerated: narrative,
    });

    await this.userDecisionRepository.save(record);

    // 9. Invalidar cache se necessário
    await this.cacheService.delete(`timeline:${input.sessionId}`);

    // 10. Retornar resultado
    return {
      success: true,
      characterState: {
        name: updatedCharacter.name,
        title: updatedCharacter.title.displayName,
        previousTitle: character.title.displayName,
        lightSide: updatedCharacter.moralState.lightSide,
        darkSide: updatedCharacter.moralState.darkSide,
        emotion: updatedCharacter.currentEmotion.value,
        emotionDescription: updatedCharacter.currentEmotion.description,
      },
      progression: {
        titleChanged: progression.titleChanged,
        triggeredFall: progression.triggeredFall,
        triggeredRedemption: progression.triggeredRedemption,
        moralShift: progression.moralShift,
      },
      narrative,
      event: {
        id: event.id,
        title: event.title,
      },
      decision: {
        id: decision.id,
        text: decision.text,
      },
    };
  }

  private generateFallbackNarrative(progression: { triggeredFall: boolean; moralShift: 'toward_light' | 'toward_dark' | 'stable' }): string {
    if (progression.triggeredFall) {
      return 'A escuridão finalmente consumiu seu coração. O caminho de volta parece impossível agora.';
    }
    if (progression.moralShift === 'toward_dark') {
      return 'Você sente a escuridão crescer dentro de você. Cada escolha tem seu preço.';
    }
    if (progression.moralShift === 'toward_light') {
      return 'Uma centelha de esperança permanece. A luz ainda não foi extinta.';
    }
    return 'A Força flui através de você, equilibrada entre luz e sombra.';
  }
}
