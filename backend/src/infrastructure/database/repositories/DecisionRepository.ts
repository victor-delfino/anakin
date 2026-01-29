// ============================================
// INFRASTRUCTURE - DECISION REPOSITORY
// ============================================

import { query } from '../connection.js';
import { Decision, DecisionAlignment } from '../../../domain/entities/Decision.js';
import { DecisionRepository } from '../../../application/repositories/index.js';
import { EmotionType } from '../../../domain/valueObjects/Emotion.js';

export class PostgresDecisionRepository implements DecisionRepository {
  
  async findById(id: string): Promise<Decision | null> {
    const result = await query(
      'SELECT * FROM decisions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDomain(result.rows[0]);
  }

  async findByEventId(eventId: string): Promise<Decision[]> {
    const result = await query(
      'SELECT * FROM decisions WHERE event_id = $1 ORDER BY "order" ASC',
      [eventId]
    );

    return result.rows.map(row => this.mapToDomain(row));
  }

  private mapToDomain(row: Record<string, unknown>): Decision {
    return Decision.reconstitute({
      id: row.id as string,
      eventId: row.event_id as string,
      text: row.text as string,
      alignment: row.alignment as DecisionAlignment,
      impact: {
        lightSideDelta: row.light_side_delta as number,
        darkSideDelta: row.dark_side_delta as number,
        resultingEmotion: row.resulting_emotion as EmotionType,
      },
      narrativeContext: row.narrative_context as string,
      order: row.order as number,
      createdAt: new Date(row.created_at as string),
    });
  }
}
