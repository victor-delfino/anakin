# 🌟 Guia Completo: Sistema Narrativo Anakin Skywalker

## 📚 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Design Patterns](#arquitetura-e-design-patterns)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Backend - Explicação Detalhada](#backend---explicação-detalhada)
5. [Frontend - Explicação Detalhada](#frontend---explicação-detalhada)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Como Tudo se Conecta](#como-tudo-se-conecta)
8. [Glossário de Termos](#glossário-de-termos)

---

## 🎯 Visão Geral do Projeto

Este é um **sistema narrativo interativo** onde o usuário acompanha a jornada de Anakin Skywalker através de eventos canônicos de Star Wars. A cada evento, o usuário toma decisões que afetam o estado moral do personagem (Lado Luminoso vs Lado Sombrio).

### Regra Fundamental
```
┌─────────────────────────────────────────────────────────┐
│  A IA NUNCA toma decisões ou altera estado             │
│  A IA APENAS narra e interpreta emoções                │
│  Todas as regras são DETERMINÍSTICAS (código)          │
└─────────────────────────────────────────────────────────┘
```

### Tecnologias Utilizadas

| Camada | Tecnologia | Para que serve |
|--------|------------|----------------|
| **Frontend** | React + TypeScript | Interface do usuário |
| **Estilização** | Tailwind CSS | Estilos utilitários |
| **Estado** | Zustand | Gerenciamento de estado global |
| **Animações** | Framer Motion | Animações suaves |
| **Roteamento** | React Router | Navegação entre páginas |
| **Backend** | Node.js + Express | API REST |
| **Linguagem** | TypeScript | Tipagem estática |
| **Banco de Dados** | PostgreSQL | Persistência de dados |
| **Cache** | Redis | Cache de dados frequentes |
| **IA** | Google Gemini | Geração de narrativas |
| **Containers** | Docker | Ambiente isolado e reproduzível |

---

## 🏛️ Arquitetura e Design Patterns

### Clean Architecture (Arquitetura Limpa)

O backend segue a **Clean Architecture**, que organiza o código em camadas independentes:

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRAESTRUTURA                           │
│  (Database, HTTP, AI, Cache - detalhes técnicos)           │
├─────────────────────────────────────────────────────────────┤
│                      APLICAÇÃO                              │
│  (Use Cases - orquestra o fluxo da aplicação)              │
├─────────────────────────────────────────────────────────────┤
│                       DOMÍNIO                               │
│  (Entities, Value Objects, Rules - regras de negócio)      │
└─────────────────────────────────────────────────────────────┘
```

**Por que isso é importante?**
- Cada camada só conhece a camada abaixo dela
- O domínio (regras de negócio) não depende de nada externo
- Podemos trocar o banco de dados sem alterar regras de negócio
- Facilita testes e manutenção

### Domain-Driven Design (DDD)

Usamos conceitos de DDD para modelar o domínio:

| Conceito | O que é | Exemplo no projeto |
|----------|---------|-------------------|
| **Entity** | Objeto com identidade única | `Character`, `CanonicalEvent` |
| **Value Object** | Objeto sem identidade, definido por seus valores | `MoralState`, `Emotion`, `Title` |
| **Domain Rules** | Regras de negócio puras | `MoralProgressionRules` |
| **Domain Service** | Lógica que não pertence a uma entidade | `NarrativeContextService` |
| **Repository** | Interface para acesso a dados | `CharacterRepository` |
| **Use Case** | Orquestra operações do domínio | `ProcessDecisionUseCase` |

---

## 📁 Estrutura de Pastas

### Visão Geral

```
project/
├── docker-compose.yml     # Orquestra todos os containers
├── .env                   # Variáveis de ambiente
├── backend/               # API Node.js
│   └── src/
│       ├── domain/        # Regras de negócio (coração)
│       ├── application/   # Casos de uso
│       └── infrastructure/# Detalhes técnicos
└── frontend/              # Interface React
    └── src/
        ├── components/    # Componentes visuais
        ├── pages/         # Páginas da aplicação
        ├── hooks/         # Lógica reutilizável
        ├── stores/        # Estado global
        ├── services/      # Comunicação com API
        └── types/         # Definições TypeScript
```

---

## 🔧 Backend - Explicação Detalhada

### Camada de Domínio (`backend/src/domain/`)

Esta é a camada mais importante! Contém todas as **regras de negócio** independentes de tecnologia.

#### 📦 Entities (Entidades)

**O que são?** Objetos com identidade única que representam conceitos do negócio.

**`Character.ts`** - Representa Anakin Skywalker
```typescript
class Character {
  private _id: string;           // Identidade única
  private _name: string;         // "Anakin Skywalker"
  private _moralState: MoralState;    // Luz/Sombrio
  private _currentEmotion: Emotion;   // Emoção atual
  private _title: Title;              // Padawan, Jedi, etc.

  // Factory Method - cria Anakin no estado inicial
  static createAnakin(): Character {
    return new Character({
      name: 'Anakin Skywalker',
      moralState: MoralState.createInitial(), // 60 luz, 20 sombrio
      currentEmotion: Emotion.create('hope'),
      title: Title.create('padawan'),
    });
  }

  // Método de domínio - aplica impacto moral
  applyMoralImpact(lightDelta: number, darkDelta: number): Character {
    // Retorna NOVO objeto (imutabilidade)
    return new Character({
      ...this,
      moralState: this._moralState.applyImpact(lightDelta, darkDelta),
    });
  }
}
```

**Por que imutabilidade?**
- Evita bugs de estado compartilhado
- Facilita rastrear mudanças
- Métodos retornam novo objeto em vez de modificar o atual

#### 📦 Value Objects (Objetos de Valor)

**O que são?** Objetos sem identidade própria, definidos por seus valores.

**`MoralState.ts`** - Estado moral (Luz/Sombrio)
```typescript
class MoralState {
  private _lightSide: number;  // 0-100
  private _darkSide: number;   // 0-100

  // REGRA DE DOMÍNIO: darkSide >= 80 = queda
  hasFallenToDarkSide(): boolean {
    return this._darkSide >= 80;
  }

  // REGRA DE DOMÍNIO: verifica conflito interno
  isInConflict(): boolean {
    const balance = Math.abs(this.getBalance());
    return balance <= 30 && this._lightSide >= 40 && this._darkSide >= 40;
  }
}
```

**`Emotion.ts`** - Emoção dominante
```typescript
type EmotionType = 'hope' | 'fear' | 'anger' | 'love' | 'hatred' | ...;

class Emotion {
  private _value: EmotionType;
  
  // Metadados para cada emoção
  static EMOTION_METADATA = {
    hope: { displayName: 'Esperança', alignment: 'light' },
    fear: { displayName: 'Medo', alignment: 'dark' },
    // ...
  };
}
```

**`Title.ts`** - Título do personagem
```typescript
type TitleType = 'padawan' | 'jedi_knight' | 'jedi_master' | 'fallen' | 'darth_vader';

class Title {
  // REGRA: determina título baseado no estado moral
  static determineFromMoralState(current, lightSide, darkSide): Title {
    if (darkSide >= 80) return Title.create('darth_vader');
    if (darkSide >= 60) return Title.create('fallen');
    if (lightSide >= 80) return Title.create('jedi_master');
    // ...
  }
}
```

#### 📦 Rules (Regras de Domínio)

**`MoralProgressionRules.ts`** - Regras determinísticas

```typescript
class MoralProgressionRules {
  // REGRA PRINCIPAL: aplica decisão ao personagem
  static applyDecision(character: Character, decision: Decision): Result {
    // 1. Aplicar impacto moral
    let updated = character.applyMoralImpact(
      decision.impact.lightSideDelta,
      decision.impact.darkSideDelta
    );

    // 2. Atualizar emoção
    const newEmotion = decision.getResultingEmotion();
    updated = updated.updateEmotion(newEmotion);

    // 3. Calcular novo título
    const newTitle = Title.determineFromMoralState(...);

    // 4. Detectar queda (darkSide >= 80)
    const triggeredFall = !character.hasFallen() && updated.hasFallen();

    return { character: updated, triggeredFall, ... };
  }
}
```

**Importante:** Estas regras são 100% determinísticas. Dado o mesmo input, sempre produzem o mesmo output. A IA não participa aqui!

---

### Camada de Aplicação (`backend/src/application/`)

Orquestra o fluxo da aplicação usando entidades e serviços.

#### 📦 Use Cases (Casos de Uso)

**O que são?** Classes que representam operações que o usuário pode fazer.

**`ProcessDecisionUseCase.ts`** - O mais importante!
```typescript
class ProcessDecisionUseCase {
  constructor(
    private characterRepository: CharacterRepository,  // Acesso a dados
    private eventRepository: EventRepository,
    private decisionRepository: DecisionRepository,
    private userDecisionRepository: UserDecisionRecordRepository,
    private aiService: AIService,                      // Serviço de IA
    private cacheService: CacheService,
  ) {}

  async execute(input: { sessionId, eventId, decisionId }): Promise<Output> {
    // 1. Buscar dados do banco
    const character = await this.characterRepository.findBySessionId(sessionId);
    const event = await this.eventRepository.findById(eventId);
    const decision = await this.decisionRepository.findById(decisionId);

    // 2. APLICAR REGRAS DE DOMÍNIO (determinísticas!)
    const progression = MoralProgressionRules.applyDecision(character, decision);

    // 3. Salvar novo estado
    await this.characterRepository.save(progression.character);

    // 4. Gerar narrativa via IA (apenas interpreta, não decide!)
    const narrative = await this.aiService.generateNarrative(context, prompt);

    // 5. Registrar decisão
    await this.userDecisionRepository.save(record);

    return { characterState, progression, narrative };
  }
}
```

**Fluxo do Use Case:**
```
Input → Busca Dados → Aplica Regras → Persiste → Gera Narrativa → Output
         (Repo)       (Domínio)       (Repo)      (IA)
```

#### 📦 Repository Interfaces (Contratos)

**O que são?** Interfaces que definem COMO acessar dados, mas não COMO implementar.

```typescript
// CONTRATO - diz O QUE fazer, não COMO
interface CharacterRepository {
  findById(id: string): Promise<Character | null>;
  findBySessionId(sessionId: string): Promise<Character | null>;
  save(character: Character): Promise<void>;
  create(character: Character, sessionId: string): Promise<void>;
}
```

**Por que interfaces?**
- Desacoplamento: domínio não conhece PostgreSQL
- Testabilidade: podemos criar mocks para testes
- Flexibilidade: podemos trocar banco sem alterar domínio

---

### Camada de Infraestrutura (`backend/src/infrastructure/`)

Implementa os detalhes técnicos (banco, cache, API, IA).

#### 📦 Database - PostgreSQL

**`connection.ts`** - Pool de conexões
```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

**`repositories/PostgresCharacterRepository.ts`** - Implementação concreta
```typescript
class PostgresCharacterRepository implements CharacterRepository {
  async findBySessionId(sessionId: string): Promise<Character | null> {
    const result = await pool.query(
      `SELECT c.* FROM characters c
       INNER JOIN sessions s ON s.character_id = c.id
       WHERE s.id = $1`,
      [sessionId]
    );
    
    if (result.rows.length === 0) return null;
    
    // Reconstitui entidade a partir dos dados do banco
    return Character.reconstitute({
      id: row.id,
      name: row.name,
      moralState: MoralState.create({ lightSide: row.light_side, ... }),
      // ...
    });
  }
}
```

#### 📦 HTTP - Express Routes

**`routes.ts`** - Endpoints da API
```typescript
const router = Router();

// POST /api/session - Cria nova sessão
router.post('/session', async (req, res) => {
  const useCase = new StartSessionUseCase(characterRepository, ...);
  const result = await useCase.execute();
  res.json({ success: true, data: result });
});

// POST /api/session/:sessionId/event/:eventId/decision - Processa decisão
router.post('/session/:sessionId/event/:eventId/decision', async (req, res) => {
  const useCase = new ProcessDecisionUseCase(...);
  const result = await useCase.execute({ sessionId, eventId, decisionId });
  res.json({ success: true, data: result });
});
```

#### 📦 AI - Gemini Service

**`AIService.ts`** - Integração com IA
```typescript
class GeminiService implements AIService {
  async generateNarrative(context, prompt): Promise<{ text: string }> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `
        REGRAS ABSOLUTAS:
        1. Você NUNCA toma decisões - apenas narra
        2. Você NUNCA sugere próximas ações
        3. Você NUNCA altera fatos ou estados
      `,
    });
    
    const result = await model.generateContent(prompt);
    return { text: result.response.text() };
  }
}

// Fallback quando IA não está disponível
class MockAIService implements AIService {
  async generateNarrative(context): Promise<{ text: string }> {
    // Narrativas pré-escritas baseadas no estado
    if (context.progression.triggeredFall) {
      return { text: 'A escuridão finalmente reclamou seu prêmio...' };
    }
    // ...
  }
}
```

---

## 🎨 Frontend - Explicação Detalhada

### Arquitetura do Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGES                                │
│  (Páginas: Home, Timeline, Event, State)                   │
├─────────────────────────────────────────────────────────────┤
│                      COMPONENTS                             │
│  (UI reutilizável: Button, Card, ForceMeter...)           │
├─────────────────────────────────────────────────────────────┤
│                        HOOKS                                │
│  (Lógica reutilizável: useSession, useDecision...)         │
├─────────────────────────────────────────────────────────────┤
│                        STORES                               │
│  (Estado global: Zustand)                                  │
├─────────────────────────────────────────────────────────────┤
│                       SERVICES                              │
│  (Comunicação com API: api.ts, anakin.service.ts)          │
├─────────────────────────────────────────────────────────────┤
│                        TYPES                                │
│  (Definições TypeScript)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 📦 Types (`frontend/src/types/`)

Define todos os tipos TypeScript usados na aplicação.

```typescript
// Tipos de emoção (espelhando backend)
export type EmotionType = 'hope' | 'fear' | 'anger' | 'love' | ...;

// Resultado de uma decisão (recebido da API)
export interface DecisionResult {
  success: boolean;
  characterState: {
    name: string;
    title: string;
    lightSide: number;
    darkSide: number;
    emotion: EmotionType;
  };
  progression: {
    triggeredFall: boolean;
    moralShift: 'toward_light' | 'toward_dark' | 'stable';
  };
  narrative: string;
}
```

### 📦 Services (`frontend/src/services/`)

Comunicação com a API backend.

**`api.ts`** - Cliente HTTP base
```typescript
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:3001/api',
      timeout: 30000,
    });
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    return response.data.data as T;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data as T;
  }
}
```

**`decision.service.ts`** - Serviço de decisões
```typescript
export const decisionService = {
  async getTimeline(sessionId: string) {
    return api.get(`/session/${sessionId}/timeline`);
  },

  async processDecision(sessionId, eventId, decisionId) {
    return api.post(`/session/${sessionId}/event/${eventId}/decision`, {
      decisionId,
    });
  },
};
```

### 📦 Stores (`frontend/src/stores/`)

Estado global usando Zustand.

**`useAnakinStore.ts`** - Store principal
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnakinState {
  // Estado
  sessionId: string | null;
  lightSide: number;
  darkSide: number;
  emotion: EmotionType;
  hasFallen: boolean;
  
  // Actions
  setSession: (sessionId: string, characterData: any) => void;
  updateCharacterState: (data: any) => void;
}

export const useAnakinStore = create<AnakinState>()(
  persist(
    (set) => ({
      // Estado inicial
      sessionId: null,
      lightSide: 60,
      darkSide: 20,
      
      // Ações para atualizar estado
      setSession: (sessionId, characterData) => set({
        sessionId,
        ...characterData,
      }),
      
      updateCharacterState: (data) => set({
        name: data.name,
        lightSide: data.lightSide,
        darkSide: data.darkSide,
        hasFallen: data.hasFallen,
      }),
    }),
    { name: 'anakin-storage' }  // Persiste no localStorage
  )
);
```

**Por que Zustand?**
- Simples e leve (menos de 1KB)
- Não precisa de Provider/Context
- API intuitiva com hooks
- Suporte a middleware (persist, devtools)

### 📦 Hooks (`frontend/src/hooks/`)

Lógica reutilizável encapsulada em hooks customizados.

**`useSession.ts`** - Gerencia sessão
```typescript
export function useSession() {
  const { sessionId, setSession } = useAnakinStore();
  const [isLoading, setIsLoading] = useState(false);

  const startSession = async () => {
    setIsLoading(true);
    const response = await anakinService.createSession();
    setSession(response.sessionId, response.character);
    setIsLoading(false);
  };

  return { sessionId, isLoading, startSession };
}
```

**`useDecision.ts`** - Gerencia decisões
```typescript
export function useDecision() {
  const [decisionResult, setDecisionResult] = useState(null);
  const { sessionId, updateCharacterState } = useAnakinStore();

  const processDecision = async (eventId, decision) => {
    const result = await decisionService.processDecision(
      sessionId, eventId, decision.id
    );
    
    // Atualiza estado global com dados do backend
    updateCharacterState({
      lightSide: result.characterState.lightSide,
      darkSide: result.characterState.darkSide,
      hasFallen: result.progression.triggeredFall,
    });
    
    setDecisionResult(result);
    return result;
  };

  return { decisionResult, processDecision };
}
```

### 📦 Components (`frontend/src/components/`)

Componentes visuais organizados por categoria.

**`ui/Button.tsx`** - Componente básico
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick,
}) => {
  const variants = {
    primary: 'bg-jedi-blue hover:bg-jedi-blue/80',
    danger: 'bg-sith-red hover:bg-sith-red/80',
  };

  return (
    <button className={`${variants[variant]} px-4 py-2 rounded`} onClick={onClick}>
      {children}
    </button>
  );
};
```

**`force/ForceMeter.tsx`** - Medidor de Força
```tsx
export const ForceMeter: React.FC<{ lightSide: number; darkSide: number }> = ({
  lightSide,
  darkSide,
}) => {
  return (
    <div className="flex h-4 rounded overflow-hidden">
      {/* Barra de luz */}
      <motion.div
        className="bg-jedi-blue"
        animate={{ width: `${lightSide}%` }}
      />
      {/* Barra de sombra */}
      <motion.div
        className="bg-sith-red"
        animate={{ width: `${darkSide}%` }}
      />
    </div>
  );
};
```

**`narrative/NarrativeBox.tsx`** - Caixa de narrativa com efeito typewriter
```tsx
export const NarrativeBox: React.FC<{ narrative: string }> = ({ narrative }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < narrative.length) {
        setDisplayedText(prev => prev + narrative[index]);
        index++;
      }
    }, 20);
    return () => clearInterval(interval);
  }, [narrative]);

  return (
    <div className="bg-imperial-dark p-6 rounded-xl">
      <p className="text-gray-200">{displayedText}</p>
    </div>
  );
};
```

### 📦 Pages (`frontend/src/pages/`)

Páginas da aplicação.

**`Home.tsx`** - Tela inicial
```tsx
export const Home: React.FC = () => {
  const { startSession, isLoading } = useSession();
  const navigate = useNavigate();

  const handleStart = async () => {
    await startSession();
    navigate('/timeline');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <h1>A Jornada de Anakin Skywalker</h1>
        <Button onClick={handleStart} loading={isLoading}>
          Iniciar Jornada
        </Button>
      </Card>
    </div>
  );
};
```

**`Event.tsx`** - Página de evento (onde decisões são tomadas)
```tsx
export const Event: React.FC = () => {
  const [phase, setPhase] = useState<'reading' | 'deciding' | 'result'>('reading');
  const { eventDetails, decisionResult, processDecision } = useDecision();

  return (
    <div>
      {phase === 'reading' && (
        <Card>
          <p>{eventDetails.event.description}</p>
          <Button onClick={() => setPhase('deciding')}>
            Fazer Minha Escolha
          </Button>
        </Card>
      )}

      {phase === 'deciding' && (
        <DecisionList
          decisions={eventDetails.decisions}
          onSubmit={(decision) => processDecision(eventId, decision)}
        />
      )}

      {phase === 'result' && (
        <>
          <NarrativeBox narrative={decisionResult.narrative} />
          <ForceMeter 
            lightSide={decisionResult.characterState.lightSide}
            darkSide={decisionResult.characterState.darkSide}
          />
        </>
      )}
    </div>
  );
};
```

---

## 🔄 Fluxo de Dados

### Fluxo Completo: Usuário Toma uma Decisão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  1. USUÁRIO clica em uma decisão                                           │
│                           │                                                 │
│                           ▼                                                 │
│  2. REACT chama hook useDecision.processDecision()                         │
│                           │                                                 │
│                           ▼                                                 │
│  3. SERVICE faz POST /api/session/:id/event/:id/decision                   │
│                           │                                                 │
│                           ▼                                                 │
│  4. EXPRESS recebe request e cria ProcessDecisionUseCase                   │
│                           │                                                 │
│                           ▼                                                 │
│  5. USE CASE busca dados via Repositories                                   │
│      │                                                                      │
│      ├── characterRepository.findBySessionId()                              │
│      ├── eventRepository.findById()                                         │
│      └── decisionRepository.findById()                                      │
│                           │                                                 │
│                           ▼                                                 │
│  6. USE CASE aplica REGRAS DE DOMÍNIO (MoralProgressionRules)              │
│      │                                                                      │
│      ├── character.applyMoralImpact(light, dark)                           │
│      ├── character.updateEmotion(newEmotion)                               │
│      ├── Title.determineFromMoralState(...)                                │
│      └── Detecta: triggeredFall, moralShift                                │
│                           │                                                 │
│                           ▼                                                 │
│  7. USE CASE persiste novo estado via Repository                            │
│      characterRepository.save(updatedCharacter)                             │
│                           │                                                 │
│                           ▼                                                 │
│  8. USE CASE chama IA para gerar narrativa                                  │
│      aiService.generateNarrative(context, prompt)                           │
│      (IA apenas interpreta, NUNCA decide!)                                  │
│                           │                                                 │
│                           ▼                                                 │
│  9. EXPRESS retorna JSON: { success, characterState, narrative }           │
│                           │                                                 │
│                           ▼                                                 │
│  10. SERVICE retorna dados para o Hook                                      │
│                           │                                                 │
│                           ▼                                                 │
│  11. HOOK atualiza estado global (Zustand Store)                            │
│       updateCharacterState({ lightSide, darkSide, hasFallen })             │
│                           │                                                 │
│                           ▼                                                 │
│  12. REACT re-renderiza componentes com novo estado                         │
│       └── ForceMeter mostra nova barra                                      │
│       └── NarrativeBox exibe texto da IA                                    │
│       └── EmotionBadge mostra nova emoção                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Como Tudo se Conecta

### Docker Compose - Orquestração

```yaml
# docker-compose.yml
services:
  postgres:     # Banco de dados
  redis:        # Cache
  backend:      # API Node.js (depende de postgres e redis)
  frontend:     # React (depende de backend)
```

**Ordem de inicialização:**
1. PostgreSQL inicia e fica saudável
2. Redis inicia e fica saudável
3. Backend inicia (conecta ao Postgres e Redis)
4. Frontend inicia (conecta ao Backend via API)

### Comunicação entre Camadas

```
┌─────────────────┐      HTTP/JSON      ┌─────────────────┐
│    FRONTEND     │◄──────────────────►│     BACKEND     │
│   (React)       │                     │    (Express)    │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────┐
                                    │    USE CASES        │
                                    │ (ProcessDecision)   │
                                    └────────┬────────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                        ┌──────────┐  ┌──────────┐  ┌──────────┐
                        │ DOMAIN   │  │ DOMAIN   │  │   AI     │
                        │ ENTITIES │  │  RULES   │  │ SERVICE  │
                        └────┬─────┘  └──────────┘  └──────────┘
                             │
                             ▼
                    ┌─────────────────┐      SQL      ┌──────────┐
                    │  REPOSITORIES   │◄─────────────►│ POSTGRES │
                    │ (implementação) │               └──────────┘
                    └─────────────────┘
```

---

## 📖 Glossário de Termos

| Termo | Significado |
|-------|-------------|
| **Entity** | Objeto com identidade única e ciclo de vida |
| **Value Object** | Objeto sem identidade, imutável, comparado por valores |
| **Repository** | Interface para acesso a dados (abstração do banco) |
| **Use Case** | Operação que o usuário pode realizar |
| **Domain Rules** | Regras de negócio puras (sem I/O) |
| **Clean Architecture** | Separação em camadas independentes |
| **DDD** | Domain-Driven Design - modelagem focada no negócio |
| **Zustand** | Biblioteca de estado global para React |
| **Hook** | Função React para lógica reutilizável |
| **Imutabilidade** | Dados que não mudam; criamos novos em vez de alterar |
| **Factory Method** | Padrão para criar objetos de forma controlada |
| **Dependency Injection** | Passar dependências em vez de criá-las internamente |

---

## 🚀 Para Replicar Este Projeto

1. **Entenda as regras de negócio primeiro** - O que faz um personagem "cair"? Como emoções funcionam?

2. **Modele o domínio** - Crie Entities, Value Objects e Rules antes de pensar em banco/API

3. **Defina interfaces de Repository** - O que você precisa buscar/salvar?

4. **Crie Use Cases** - Como as operações fluem?

5. **Implemente infraestrutura** - Banco, API, IA são detalhes técnicos

6. **Frontend consome a API** - Store → Hooks → Components → Pages

7. **Docker orquestra tudo** - Ambiente reproduzível

---

**Lembre-se:** A arquitetura existe para servir o produto, não o contrário. Comece simples e evolua conforme necessário! 🌟
