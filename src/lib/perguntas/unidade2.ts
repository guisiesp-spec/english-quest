import type { Pergunta } from '../tipos';

export const perguntasUnidade2: Pergunta[] = [
  // === Level 1 — I am / You are / He is ===
  {
    id: 'u2_1_1', unidade: 'Unidade 2', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I ___ a student."',
    opcoes: ['am', 'is', 'are', 'be'],
    resposta: 'am',
  },
  {
    id: 'u2_1_2', unidade: 'Unidade 2', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She ___ happy."',
    opcoes: ['is', 'am', 'are', 'be'],
    resposta: 'is',
  },
  {
    id: 'u2_1_3', unidade: 'Unidade 2', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "They ___ my friends."',
    opcoes: ['are', 'is', 'am', 'be'],
    resposta: 'are',
  },
  {
    id: 'u2_1_4', unidade: 'Unidade 2', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"I is a teacher." está correto.',
    resposta: 'falso',
    explicacao: 'Correto: "I AM a teacher."',
  },

  // === Level 2 — Full conjugation ===
  {
    id: 'u2_2_1', unidade: 'Unidade 2', categoria: 'grammar', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione o pronome com a conjugação correta do verbo TO BE:',
    pares: [
      { esquerda: 'I', direita: 'am' },
      { esquerda: 'He / She / It', direita: 'is' },
      { esquerda: 'You / We / They', direita: 'are' },
      { esquerda: 'My name', direita: 'is' },
    ],
  },
  {
    id: 'u2_2_2', unidade: 'Unidade 2', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "We ___ from Brazil."',
    opcoes: ['are', 'is', 'am', 'be'],
    resposta: 'are',
  },
  {
    id: 'u2_2_3', unidade: 'Unidade 2', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"You are" pode ser usado tanto para falar com UMA pessoa quanto com VÁRIAS.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u2_2_4', unidade: 'Unidade 2', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "It ___ cold today."',
    opcoes: ['is', 'are', 'am', 'be'],
    resposta: 'is',
  },

  // === Level 3 — Negative form ===
  {
    id: 'u2_3_1', unidade: 'Unidade 2', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma negativa de "She is tired"?',
    opcoes: ["She isn't tired", "She aren't tired", "She amn't tired", "She not tired"],
    resposta: "She isn't tired",
  },
  {
    id: 'u2_3_2', unidade: 'Unidade 2', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: '"I am not" pode ser contraído para:',
    opcoes: ["I'm not", "I amn't", "I isn't", "I aren't"],
    resposta: "I'm not",
  },
  {
    id: 'u2_3_3', unidade: 'Unidade 2', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: '"They aren\'t at home." está gramaticalmente correto.',
    resposta: 'verdadeiro',
  },

  // === Level 4 — Questions ===
  {
    id: 'u2_4_1', unidade: 'Unidade 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Como transformar "She is a doctor." em pergunta?',
    opcoes: ['Is she a doctor?', 'She is a doctor?', 'Does she a doctor?', 'Be she a doctor?'],
    resposta: 'Is she a doctor?',
  },
  {
    id: 'u2_4_2', unidade: 'Unidade 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual é a resposta curta correta para "Are you Brazilian?"',
    opcoes: ['Yes, I am.', 'Yes, I is.', 'Yes, I are.', 'Yes, me am.'],
    resposta: 'Yes, I am.',
  },

  // === Level 5 — Complex context ===
  {
    id: 'u2_5_1', unidade: 'Unidade 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está CORRETA?',
    opcoes: [
      'My parents are happy.',
      'My parents is happy.',
      'My parents am happy.',
      'My parents be happy.',
    ],
    resposta: 'My parents are happy.',
  },
  {
    id: 'u2_5_2', unidade: 'Unidade 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Complete corretamente: "John and Mary ___ not at school today."',
    opcoes: ['are', 'is', 'am', 'be'],
    resposta: 'are',
  },
];
