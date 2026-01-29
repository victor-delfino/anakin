// ============================================
// TYPES - Definições de tipos do domínio
// ============================================

// Estado moral do personagem
export interface MoralState {
  lightSide: number;
  darkSide: number;
}

// Tipos de emoção
export type EmotionType =
  | 'hope'
  | 'fear'
  | 'anger'
  | 'love'
  | 'hatred'
  | 'peace'
  | 'despair'
  | 'determination'
  | 'confusion'
  | 'guilt'
  | 'pride'
  | 'grief';

// Tipos de título
export type TitleType =
  | 'slave'
  | 'padawan'
  | 'jedi_knight'
  | 'jedi_master'
  | 'fallen_jedi'
  | 'darth_vader';

// Alinhamento
export type Alignment = 'light' | 'dark' | 'neutral' | 'balanced';

// Eras da saga
export type EventEra = 'phantom_menace' | 'attack_of_clones' | 'clone_wars' | 'revenge_of_sith';

// Status de evento na timeline
export type EventStatus = 'completed' | 'available' | 'locked';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Resposta de nova sessão
export interface SessionResponse {
  sessionId: string;
  character: {
    id: string;
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
  };
}

// Evento na timeline
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  era: EventEra;
  eraDisplayName: string;
  chronologicalOrder: number;
  isKeyMoment: boolean;
  status: EventStatus;
}

// Resposta da timeline
export interface TimelineResponse {
  events: TimelineEvent[];
  progress: number;
  currentEra: string;
}

// Decisão disponível
export interface EventDecision {
  id: string;
  text: string;
  order: number;
}

// Detalhes do evento
export interface EventDetailResponse {
  event: {
    id: string;
    title: string;
    description: string;
    era: EventEra;
    eraDisplayName: string;
    isKeyMoment: boolean;
  };
  decisions: EventDecision[];
  characterState: {
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
    emotionDescription: string;
  };
}

// Resultado de decisão processada
export interface DecisionResult {
  success: boolean;
  characterState: {
    name: string;
    title: string;
    previousTitle: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
    emotionDescription: string;
  };
  progression: {
    titleChanged: boolean;
    triggeredFall: boolean;
    triggeredRedemption: boolean;
    moralShift: 'toward_light' | 'toward_dark' | 'stable';
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

// Estado do personagem
export interface CharacterState {
  character: {
    id: string;
    name: string;
    title: string;
    titleDescription: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
    emotionDescription: string;
    alignment: Alignment;
    isInConflict: boolean;
    hasFallen: boolean;
  };
  stats: {
    decisionsCount: number;
    lightDecisions: number;
    darkDecisions: number;
  };
}

// ============================================
// UI Types
// ============================================

export interface EmotionDisplay {
  type: EmotionType;
  displayName: string;
  description: string;
  alignment: Alignment;
  color: string;
  icon: string;
}

export const EMOTION_DISPLAY: Record<EmotionType, EmotionDisplay> = {
  hope: {
    type: 'hope',
    displayName: 'Esperança',
    description: 'Uma luz que guia através da escuridão',
    alignment: 'light',
    color: '#26A0F1',
    icon: '✨',
  },
  fear: {
    type: 'fear',
    displayName: 'Medo',
    description: 'O medo leva à raiva, a raiva leva ao ódio',
    alignment: 'dark',
    color: '#8B2323',
    icon: '😨',
  },
  anger: {
    type: 'anger',
    displayName: 'Raiva',
    description: 'Uma chama que consome de dentro para fora',
    alignment: 'dark',
    color: '#B82E2E',
    icon: '😠',
  },
  love: {
    type: 'love',
    displayName: 'Amor',
    description: 'A força mais poderosa do universo',
    alignment: 'neutral',
    color: '#FF69B4',
    icon: '❤️',
  },
  hatred: {
    type: 'hatred',
    displayName: 'Ódio',
    description: 'A corrupção final do coração',
    alignment: 'dark',
    color: '#8B0000',
    icon: '🔥',
  },
  peace: {
    type: 'peace',
    displayName: 'Paz',
    description: 'Harmonia com a Força',
    alignment: 'light',
    color: '#87CEEB',
    icon: '☮️',
  },
  despair: {
    type: 'despair',
    displayName: 'Desespero',
    description: 'Quando toda esperança parece perdida',
    alignment: 'dark',
    color: '#4B0082',
    icon: '😢',
  },
  determination: {
    type: 'determination',
    displayName: 'Determinação',
    description: 'A vontade inabalável de perseguir um objetivo',
    alignment: 'neutral',
    color: '#FFD700',
    icon: '💪',
  },
  confusion: {
    type: 'confusion',
    displayName: 'Confusão',
    description: 'Perdido entre luz e sombra',
    alignment: 'neutral',
    color: '#9370DB',
    icon: '🤔',
  },
  guilt: {
    type: 'guilt',
    displayName: 'Culpa',
    description: 'O peso das escolhas passadas',
    alignment: 'neutral',
    color: '#708090',
    icon: '😔',
  },
  pride: {
    type: 'pride',
    displayName: 'Orgulho',
    description: 'A arrogância que precede a queda',
    alignment: 'dark',
    color: '#DAA520',
    icon: '👑',
  },
  grief: {
    type: 'grief',
    displayName: 'Luto',
    description: 'A dor da perda que ecoa na alma',
    alignment: 'neutral',
    color: '#2F4F4F',
    icon: '💔',
  },
};

export const TITLE_DISPLAY: Record<TitleType, { name: string; description: string }> = {
  slave: {
    name: 'Escravo',
    description: 'Nascido em correntes, mas destinado a algo maior',
  },
  padawan: {
    name: 'Padawan',
    description: 'Aprendiz Jedi sob tutela de Obi-Wan Kenobi',
  },
  jedi_knight: {
    name: 'Cavaleiro Jedi',
    description: 'Herói Sem Medo, general das Guerras Clônicas',
  },
  jedi_master: {
    name: 'Mestre Jedi',
    description: 'O título que lhe foi negado',
  },
  fallen_jedi: {
    name: 'Jedi Caído',
    description: 'Perdido entre a luz e a escuridão',
  },
  darth_vader: {
    name: 'Darth Vader',
    description: 'Lorde Sith, servo do Imperador',
  },
};
