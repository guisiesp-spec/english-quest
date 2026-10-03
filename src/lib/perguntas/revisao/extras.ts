import type { Pergunta } from '../../tipos';

// 6 W's: What, Where, When, Who, Why, Which
// 4 How's: How, How often, How many, How much

export const perguntasExtras: Pergunta[] = [
  // === Level 1 — Basic W's ===
  {
    id: 'ex_1_1', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual palavra-interrogativa usamos para perguntar sobre um LUGAR?',
    opcoes: ['Where', 'When', 'Who', 'What'],
    resposta: 'Where',
  },
  {
    id: 'ex_1_2', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual palavra-interrogativa usamos para perguntar sobre uma PESSOA?',
    opcoes: ['Who', 'What', 'Where', 'Which'],
    resposta: 'Who',
  },
  {
    id: 'ex_1_3', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual palavra-interrogativa usamos para perguntar sobre UM MOMENTO NO TEMPO?',
    opcoes: ['When', 'Where', 'Why', 'How'],
    resposta: 'When',
  },
  {
    id: 'ex_1_4', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"What" é usado para perguntar sobre coisas ou ações.',
    resposta: 'verdadeiro',
  },

  // === Level 2 — W's in context ===
  {
    id: 'ex_2_1', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ is your name?"',
    opcoes: ['What', 'Who', 'Where', 'Which'],
    resposta: 'What',
  },
  {
    id: 'ex_2_2', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ do you live?" (Onde você mora?)',
    opcoes: ['Where', 'When', 'Who', 'Why'],
    resposta: 'Where',
  },
  {
    id: 'ex_2_3', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ is your birthday?" (Quando é seu aniversário?)',
    opcoes: ['When', 'Where', 'Who', 'What'],
    resposta: 'When',
  },
  {
    id: 'ex_2_4', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione a pergunta-W com seu significado:',
    pares: [
      { esquerda: 'What', direita: 'O quê / Qual' },
      { esquerda: 'Where', direita: 'Onde' },
      { esquerda: 'When', direita: 'Quando' },
      { esquerda: 'Who', direita: 'Quem' },
    ],
  },

  // === Level 3 — Why, Which, How ===
  {
    id: 'ex_3_1', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ are you sad?" (Por que você está triste?)',
    opcoes: ['Why', 'When', 'Where', 'How'],
    resposta: 'Why',
  },
  {
    id: 'ex_3_2', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ color do you prefer, red or blue?" (Qual cor você prefere?)',
    opcoes: ['Which', 'What', 'Who', 'How'],
    resposta: 'Which',
  },
  {
    id: 'ex_3_3', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ are you?" (Como você está?)',
    opcoes: ['How', 'What', 'Who', 'Which'],
    resposta: 'How',
  },
  {
    id: 'ex_3_4', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: '"Which" é usado quando há uma escolha entre opções específicas.',
    resposta: 'verdadeiro',
  },

  // === Level 4 — How + variations ===
  {
    id: 'ex_4_1', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual "How" usamos para falar sobre QUANTIDADE de coisas CONTÁVEIS? (Ex: ___ students?)',
    opcoes: ['How many', 'How much', 'How often', 'How long'],
    resposta: 'How many',
  },
  {
    id: 'ex_4_2', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual "How" usamos para falar sobre QUANTIDADE de coisas INCONTÁVEIS? (Ex: ___ water?)',
    opcoes: ['How much', 'How many', 'How often', 'How long'],
    resposta: 'How much',
  },
  {
    id: 'ex_4_3', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: '"___ do you go to the gym?" significa "Com que frequência você vai à academia?"',
    opcoes: ['How often', 'How many', 'How much', 'How long'],
    resposta: 'How often',
  },

  // === Level 5 — All W's and How's ===
  {
    id: 'ex_5_1', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 5, tipo: 'ligar',
    enunciado: 'Relacione a pergunta com o "W" ou "How" correto:',
    pares: [
      { esquerda: '_____ books do you have?', direita: 'How many' },
      { esquerda: '_____ is she crying?', direita: 'Why' },
      { esquerda: '_____ is your teacher?', direita: 'Who' },
      { esquerda: '_____ do you brush your teeth?', direita: 'How often' },
    ],
  },
  {
    id: 'ex_5_2', unidade: 'Conteúdo Extra', categoria: 'time_place', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Para perguntar "Quanto custa?" em inglês, usamos:',
    opcoes: ['How much', 'How many', 'What price', 'Which cost'],
    resposta: 'How much',
  },
];
