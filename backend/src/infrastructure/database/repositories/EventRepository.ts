// ============================================
// INFRASTRUCTURE - EVENT REPOSITORY
// ============================================

import { query } from '../connection.js';
import { CanonicalEvent, EventEra } from '../../../domain/entities/CanonicalEvent.js';
import { EventRepository } from '../../../application/repositories/index.js';

export class PostgresEventRepository implements EventRepository {
  
  async findById(id: string): Promise<CanonicalEvent | null> {
    const result = await query(
      'SELECT * FROM canonical_events WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDomain(result.rows[0]);
  }

  async findAll(): Promise<CanonicalEvent[]> {
    const result = await query(
      'SELECT * FROM canonical_events ORDER BY chronological_order ASC'
    );

    return result.rows.map(row => this.mapToDomain(row));
  }

  async findByEra(era: string): Promise<CanonicalEvent[]> {
    const result = await query(
      'SELECT * FROM canonical_events WHERE era = $1 ORDER BY chronological_order ASC',
      [era]
    );

    return result.rows.map(row => this.mapToDomain(row));
  }

  async findNextEvents(completedEventIds: string[]): Promise<CanonicalEvent[]> {
    let queryText: string;
    let params: unknown[];

    if (completedEventIds.length === 0) {
      // Primeiro evento (sem required_previous_event_id)
      queryText = `
        SELECT * FROM canonical_events 
        WHERE required_previous_event_id IS NULL
        ORDER BY chronological_order ASC
      `;
      params = [];
    } else {
      // Eventos cujo pré-requisito foi completado
      queryText = `
        SELECT * FROM canonical_events 
        WHERE (required_previous_event_id = ANY($1) OR required_previous_event_id IS NULL)
        AND id != ALL($1)
        ORDER BY chronological_order ASC
      `;
      params = [completedEventIds];
    }

    const result = await query(queryText, params);
    return result.rows.map(row => this.mapToDomain(row));
  }

  private mapToDomain(row: Record<string, unknown>): CanonicalEvent {
    return CanonicalEvent.reconstitute({
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      era: row.era as EventEra,
      chronologicalOrder: row.chronological_order as number,
      isKeyMoment: row.is_key_moment as boolean,
      requiredPreviousEventId: row.required_previous_event_id as string | undefined,
      createdAt: new Date(row.created_at as string),
    });
  }
}
