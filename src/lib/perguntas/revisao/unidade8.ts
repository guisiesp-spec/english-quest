import type { Pergunta } from '../../tipos';

export const perguntasUnidade8: Pergunta[] = [
  // === Level 1 — Basic -ing ===
  {
    id: 'u8_1_1', unidade: 'Unidade 8', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "eat"?',
    opcoes: ['eating', 'eatting', 'eats', 'eateing'],
    resposta: 'eating',
  },
  {
    id: 'u8_1_2', unidade: 'Unidade 8', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "play"?',
    opcoes: ['playing', 'plaing', 'playying', 'plaiing'],
    resposta: 'playing',
  },
  {
    id: 'u8_1_3', unidade: 'Unidade 8', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'Para a maioria dos verbos, basta adicionar "-ing" no final.',
    resposta: 'verdadeiro',
  },

  // === Level 2 — Doubling consonant ===
  {
    id: 'u8_2_1', unidade: 'Unidade 8', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "run"?',
    opcoes: ['running', 'runing', 'runs', 'runeing'],
    resposta: 'running',
  },
  {
    id: 'u8_2_2', unidade: 'Unidade 8', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "swim"?',
    opcoes: ['swimming', 'swiming', 'swimeing', 'swims'],
    resposta: 'swimming',
  },
  {
    id: 'u8_2_3', unidade: 'Unidade 8', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: 'Para verbos curtos terminados em vogal+consoante (CVC), dobramos a consoante antes do "-ing": run → running.',
    resposta: 'verdadeiro',
  },

  // === Level 3 — Silent E ===
  {
    id: 'u8_3_1', unidade: 'Unidade 8', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "make"?',
    opcoes: ['making', 'makeing', 'makking', 'makinge'],
    resposta: 'making',
  },
  {
    id: 'u8_3_2', unidade: 'Unidade 8', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma "-ing" de "write"?',
    opcoes: ['writing', 'writeing', 'writting', 'writes'],
    resposta: 'writing',
  },
  {
    id: 'u8_3_3', unidade: 'Unidade 8', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: 'Para verbos terminados em "e" mudo, removemos o "e" antes de adicionar "-ing": write → writing.',
    resposta: 'verdadeiro',
  },

  // === Level 4 ===
  {
    id: 'u8_4_1', unidade: 'Unidade 8', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione o verbo com sua forma -ing correta:',
    pares: [
      { esquerda: 'sit', direita: 'sitting' },
      { esquerda: 'dance', direita: 'dancing' },
      { esquerda: 'read', direita: 'reading' },
      { esquerda: 'stop', direita: 'stopping' },
    ],
  },
  {
    id: 'u8_4_2', unidade: 'Unidade 8', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual forma "-ing" está INCORRETA?',
    opcoes: ['swiming', 'swimming', 'running', 'eating'],
    resposta: 'swiming',
  },

  // === Level 5 ===
  {
    id: 'u8_5_1', unidade: 'Unidade 8', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual conjunto de formas "-ing" está TOTALMENTE correto?',
    opcoes: [
      'sitting, dancing, swimming, writing',
      'siting, dancing, swiming, writeing',
      'sitting, danceing, swimming, writing',
      'sitting, dancing, swimmin, writing',
    ],
    resposta: 'sitting, dancing, swimming, writing',
  },
  {
    id: 'u8_5_2', unidade: 'Unidade 8', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Complete: "They are ___ a movie right now." (Eles estão assistindo um filme.)',
    opcoes: ['watching', 'watcheing', 'watcing', 'watchhing'],
    resposta: 'watching',
  },
];
