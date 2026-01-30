// ============================================
// INFRASTRUCTURE - HTTP ROUTES
// ============================================

import { Router, Request, Response, NextFunction } from 'express';
import {
  StartSessionUseCase,
  GetTimelineUseCase,
  GetEventUseCase,
  ProcessDecisionUseCase,
  GetCharacterStateUseCase,
  GetSessionHistoryUseCase,
} from '../../application/useCases/index.js';
import {
  PostgresCharacterRepository,
  PostgresEventRepository,
  PostgresDecisionRepository,
  PostgresUserDecisionRecordRepository,
} from '../database/repositories/index.js';
import { InMemoryCacheService } from '../cache/RedisCacheService.js';
import { MockAIService, GeminiService } from '../ai/AIService.js';

const router = Router();

// Instanciar dependências
const characterRepository = new PostgresCharacterRepository();
const eventRepository = new PostgresEventRepository();
const decisionRepository = new PostgresDecisionRepository();
const userDecisionRepository = new PostgresUserDecisionRecordRepository();
const cacheService = new InMemoryCacheService();

// Usar MockAIService por padrão, GeminiService se API key configurada
const aiService = process.env.GEMINI_API_KEY 
  ? new GeminiService() 
  : new MockAIService();

// Wrapper para async handlers
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================
// ROTAS DA API
// ============================================

/**
 * POST /api/session
 * Inicia uma nova sessão narrativa
 */
router.post('/session', asyncHandler(async (req: Request, res: Response) => {
  const useCase = new StartSessionUseCase(characterRepository, cacheService);
  const result = await useCase.execute({});
  
  res.status(201).json({
    success: true,
    data: result,
  });
}));

/**
 * GET /api/session/:sessionId/timeline
 * Retorna a linha do tempo com status de eventos
 */
router.get('/session/:sessionId/timeline', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const useCase = new GetTimelineUseCase(
    eventRepository,
    userDecisionRepository,
    characterRepository
  );

  const result = await useCase.execute({ sessionId });

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * GET /api/session/:sessionId/event/:eventId
 * Retorna detalhes de um evento e suas decisões
 */
router.get('/session/:sessionId/event/:eventId', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, eventId } = req.params;

  const useCase = new GetEventUseCase(
    eventRepository,
    decisionRepository,
    characterRepository,
    userDecisionRepository
  );

  const result = await useCase.execute({ sessionId, eventId });

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * POST /api/session/:sessionId/event/:eventId/decision
 * Processa uma decisão do usuário
 */
router.post('/session/:sessionId/event/:eventId/decision', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, eventId } = req.params;
  const { decisionId } = req.body;

  if (!decisionId) {
    res.status(400).json({
      success: false,
      error: 'decisionId is required',
    });
    return;
  }

  const useCase = new ProcessDecisionUseCase(
    characterRepository,
    eventRepository,
    decisionRepository,
    userDecisionRepository,
    aiService,
    cacheService
  );

  const result = await useCase.execute({ sessionId, eventId, decisionId });

  // DEBUG: Log narrative to find undefined issue
  console.log('=== NARRATIVE DEBUG ===');
  console.log('Narrative value:', JSON.stringify(result.narrative));
  console.log('Narrative type:', typeof result.narrative);
  console.log('Narrative includes undefined:', result.narrative?.includes('undefined'));
  console.log('=== END DEBUG ===');

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * GET /api/session/:sessionId/character
 * Retorna o estado atual do personagem
 */
router.get('/session/:sessionId/character', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const useCase = new GetCharacterStateUseCase(
    characterRepository,
    userDecisionRepository
  );

  const result = await useCase.execute({ sessionId });

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * GET /api/session/:sessionId/history
 * Retorna o histórico completo de decisões da sessão
 */
router.get('/session/:sessionId/history', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const useCase = new GetSessionHistoryUseCase(
    userDecisionRepository,
    eventRepository,
    decisionRepository
  );

  const result = await useCase.execute({ sessionId });

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * GET /api/health
 * Health check
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'anakin-narrative-api',
  });
});

export default router;
