// ============================================
// INFRASTRUCTURE - CHARACTER REPOSITORY
// ============================================

import { query } from '../connection.js';
import { Character, CharacterProps } from '../../../domain/entities/Character.js';
import { CharacterRepository } from '../../../application/repositories/index.js';
import { MoralState } from '../../../domain/valueObjects/MoralState.js';
import { Emotion, EmotionType } from '../../../domain/valueObjects/Emotion.js';
import { Title, TitleType } from '../../../domain/valueObjects/Title.js';

export class PostgresCharacterRepository implements CharacterRepository {
  
  async findById(id: string): Promise<Character | null> {
    const result = await query(
      'SELECT * FROM characters WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDomain(result.rows[0]);
  }

  async findBySessionId(sessionId: string): Promise<Character | null> {
    const result = await query(
      `SELECT c.* FROM characters c
       INNER JOIN sessions s ON s.character_id = c.id
       WHERE s.id = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToDomain(result.rows[0]);
  }

  async save(character: Character): Promise<void> {
    await query(
      `UPDATE characters SET
       name = $2,
       light_side = $3,
       dark_side = $4,
       current_emotion = $5,
       title = $6,
       updated_at = NOW()
       WHERE id = $1`,
      [
        character.id,
        character.name,
        character.moralState.lightSide,
        character.moralState.darkSide,
        character.currentEmotion.value,
        character.title.value,
      ]
    );
  }

  async create(character: Character, sessionId: string): Promise<void> {
    // Criar personagem
    await query(
      `INSERT INTO characters (id, name, light_side, dark_side, current_emotion, title)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        character.id,
        character.name,
        character.moralState.lightSide,
        character.moralState.darkSide,
        character.currentEmotion.value,
        character.title.value,
      ]
    );

    // Criar sessão
    await query(
      `INSERT INTO sessions (id, character_id)
       VALUES ($1, $2)`,
      [sessionId, character.id]
    );
  }

  private mapToDomain(row: Record<string, unknown>): Character {
    return Character.reconstitute({
      id: row.id as string,
      name: row.name as string,
      moralState: MoralState.create({
        lightSide: row.light_side as number,
        darkSide: row.dark_side as number,
      }),
      currentEmotion: Emotion.create(row.current_emotion as EmotionType),
      title: Title.create(row.title as TitleType),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    });
  }
}
