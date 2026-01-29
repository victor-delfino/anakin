// ============================================
// INFRASTRUCTURE - USER DECISION RECORD REPOSITORY
// ============================================

import { query } from '../connection.js';
import { UserDecisionRecord } from '../../../domain/entities/UserDecisionRecord.js';
import { UserDecisionRecordRepository } from '../../../application/repositories/index.js';

export class PostgresUserDecisionRecordRepository implements UserDecisionRecordRepository {
  
  async save(record: UserDecisionRecord): Promise<void> {
    await query(
      `INSERT INTO user_decision_records 
       (id, session_id, character_id, event_id, decision_id, 
        light_side_before, dark_side_before, light_side_after, dark_side_after,
        emotion_before, emotion_after, title_before, title_after, narrative_generated)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        record.id,
        record.sessionId,
        record.characterId,
        record.eventId,
        record.decisionId,
        record.lightSideBefore,
        record.darkSideBefore,
        record.lightSideAfter,
        record.darkSideAfter,
        record.emotionBefore,
        record.emotionAfter,
        record.titleBefore,
        record.titleAfter,
        record.narrativeGenerated,
      ]
    );
  }

  async findBySessionId(sessionId: string): Promise<UserDecisionRecord[]> {
    const result = await query(
      'SELECT * FROM user_decision_records WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    return result.rows.map(row => this.mapToDomain(row));
  }

  async findByCharacterId(characterId: string): Promise<UserDecisionRecord[]> {
    const result = await query(
      'SELECT * FROM user_decision_records WHERE character_id = $1 ORDER BY created_at ASC',
      [characterId]
    );

    return result.rows.map(row => this.mapToDomain(row));
  }

  async getCompletedEventIds(sessionId: string): Promise<string[]> {
    const result = await query(
      'SELECT DISTINCT event_id FROM user_decision_records WHERE session_id = $1',
      [sessionId]
    );

    return result.rows.map(row => row.event_id as string);
  }

  private mapToDomain(row: Record<string, unknown>): UserDecisionRecord {
    return UserDecisionRecord.reconstitute({
      id: row.id as string,
      sessionId: row.session_id as string,
      characterId: row.character_id as string,
      eventId: row.event_id as string,
      decisionId: row.decision_id as string,
      lightSideBefore: row.light_side_before as number,
      darkSideBefore: row.dark_side_before as number,
      lightSideAfter: row.light_side_after as number,
      darkSideAfter: row.dark_side_after as number,
      emotionBefore: row.emotion_before as string,
      emotionAfter: row.emotion_after as string,
      titleBefore: row.title_before as string,
      titleAfter: row.title_after as string,
      narrativeGenerated: row.narrative_generated as string | undefined,
      createdAt: new Date(row.created_at as string),
    });
  }
}
