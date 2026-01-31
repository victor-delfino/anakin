# Anakin Narrative System

Sistema narrativo interativo baseado na trajetória de Anakin Skywalker, implementado com Clean Architecture.

## 🖼️ Screenshots

### Tela Inicial
![Tela Inicial](https://raw.githubusercontent.com/victor-delfino/anakin/main/docs/images/home.png)

### Timeline - Após as Primeiras Escolhas
![Timeline](https://raw.githubusercontent.com/victor-delfino/anakin/main/docs/images/timeline.png)

### O Caminho de Vader - A Queda
![Vader Path](https://raw.githubusercontent.com/victor-delfino/anakin/main/docs/images/vader_decision.png)

## 🎯 Sobre o Projeto

Este é um sistema de narrativa interativa onde o usuário acompanha eventos canônicos da vida de Anakin Skywalker, toma decisões e observa a progressão moral (Lado Luminoso x Lado Sombrio).

### Princípios Fundamentais

- **IA nunca toma decisões** - Apenas narra e interpreta
- **IA nunca altera estado** - Regras são determinísticas
- **IA apenas narra** - Interpreta emoções e conflitos internos

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

### Com Docker (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/anakin-narrative.git
cd anakin-narrative

# Subir todos os serviços
docker compose up --build

# Em outro terminal, rodar migrations e seeds (primeira vez apenas)
docker exec anakin_backend npm run db:migrate
docker exec anakin_backend npm run db:seed

# Acessar a aplicação
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api
```

> **Nota:** O projeto funciona imediatamente após o clone! As narrativas usam textos pré-escritos (MockAIService). Para narrativas geradas por IA, veja a seção "Configuração da IA" abaixo.

### Parar os Serviços

```bash
docker compose down
```

### Configuração da IA (Opcional)

Para usar narrativas geradas por IA (Google Gemini):

1. Obtenha uma API key em https://aistudio.google.com/apikey
2. Crie um arquivo `.env` na raiz do projeto:

```bash
GEMINI_API_KEY=sua_api_key_aqui
GEMINI_MODEL=gemini-2.0-flash
```

3. Reinicie os containers:

```bash
docker compose down
docker compose up
```

### Desenvolvimento Local

#### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Inicializar Banco de Dados

```bash
cd backend
npm run db:migrate
npm run db:seed
```

## 📁 Estrutura do Projeto

```
project/
├── backend/
│   └── src/
│       ├── domain/           # Entidades, Value Objects, Regras
│       ├── application/      # Use Cases, Interfaces
│       └── infrastructure/   # Database, Cache, AI, HTTP
├── frontend/
│   └── src/
│       ├── pages/            # Páginas da aplicação
│       ├── components/       # Componentes React
│       ├── stores/           # Estado global (Zustand)
│       ├── services/         # Serviços de API
│       └── hooks/            # Custom hooks
└── docker-compose.yml
```

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/session` | Inicia nova sessão |
| GET | `/api/session/:id/timeline` | Lista eventos |
| GET | `/api/session/:id/event/:eventId` | Detalhes do evento |
| POST | `/api/session/:id/event/:eventId/decision` | Processa decisão |
| GET | `/api/session/:id/character` | Estado do personagem |
| GET | `/api/session/:id/history` | Histórico completo de decisões |

## 🎮 Fluxo do Sistema

1. **Iniciar Sessão** → Cria Anakin no estado inicial
2. **Visualizar Timeline** → Lista eventos disponíveis
3. **Acessar Evento** → Lê descrição e decisões
4. **Tomar Decisão** → Sistema aplica regras determinísticas
5. **Receber Narrativa** → IA interpreta o momento
6. **Repetir** → Próximo evento

## 🧠 Arquitetura

### Domain Layer

- **Entities**: Character, CanonicalEvent, Decision, UserDecisionRecord
- **Value Objects**: MoralState, Emotion, Title, ForceConnection
- **Rules**: MoralProgressionRules, EventProgressionRules
- **Services**: NarrativeContextService

### Application Layer

- **Use Cases**: StartSession, GetTimeline, GetEvent, ProcessDecision, GetCharacterState, GetSessionHistory
- **Interfaces**: Repositories, AIService, CacheService

### Infrastructure Layer

- **Database**: PostgreSQL com repositories
- **Cache**: Redis
- **AI**: OpenAI/Mock para narrativas
- **HTTP**: Express server e rotas

## ⚙️ Regras de Negócio

### Sistema Moral Balanceado

O sistema usa um modelo de **equilíbrio dinâmico** entre Luz e Trevas:

| Tipo de Decisão | Efeito na Luz | Efeito nas Trevas |
|-----------------|---------------|-------------------|
| **Luz** ☀️ | +intensidade | -intensidade/2 |
| **Neutra** ⚖️ | +intensidade/2 | +intensidade/2 |
| **Trevas** 🌑 | -intensidade/2 | +intensidade |

- **Estado inicial**: 50 Luz / 20 Trevas
- **Limites**: 0-100 para ambos os valores
- Decisões neutras aumentam o **conflito interno**

### Progressão Moral

- `darkSide >= 80` → Queda para o Lado Sombrio
- `lightSide >= 90 && darkSide <= 20` → **O Escolhido** (Chosen One)
- `lightSide >= 85 && darkSide <= 30` → Maestria Jedi
- Decisões afetam valores numéricos determinísticos

### Títulos

- Slave → Padawan → Jedi Knight → Jedi Master → **Chosen One** (caminho da luz)
- Fallen Jedi → Darth Vader (caminho das trevas)

### Conexão com a Força

- **ForceConnection** - Representa a conexão de Anakin com a Força
- Níveis: Dormant → Awakening → Trained → Powerful → Extraordinary → Chosen One
- Anakin possui 27.000 midi-chlorians (maior que Yoda)

## 🛡️ Tecnologias

### Backend
- Node.js + TypeScript
- PostgreSQL
- Redis
- Express
- Clean Architecture / DDD

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router

Teste agora mesmo:
https://anakin-1.onrender.com/

## 📝 Licença

Este projeto é para fins educacionais. Star Wars é propriedade da Lucasfilm/Disney.
