// ============================================
// INFRASTRUCTURE - DATABASE MIGRATIONS
// ============================================

import { query } from '../connection.js';

export async function runMigrations(): Promise<void> {
  console.log('Running database migrations...');

  // Tabela de sessões
  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY,
      character_id UUID NOT NULL,
      started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Tabela de personagens (estado de Anakin)
  await query(`
    CREATE TABLE IF NOT EXISTS characters (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      light_side INTEGER NOT NULL DEFAULT 60,
      dark_side INTEGER NOT NULL DEFAULT 20,
      current_emotion VARCHAR(50) NOT NULL DEFAULT 'hope',
      title VARCHAR(50) NOT NULL DEFAULT 'padawan',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Tabela de eventos canônicos
  await query(`
    CREATE TABLE IF NOT EXISTS canonical_events (
      id UUID PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      era VARCHAR(50) NOT NULL,
      chronological_order INTEGER NOT NULL,
      is_key_moment BOOLEAN DEFAULT FALSE,
      required_previous_event_id UUID REFERENCES canonical_events(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Tabela de decisões
  await query(`
    CREATE TABLE IF NOT EXISTS decisions (
      id UUID PRIMARY KEY,
      event_id UUID NOT NULL REFERENCES canonical_events(id),
      text TEXT NOT NULL,
      alignment VARCHAR(20) NOT NULL,
      light_side_delta INTEGER NOT NULL,
      dark_side_delta INTEGER NOT NULL,
      resulting_emotion VARCHAR(50) NOT NULL,
      narrative_context TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Tabela de registros de decisões do usuário
  await query(`
    CREATE TABLE IF NOT EXISTS user_decision_records (
      id UUID PRIMARY KEY,
      session_id UUID NOT NULL REFERENCES sessions(id),
      character_id UUID NOT NULL REFERENCES characters(id),
      event_id UUID NOT NULL REFERENCES canonical_events(id),
      decision_id UUID NOT NULL REFERENCES decisions(id),
      light_side_before INTEGER NOT NULL,
      dark_side_before INTEGER NOT NULL,
      light_side_after INTEGER NOT NULL,
      dark_side_after INTEGER NOT NULL,
      emotion_before VARCHAR(50) NOT NULL,
      emotion_after VARCHAR(50) NOT NULL,
      title_before VARCHAR(50) NOT NULL,
      title_after VARCHAR(50) NOT NULL,
      narrative_generated TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  // Índices
  await query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_character ON sessions(character_id);
    CREATE INDEX IF NOT EXISTS idx_decisions_event ON decisions(event_id);
    CREATE INDEX IF NOT EXISTS idx_user_decisions_session ON user_decision_records(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_order ON canonical_events(chronological_order);
  `);

  console.log('Migrations completed successfully');
}

// Entry point para rodar migrações
if (process.argv[1].includes('run.ts') || process.argv[1].includes('migrations')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
