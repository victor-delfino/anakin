// ============================================
// APPLICATION LAYER - USE CASE: GET SESSION HISTORY
// ============================================
// Retorna o histórico completo de decisões de uma sessão

import { 
  UserDecisionRecordRepository, 
  EventRepository,
  DecisionRepository 
} from '../repositories/index.js';

export interface GetSessionHistoryInput {
  sessionId: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  event: {
    id: string;
    title: string;
    era: string;
  };
  decision: {
    id: string;
    text: string;
    alignment: string;
  };
  moralChange: {
    lightSideBefore: number;
    lightSideAfter: number;
    darkSideBefore: number;
    darkSideAfter: number;
    shift: number; // Positivo = luz, Negativo = escuridão
  };
  narrative: string;
}

export interface GetSessionHistoryOutput {
  sessionId: string;
  totalDecisions: number;
  history: HistoryEntry[];
  summary: {
    lightDecisions: number;
    darkDecisions: number;
    neutralDecisions: number;
    averageShift: number;
    overallTendency: 'light' | 'dark' | 'balanced';
  };
}

export class GetSessionHistoryUseCase {
  constructor(
    private readonly userDecisionRepository: UserDecisionRecordRepository,
    private readonly eventRepository: EventRepository,
    private readonly decisionRepository: DecisionRepository
  ) {}

  async execute(input: GetSessionHistoryInput): Promise<GetSessionHistoryOutput> {
    // Buscar todas as decisões da sessão
    const userDecisions = await this.userDecisionRepository.findBySessionId(input.sessionId);
    
    if (userDecisions.length === 0) {
      return {
        sessionId: input.sessionId,
        totalDecisions: 0,
        history: [],
        summary: {
          lightDecisions: 0,
          darkDecisions: 0,
          neutralDecisions: 0,
          averageShift: 0,
          overallTendency: 'balanced',
        },
      };
    }

    // Buscar detalhes dos eventos
    const eventIds = [...new Set(userDecisions.map(d => d.eventId))];
    const events = await Promise.all(
      eventIds.map(id => this.eventRepository.findById(id))
    );
    const eventMap = new Map(events.filter(Boolean).map(e => [e!.id, e!]));

    // Buscar detalhes das decisões
    const decisionIds = [...new Set(userDecisions.map(d => d.decisionId))];
    const decisions = await Promise.all(
      decisionIds.map(id => this.decisionRepository.findById(id))
    );
    const decisionMap = new Map(decisions.filter(Boolean).map(d => [d!.id, d!]));

    // Construir histórico
    let lightDecisions = 0;
    let darkDecisions = 0;
    let neutralDecisions = 0;
    let totalShift = 0;

    const history: HistoryEntry[] = userDecisions.map(record => {
      const event = eventMap.get(record.eventId);
      const decision = decisionMap.get(record.decisionId);
      const shift = record.lightSideAfter - record.lightSideBefore;
      
      // Contabilizar tipo de decisão
      if (shift > 0) lightDecisions++;
      else if (shift < 0) darkDecisions++;
      else neutralDecisions++;
      
      totalShift += shift;

      return {
        id: record.id,
        timestamp: record.createdAt,
        event: {
          id: record.eventId,
          title: event?.title ?? 'Evento Desconhecido',
          era: event?.era ?? 'Desconhecido',
        },
        decision: {
          id: record.decisionId,
          text: decision?.text ?? 'Decisão não encontrada',
          alignment: shift > 0 ? 'light' : shift < 0 ? 'dark' : 'neutral',
        },
        moralChange: {
          lightSideBefore: record.lightSideBefore,
          lightSideAfter: record.lightSideAfter,
          darkSideBefore: record.darkSideBefore,
          darkSideAfter: record.darkSideAfter,
          shift,
        },
        narrative: record.narrativeGenerated ?? 'Narrativa não disponível',
      };
    });

    // Ordenar por timestamp
    history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Calcular tendência geral
    const averageShift = totalShift / userDecisions.length;
    let overallTendency: 'light' | 'dark' | 'balanced';
    
    if (averageShift > 2) overallTendency = 'light';
    else if (averageShift < -2) overallTendency = 'dark';
    else overallTendency = 'balanced';

    return {
      sessionId: input.sessionId,
      totalDecisions: userDecisions.length,
      history,
      summary: {
        lightDecisions,
        darkDecisions,
        neutralDecisions,
        averageShift: Math.round(averageShift * 100) / 100,
        overallTendency,
      },
    };
  }
}
