import type { Pergunta } from '../tipos';

export const perguntasUnidade10: Pergunta[] = [
  // === Level 1 — Basic comparatives ===
  {
    id: 'u10_1_1', unidade: 'Unidade 10', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma comparativa de "fast"?',
    opcoes: ['faster', 'more fast', 'fastest', 'most fast'],
    resposta: 'faster',
  },
  {
    id: 'u10_1_2', unidade: 'Unidade 10', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'Para adjetivos CURTOS (1 sílaba), adicionamos "-er" para fazer o comparativo.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u10_1_3', unidade: 'Unidade 10', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "He is ___ than his brother." (Ele é mais alto que o irmão.)',
    opcoes: ['taller', 'more tall', 'tallest', 'tall'],
    resposta: 'taller',
  },

  // === Level 2 — More + adjective ===
  {
    id: 'u10_2_1', unidade: 'Unidade 10', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma comparativa de "honest"?',
    opcoes: ['more honest', 'honester', 'most honest', 'honestier'],
    resposta: 'more honest',
  },
  {
    id: 'u10_2_2', unidade: 'Unidade 10', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: 'Para adjetivos LONGOS (3+ sílabas), usamos "more" antes do adjetivo.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u10_2_3', unidade: 'Unidade 10', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma comparativa de "interesting"?',
    opcoes: ['more interesting', 'interestinger', 'most interesting', 'interestingest'],
    resposta: 'more interesting',
  },

  // === Level 3 — Doubling consonant ===
  {
    id: 'u10_3_1', unidade: 'Unidade 10', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma comparativa de "big"?',
    opcoes: ['bigger', 'biger', 'more big', 'biggest'],
    resposta: 'bigger',
  },
  {
    id: 'u10_3_2', unidade: 'Unidade 10', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma comparativa de "angry"?',
    opcoes: ['angrier', 'more angry', 'angryier', 'most angry'],
    resposta: 'angrier',
  },
  {
    id: 'u10_3_3', unidade: 'Unidade 10', categoria: 'grammar', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione o adjetivo com sua forma comparativa:',
    pares: [
      { esquerda: 'fast', direita: 'faster' },
      { esquerda: 'big', direita: 'bigger' },
      { esquerda: 'happy', direita: 'happier' },
      { esquerda: 'expensive', direita: 'more expensive' },
    ],
  },

  // === Level 4 ===
  {
    id: 'u10_4_1', unidade: 'Unidade 10', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual forma comparativa está INCORRETA?',
    opcoes: ['more better', 'bigger', 'angrier', 'more expensive'],
    resposta: 'more better',
  },
  {
    id: 'u10_4_2', unidade: 'Unidade 10', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: '"Than" aparece nas frases comparativas para:',
    opcoes: ['comparar dois elementos', 'indicar tempo', 'expressar causa', 'descrever lugar'],
    resposta: 'comparar dois elementos',
  },

  // === Level 5 ===
  {
    id: 'u10_5_1', unidade: 'Unidade 10', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa o comparativo CORRETAMENTE?',
    opcoes: [
      'English is easier than Chinese.',
      'English is more easy than Chinese.',
      'English is easyer than Chinese.',
      'English is most easy than Chinese.',
    ],
    resposta: 'English is easier than Chinese.',
  },
  {
    id: 'u10_5_2', unidade: 'Unidade 10', categoria: 'grammar', nivel: 5, tipo: 'ligar',
    enunciado: 'Forme o comparativo corretamente:',
    pares: [
      { esquerda: 'cheap', direita: 'cheaper' },
      { esquerda: 'beautiful', direita: 'more beautiful' },
      { esquerda: 'hot', direita: 'hotter' },
      { esquerda: 'difficult', direita: 'more difficult' },
    ],
  },
];
