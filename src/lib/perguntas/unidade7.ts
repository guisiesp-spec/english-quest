import type { Pergunta } from '../tipos';

export const perguntasUnidade7: Pergunta[] = [
  // === Level 1 ===
  {
    id: 'u7_1_1', unidade: 'Unidade 7', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I ___ speak English." (Eu consigo falar inglês.)',
    opcoes: ['can', "can't", 'am', 'do'],
    resposta: 'can',
  },
  {
    id: 'u7_1_2', unidade: 'Unidade 7', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"Can" é usado para expressar habilidade ou possibilidade.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u7_1_3', unidade: 'Unidade 7', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma NEGATIVA de "can"?',
    opcoes: ["can't / cannot", "cann't", "don't can", "not can"],
    resposta: "can't / cannot",
  },

  // === Level 2 ===
  {
    id: 'u7_2_1', unidade: 'Unidade 7', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "Fish ___ fly." (Peixes não conseguem voar.)',
    opcoes: ["can't", 'can', "doesn't", "aren't"],
    resposta: "can't",
  },
  {
    id: 'u7_2_2', unidade: 'Unidade 7', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a resposta corta para "Can you swim?"?',
    opcoes: ['Yes, I can.', 'Yes, I am.', 'Yes, I do.', 'Yes, I will.'],
    resposta: 'Yes, I can.',
  },
  {
    id: 'u7_2_3', unidade: 'Unidade 7', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"She can sings." está correto.',
    resposta: 'falso',
    explicacao: 'Após "can", o verbo fica no infinitivo sem "to": "She can sing."',
  },

  // === Level 3 ===
  {
    id: 'u7_3_1', unidade: 'Unidade 7', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como transformar "She can dance." em pergunta?',
    opcoes: ['Can she dance?', 'She can dance?', 'Does she can dance?', 'Is she can dance?'],
    resposta: 'Can she dance?',
  },
  {
    id: 'u7_3_2', unidade: 'Unidade 7', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ you help me, please?" (Você pode me ajudar?)',
    opcoes: ['Can', 'Are', 'Do', 'Is'],
    resposta: 'Can',
  },

  // === Level 4 ===
  {
    id: 'u7_4_1', unidade: 'Unidade 7', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está INCORRETA?',
    opcoes: [
      'She can to drive.',
      'She can drive.',
      "She can't drive.",
      'Can she drive?',
    ],
    resposta: 'She can to drive.',
  },
  {
    id: 'u7_4_2', unidade: 'Unidade 7', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione a situação com can ou can\'t:',
    pares: [
      { esquerda: 'Birds fly.', direita: 'can' },
      { esquerda: 'Cats bark.', direita: "can't" },
      { esquerda: 'Dogs swim.', direita: 'can' },
      { esquerda: 'Fish climb trees.', direita: "can't" },
    ],
  },

  // === Level 5 ===
  {
    id: 'u7_5_1', unidade: 'Unidade 7', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está COMPLETAMENTE correta?',
    opcoes: [
      "Can she speak English? Yes, she can.",
      "Can she speaks English? Yes, she can.",
      "Can she speak English? Yes, she cans.",
      "Does she can speak English? Yes, she can.",
    ],
    resposta: "Can she speak English? Yes, she can.",
  },
];
