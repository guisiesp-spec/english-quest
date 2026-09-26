import type { Pergunta } from '../tipos';

export const perguntasUnidade6: Pergunta[] = [
  // === Level 1 ===
  {
    id: 'u6_1_1', unidade: 'Unidade 6', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I am ___ school." (Eu estou na escola.)',
    opcoes: ['at', 'in', 'on', 'by'],
    resposta: 'at',
  },
  {
    id: 'u6_1_2', unidade: 'Unidade 6', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She is ___ home." (Ela está em casa.)',
    opcoes: ['at', 'in', 'on', 'to'],
    resposta: 'at',
  },
  {
    id: 'u6_1_3', unidade: 'Unidade 6', categoria: 'grammar', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione a preposição com seu uso típico:',
    pares: [
      { esquerda: 'at', direita: 'lugar específico (escola, casa, trabalho)' },
      { esquerda: 'from', direita: 'origem (de onde vem)' },
      { esquerda: 'to', direita: 'destino (para onde vai)' },
      { esquerda: 'with', direita: 'companhia (junto com)' },
    ],
  },

  // === Level 2 ===
  {
    id: 'u6_2_1', unidade: 'Unidade 6', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She comes ___ Brazil." (Ela é do Brasil.)',
    opcoes: ['from', 'to', 'at', 'by'],
    resposta: 'from',
  },
  {
    id: 'u6_2_2', unidade: 'Unidade 6', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I go ___ school every day." (Eu vou para a escola todo dia.)',
    opcoes: ['to', 'at', 'from', 'by'],
    resposta: 'to',
  },
  {
    id: 'u6_2_3', unidade: 'Unidade 6', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"I am at home." e "I am to home." têm o mesmo significado.',
    resposta: 'falso',
    explicacao: '"at home" = estar em casa. "to home" não é correto nesse contexto.',
  },

  // === Level 3 ===
  {
    id: 'u6_3_1', unidade: 'Unidade 6', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I go to school ___ bus." (Eu vou de ônibus para a escola.)',
    opcoes: ['by', 'with', 'at', 'from'],
    resposta: 'by',
  },
  {
    id: 'u6_3_2', unidade: 'Unidade 6', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She came ___ her brother." (Ela veio com o irmão dela.)',
    opcoes: ['with', 'by', 'from', 'off'],
    resposta: 'with',
  },
  {
    id: 'u6_3_3', unidade: 'Unidade 6', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: '"Take your hands ___ the table!" significa:',
    opcoes: ['Tire as mãos da mesa!', 'Coloque as mãos na mesa!', 'Lave as mãos!', 'Bata na mesa!'],
    resposta: 'Tire as mãos da mesa!',
  },

  // === Level 4 ===
  {
    id: 'u6_4_1', unidade: 'Unidade 6', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione a preposição com o exemplo:',
    pares: [
      { esquerda: 'by', direita: 'by car, by train' },
      { esquerda: 'off', direita: 'hands off! / day off' },
      { esquerda: 'with', direita: 'coffee with milk' },
      { esquerda: 'from', direita: 'from Monday to Friday' },
    ],
  },
  {
    id: 'u6_4_2', unidade: 'Unidade 6', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual preposição completa: "The store is open ___ Monday ___ Friday."?',
    opcoes: ['from / to', 'at / at', 'by / by', 'with / with'],
    resposta: 'from / to',
  },

  // === Level 5 ===
  {
    id: 'u6_5_1', unidade: 'Unidade 6', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa preposições CORRETAMENTE?',
    opcoes: [
      'She goes to school by bus from Monday to Friday.',
      'She goes at school with bus from Monday at Friday.',
      'She goes to school at bus by Monday to Friday.',
      'She goes by school with bus from Monday with Friday.',
    ],
    resposta: 'She goes to school by bus from Monday to Friday.',
  },
];
