// ============================================
// INFRASTRUCTURE - AI SERVICE (GEMINI)
// ============================================
// Serviço de IA para geração de narrativas
// 
// REGRA FUNDAMENTAL:
// - A IA recebe APENAS contexto
// - A IA retorna APENAS texto narrativo
// - A IA NUNCA modifica estado
// - A IA NUNCA toma decisões

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, GeneratedNarrative } from '../../application/services/AIService.js';
import { NarrativeContext } from '../../domain/services/NarrativeContextService.js';

export class GeminiService implements AIService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async generateNarrative(
    context: NarrativeContext,
    promptTemplate: string
  ): Promise<GeneratedNarrative> {
    try {
      const model = this.client.getGenerativeModel({ 
        model: this.model,
        systemInstruction: `Você é um narrador especializado em Star Wars, focando na perspectiva interna de Anakin Skywalker.
            
REGRAS ABSOLUTAS:
1. Você NUNCA toma decisões - apenas narra
2. Você NUNCA sugere próximas ações
3. Você NUNCA altera fatos ou estados
4. Você apenas INTERPRETA e NARRA o conflito interno
5. Use linguagem poética e dramática
6. Mantenha consistência com o cânone Star Wars
7. Responda APENAS em português brasileiro`,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: promptTemplate }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
        },
      });

      const response = result.response;
      const text = response.text() || '';
      
      return {
        text: text.trim(),
        generatedAt: new Date(),
        tokensUsed: response.usageMetadata?.totalTokenCount,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate narrative');
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      await model.generateContent('test');
      return true;
    } catch {
      return false;
    }
  }
}

// Alias para compatibilidade
export const OpenAIService = GeminiService;

// Fallback para quando OpenAI não está disponível
export class MockAIService implements AIService {
  async generateNarrative(
    context: NarrativeContext,
    _promptTemplate: string
  ): Promise<GeneratedNarrative> {
    // Narrativas pré-definidas baseadas no estado
    let narrative: string;

    if (context.progression.triggeredFall) {
      narrative = `A escuridão finalmente reclamou seu prêmio. Você sente a luz se extinguir dentro de você como uma vela soprada pelo vento do deserto. Anakin Skywalker - o nome ecoa como um sussurro distante de uma vida que não é mais sua.

Você escolheu. E nessa escolha, selou não apenas seu destino, mas o de todos que um dia amou. A armadura fria que agora envolve seu coração não é de durasteel, mas de culpa e desespero transformados em raiva pura.

"Anakin Skywalker foi fraco", você diz a si mesmo. "Eu sou mais forte." Mas nas profundezas de sua alma corrompida, uma voz pequena chora - e você a silencia com ódio.`;
    } else if (context.progression.moralShift === 'toward_dark') {
      narrative = `As sombras dentro de você crescem mais longas. Cada escolha parece justificável no momento - necessária, até. Mas você sente algo se contorcendo em seu peito, algo que um dia foi luz pura.

"O medo leva à raiva, a raiva leva ao ódio", as palavras de Yoda ecoam em sua mente. Você as afasta com irritação. O que o velho mestre sabe sobre proteger quem você ama?

A Força pulsa ao seu redor, mais escura, mais poderosa. E no fundo, uma parte de você sussurra que este poder tem um preço. Mas você está disposto a pagar?`;
    } else if (context.progression.moralShift === 'toward_light') {
      narrative = `Uma centelha de esperança persiste em seu coração, teimosa como o sol nascendo sobre as dunas de Tatooine. Você fez a escolha certa - ou pelo menos, a escolha que permite que você olhe no espelho sem desviar os olhos.

A Força flui através de você como um rio cristalino. Por um momento, você sente a paz que os mestres Jedi descrevem - aquela harmonia com o universo que parecia tão distante.

Ainda há conflito dentro de você. Sempre haverá. Mas hoje, a luz é mais forte que a sombra.`;
    } else {
      narrative = `O equilíbrio é precário, como caminhar sobre um fio de luz sobre um abismo de escuridão. Você está no limiar entre dois mundos, dois destinos, duas versões de quem você poderia se tornar.

A Força não julga - ela simplesmente é. Mas você sente seu fluxo ao redor, esperando sua próxima escolha. Luz e sombra dançam em seu coração como parceiros eternos.

"Eu sou o Escolhido", você pensa. Mas escolhido para quê? A resposta está em suas mãos. Sempre esteve.`;
    }

    // Adicionar contexto emocional
    if (context.character.emotion === 'fear') {
      narrative += `\n\nO medo gruda em sua pele como suor frio. Você tenta respirar, mas a ansiedade aperta seu peito. O que acontecerá a seguir? Você consegue suportar outra perda?`;
    } else if (context.character.emotion === 'anger') {
      narrative += `\n\nA raiva queima em suas veias como fogo líquido. É tentador - tão tentador - deixá-la guiar suas ações. A raiva é honesta, direta, poderosa. Mas a que custo?`;
    } else if (context.character.emotion === 'love') {
      narrative += `\n\nO amor é sua maior força e sua maior fraqueza. Por amor, você atravessaria a galáxia. Por amor, você queimaria o mundo. Será que os Jedi estavam certos em proibir tais vínculos?`;
    }

    return {
      text: narrative,
      generatedAt: new Date(),
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
