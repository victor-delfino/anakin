// ============================================
// INFRASTRUCTURE - DATABASE SEEDS
// ============================================
// Popula o banco com eventos e decisões canônicas

import { v4 as uuid } from 'uuid';
import { query } from '../connection.js';

interface SeedEvent {
  id: string;
  title: string;
  description: string;
  era: string;
  order: number;
  isKeyMoment: boolean;
  previousEventId?: string;
  decisions: Array<{
    text: string;
    alignment: 'light' | 'dark' | 'neutral';
    lightDelta: number;
    darkDelta: number;
    emotion: string;
    context: string;
  }>;
}

const seedEvents: SeedEvent[] = [
  {
    id: uuid(),
    title: 'Deixando Tatooine',
    description: 'Qui-Gon Jinn oferece libertá-lo da escravidão, mas você precisa deixar sua mãe para trás. A promessa de se tornar um Jedi brilha como uma estrela distante.',
    era: 'phantom_menace',
    order: 1,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Abraçar sua mãe e prometer que voltará para libertá-la, aceitando a jornada Jedi com esperança',
        alignment: 'light',
        lightDelta: 10,
        darkDelta: 0,
        emotion: 'hope',
        context: 'A separação é dolorosa, mas há esperança de reencontro',
      },
      {
        text: 'Hesitar profundamente, questionando se vale a pena abandonar quem você ama',
        alignment: 'neutral',
        lightDelta: 5,
        darkDelta: 5,
        emotion: 'confusion',
        context: 'O medo do desconhecido e o amor pela mãe criam conflito',
      },
      {
        text: 'Sentir raiva por ter sido forçado a escolher - por que a vida é tão injusta?',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 10,
        emotion: 'anger',
        context: 'A injustiça da situação desperta ressentimento',
      },
    ],
  },
  {
    id: uuid(),
    title: 'A Batalha de Naboo',
    description: 'Você está no cockpit de um caça estelar durante a invasão de Naboo. A batalha ferve ao redor. Sua habilidade natural com a Força pode fazer a diferença.',
    era: 'phantom_menace',
    order: 2,
    isKeyMoment: false,
    decisions: [
      {
        text: 'Confiar na Força e agir com calma, protegendo seus aliados',
        alignment: 'light',
        lightDelta: 8,
        darkDelta: 0,
        emotion: 'determination',
        context: 'Você permite que a Força guie suas ações',
      },
      {
        text: 'Deixar a adrenalina guiar você, buscando emoção na batalha',
        alignment: 'neutral',
        lightDelta: 3,
        darkDelta: 5,
        emotion: 'pride',
        context: 'A emoção da batalha é intoxicante',
      },
      {
        text: 'Sentir prazer em destruir os inimigos - eles merecem',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 12,
        emotion: 'anger',
        context: 'A violência traz uma satisfação perturbadora',
      },
    ],
  },
  {
    id: uuid(),
    title: 'Anos de Treinamento',
    description: 'Obi-Wan Kenobi é seu mestre. O treinamento é rigoroso e as regras dos Jedi são estritas. Você sente que é especial, mas o Conselho não parece reconhecer isso.',
    era: 'attack_of_clones',
    order: 3,
    isKeyMoment: false,
    decisions: [
      {
        text: 'Aceitar os ensinamentos com humildade, mesmo quando parecem restritivos',
        alignment: 'light',
        lightDelta: 10,
        darkDelta: 0,
        emotion: 'peace',
        context: 'Disciplina é o caminho para a maestria',
      },
      {
        text: 'Questionar algumas regras que parecem sem sentido, mas respeitar Obi-Wan',
        alignment: 'neutral',
        lightDelta: 5,
        darkDelta: 5,
        emotion: 'confusion',
        context: 'Dúvidas são naturais, mas você busca equilíbrio',
      },
      {
        text: 'Ressentir-se das restrições - você é o Escolhido, deveria ter tratamento especial',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 10,
        emotion: 'pride',
        context: 'A arrogância sussurra que você merece mais',
      },
    ],
  },
  {
    id: uuid(),
    title: 'Reencontro com Padmé',
    description: 'Anos depois, você reencontra a Senadora Amidala. Sentimentos proibidos pelo Código Jedi surgem em seu coração. O amor é uma escolha perigosa para um Jedi.',
    era: 'attack_of_clones',
    order: 4,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Reconhecer os sentimentos mas mantê-los sob controle, respeitando o Código',
        alignment: 'light',
        lightDelta: 8,
        darkDelta: 0,
        emotion: 'peace',
        context: 'Você escolhe o dever sobre o desejo',
      },
      {
        text: 'Confessar seus sentimentos a Padmé, sabendo que é arriscado',
        alignment: 'neutral',
        lightDelta: 5,
        darkDelta: 8,
        emotion: 'love',
        context: 'O amor é mais forte que as regras',
      },
      {
        text: 'Deixar a paixão consumir você - regras não se aplicam ao Escolhido',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 15,
        emotion: 'love',
        context: 'A paixão obscurece o julgamento',
      },
    ],
  },
  {
    id: uuid(),
    title: 'Pesadelos sobre Shmi',
    description: 'Visões terríveis atormentam seus sonhos. Você vê sua mãe em perigo, sofrendo. A Força está mostrando o futuro - ou testando você?',
    era: 'attack_of_clones',
    order: 5,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Meditar sobre as visões e buscar orientação de Obi-Wan',
        alignment: 'light',
        lightDelta: 10,
        darkDelta: 0,
        emotion: 'fear',
        context: 'Você busca sabedoria em vez de agir impulsivamente',
      },
      {
        text: 'Partir imediatamente para Tatooine, ignorando ordens',
        alignment: 'neutral',
        lightDelta: 0,
        darkDelta: 10,
        emotion: 'determination',
        context: 'O amor filial supera a obediência',
      },
      {
        text: 'Jurar que fará qualquer um que machucou sua mãe pagar com sangue',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 18,
        emotion: 'anger',
        context: 'A raiva consome o medo, prometendo poder',
      },
    ],
  },
  {
    id: uuid(),
    title: 'O Massacre dos Tusken',
    description: 'Você encontrou sua mãe nos braços, mas era tarde demais. Ela morreu em seus braços. Os Tusken Raiders estão ao redor. O que você fará?',
    era: 'attack_of_clones',
    order: 6,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Chorar sua perda e partir, sabendo que vingança não trará sua mãe de volta',
        alignment: 'light',
        lightDelta: 15,
        darkDelta: 0,
        emotion: 'grief',
        context: 'A dor é imensa, mas você escolhe a luz',
      },
      {
        text: 'Matar os guerreiros responsáveis, mas poupar mulheres e crianças',
        alignment: 'neutral',
        lightDelta: 0,
        darkDelta: 15,
        emotion: 'anger',
        context: 'Justiça ou vingança? A linha é tênue',
      },
      {
        text: 'Massacrar todos - homens, mulheres e crianças. Todos pagarão.',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 25,
        emotion: 'hatred',
        context: 'A escuridão consome tudo. Não há perdão.',
      },
    ],
  },
  {
    id: uuid(),
    title: 'Herói das Guerras Clônicas',
    description: 'Você se tornou um general respeitado. Suas vitórias são lendárias, mas a guerra está mudando você. O Conselho ainda não lhe concedeu o título de Mestre.',
    era: 'clone_wars',
    order: 7,
    isKeyMoment: false,
    decisions: [
      {
        text: 'Usar sua fama para inspirar esperança e proteger os inocentes',
        alignment: 'light',
        lightDelta: 10,
        darkDelta: 0,
        emotion: 'hope',
        context: 'Você é um símbolo de luz nas trevas da guerra',
      },
      {
        text: 'Aceitar a admiração como merecida - você é o melhor',
        alignment: 'neutral',
        lightDelta: 3,
        darkDelta: 8,
        emotion: 'pride',
        context: 'O reconhecimento é justo, mas o orgulho cresce',
      },
      {
        text: 'Ressentir-se do Conselho - eles temem seu poder',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 12,
        emotion: 'anger',
        context: 'A desconfiança alimenta a distância',
      },
    ],
  },
  {
    id: uuid(),
    title: 'Visões de Padmé',
    description: 'Os pesadelos retornaram. Desta vez você vê Padmé morrendo no parto. Você não pode perdê-la como perdeu sua mãe. Palpatine sugere que existe um poder para salvar vidas.',
    era: 'revenge_of_sith',
    order: 8,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Confiar na Força e aceitar que nem tudo pode ser controlado',
        alignment: 'light',
        lightDelta: 15,
        darkDelta: 0,
        emotion: 'peace',
        context: 'A aceitação é difícil, mas é o caminho Jedi',
      },
      {
        text: 'Buscar conhecimento proibido para salvar Padmé, sem importar a fonte',
        alignment: 'neutral',
        lightDelta: 0,
        darkDelta: 15,
        emotion: 'fear',
        context: 'O medo de perder supera todas as regras',
      },
      {
        text: 'Ouvir Palpatine - os Jedi são fracos, os Sith têm verdadeiro poder',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 25,
        emotion: 'despair',
        context: 'A escuridão oferece o que a luz não pode',
      },
    ],
  },
  {
    id: uuid(),
    title: 'A Revelação de Palpatine',
    description: 'Palpatine revelou sua verdadeira identidade: Darth Sidious, Lorde Sith. Ele oferece ensinar o poder de salvar Padmé. Mace Windu está vindo para prendê-lo.',
    era: 'revenge_of_sith',
    order: 9,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Apoiar Mace Windu e os Jedi - Palpatine deve enfrentar justiça',
        alignment: 'light',
        lightDelta: 20,
        darkDelta: 0,
        emotion: 'determination',
        context: 'Você escolhe o Código Jedi sobre promessas vazias',
      },
      {
        text: 'Ficar paralisado, incapaz de escolher entre dois caminhos',
        alignment: 'neutral',
        lightDelta: 5,
        darkDelta: 10,
        emotion: 'confusion',
        context: 'A indecisão pode custar tudo',
      },
      {
        text: 'Impedir Mace Windu - sem Palpatine, Padmé morrerá',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 30,
        emotion: 'despair',
        context: 'Uma escolha que não pode ser desfeita',
      },
    ],
  },
  {
    id: uuid(),
    title: 'A Queda Final',
    description: 'Mace Windu está prestes a derrotar Palpatine. Este é o momento decisivo. Suas próximas palavras e ações definirão o destino da galáxia.',
    era: 'revenge_of_sith',
    order: 10,
    isKeyMoment: true,
    decisions: [
      {
        text: 'Permitir que Mace Windu execute justiça - os Jedi devem prevalecer',
        alignment: 'light',
        lightDelta: 25,
        darkDelta: 0,
        emotion: 'peace',
        context: 'A paz vem com a aceitação do que não pode ser mudado',
      },
      {
        text: 'Gritar "Não!", cortando a mão de Mace e permitindo que Palpatine o mate',
        alignment: 'dark',
        lightDelta: 0,
        darkDelta: 40,
        emotion: 'despair',
        context: 'O ponto sem retorno. Anakin Skywalker morre. Darth Vader nasce.',
      },
    ],
  },
];

export async function runSeeds(): Promise<void> {
  console.log('Running database seeds...');

  // Limpar dados existentes (ordem importante por causa das foreign keys)
  await query('DELETE FROM user_decision_records');
  await query('DELETE FROM decisions');
  await query('DELETE FROM canonical_events');
  await query('DELETE FROM characters');
  await query('DELETE FROM sessions');

  // Inserir eventos em ordem
  let previousEventId: string | null = null;

  for (const event of seedEvents) {
    await query(
      `INSERT INTO canonical_events 
       (id, title, description, era, chronological_order, is_key_moment, required_previous_event_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        event.id,
        event.title,
        event.description,
        event.era,
        event.order,
        event.isKeyMoment,
        previousEventId,
      ]
    );

    // Inserir decisões do evento
    for (let i = 0; i < event.decisions.length; i++) {
      const decision = event.decisions[i];
      await query(
        `INSERT INTO decisions 
         (id, event_id, text, alignment, light_side_delta, dark_side_delta, resulting_emotion, narrative_context, "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          uuid(),
          event.id,
          decision.text,
          decision.alignment,
          decision.lightDelta,
          decision.darkDelta,
          decision.emotion,
          decision.context,
          i + 1,
        ]
      );
    }

    previousEventId = event.id;
    console.log(`Seeded event: ${event.title}`);
  }

  console.log('Seeds completed successfully');
}

// Entry point
if (process.argv[1].includes('run.ts') || process.argv[1].includes('seeds')) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
