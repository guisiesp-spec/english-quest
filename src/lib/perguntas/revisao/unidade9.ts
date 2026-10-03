import type { Pergunta } from '../../tipos';

export const perguntasUnidade9: Pergunta[] = [
  // === DON'T / DOESN'T — Level 1 ===
  {
    id: 'u9_neg_1_1', unidade: 'Unidade 9', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I ___ like coffee." (Eu não gosto de café.)',
    opcoes: ["don't", "doesn't", "am not", "isn't"],
    resposta: "don't",
  },
  {
    id: 'u9_neg_1_2', unidade: 'Unidade 9', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She ___ eat meat." (Ela não come carne.)',
    opcoes: ["doesn't", "don't", "isn't", "aren't"],
    resposta: "doesn't",
  },
  {
    id: 'u9_neg_1_3', unidade: 'Unidade 9', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"Don\'t" é usado com I, you, we e they.',
    resposta: 'verdadeiro',
  },

  // === DON'T / DOESN'T — Level 2 ===
  {
    id: 'u9_neg_2_1', unidade: 'Unidade 9', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "They ___ play football." (Eles não jogam futebol.)',
    opcoes: ["don't", "doesn't", "isn't", "aren't"],
    resposta: "don't",
  },
  {
    id: 'u9_neg_2_2', unidade: 'Unidade 9', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "He ___ know the answer." (Ele não sabe a resposta.)',
    opcoes: ["doesn't", "don't", "isn't", "not"],
    resposta: "doesn't",
  },
  {
    id: 'u9_neg_2_3', unidade: 'Unidade 9', categoria: 'grammar', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione o sujeito com o auxiliar negativo correto:',
    pares: [
      { esquerda: 'I', direita: "don't" },
      { esquerda: 'She', direita: "doesn't" },
      { esquerda: 'They', direita: "don't" },
      { esquerda: 'He', direita: "doesn't" },
    ],
  },

  // === DON'T / DOESN'T — Level 3 ===
  {
    id: 'u9_neg_3_1', unidade: 'Unidade 9', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: '"She doesn\'t likes pizza." está correto.',
    resposta: 'falso',
    explicacao: 'Após "doesn\'t", o verbo fica no infinitivo: "She doesn\'t like pizza."',
  },
  {
    id: 'u9_neg_3_2', unidade: 'Unidade 9', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está CORRETA?',
    opcoes: [
      "We don't understand.",
      "We doesn't understand.",
      "We don't understands.",
      "We doesn't understands.",
    ],
    resposta: "We don't understand.",
  },

  // === ANTONYMS — Level 1 ===
  {
    id: 'u9_ant_1_1', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é o oposto de "big"?',
    opcoes: ['small', 'tall', 'fast', 'old'],
    resposta: 'small',
  },
  {
    id: 'u9_ant_1_2', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual é o oposto de "good"?',
    opcoes: ['bad', 'sad', 'slow', 'poor'],
    resposta: 'bad',
  },
  {
    id: 'u9_ant_1_3', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione os opostos:',
    pares: [
      { esquerda: 'tall', direita: 'short' },
      { esquerda: 'fast', direita: 'slow' },
      { esquerda: 'clean', direita: 'dirty' },
      { esquerda: 'happy', direita: 'sad' },
    ],
  },

  // === ANTONYMS — Level 2 ===
  {
    id: 'u9_ant_2_1', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione os opostos:',
    pares: [
      { esquerda: 'cheap', direita: 'expensive' },
      { esquerda: 'easy', direita: 'hard' },
      { esquerda: 'far', direita: 'near' },
      { esquerda: 'new', direita: 'old' },
    ],
  },
  {
    id: 'u9_ant_2_2', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é o oposto de "interesting"?',
    opcoes: ['boring', 'exciting', 'funny', 'strange'],
    resposta: 'boring',
  },

  // === ANTONYMS — Level 3-4 ===
  {
    id: 'u9_ant_3_1', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é o oposto de "rich"?',
    opcoes: ['poor', 'slow', 'dirty', 'short'],
    resposta: 'poor',
  },
  {
    id: 'u9_ant_4_1', unidade: 'Unidade 9', categoria: 'vocabulary', nivel: 4, tipo: 'ligar',
    enunciado: 'Todos os opostos:',
    pares: [
      { esquerda: 'rich', direita: 'poor' },
      { esquerda: 'interesting', direita: 'boring' },
      { esquerda: 'easy', direita: 'hard' },
      { esquerda: 'new', direita: 'old' },
    ],
  },

  // === Level 5 — Mixed ===
  {
    id: 'u9_5_1', unidade: 'Unidade 9', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está COMPLETAMENTE correta?',
    opcoes: [
      "She doesn't like expensive things, but she likes cheap ones.",
      "She don't like expensive things, but she likes cheap ones.",
      "She doesn't likes expensive things, but she likes cheap ones.",
      "She doesn't like expensive things, but she like cheap ones.",
    ],
    resposta: "She doesn't like expensive things, but she likes cheap ones.",
  },
];
