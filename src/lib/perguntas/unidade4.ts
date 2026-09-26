import type { Pergunta } from '../tipos';

export const perguntasUnidade4: Pergunta[] = [
  // === FEELINGS — Level 1 ===
  {
    id: 'u4_feel_1_1', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "feliz" em inglês?',
    opcoes: ['happy', 'sad', 'angry', 'tired'],
    resposta: 'happy',
  },
  {
    id: 'u4_feel_1_2', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "triste" em inglês?',
    opcoes: ['sad', 'happy', 'shy', 'bored'],
    resposta: 'sad',
  },
  {
    id: 'u4_feel_1_3', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione o sentimento com sua tradução:',
    pares: [
      { esquerda: 'angry', direita: 'com raiva' },
      { esquerda: 'tired', direita: 'cansado(a)' },
      { esquerda: 'surprised', direita: 'surpreso(a)' },
      { esquerda: 'nervous', direita: 'nervoso(a)' },
    ],
  },

  // === FEELINGS — Level 2 ===
  {
    id: 'u4_feel_2_1', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual sentimento descreve alguém que não quer fazer nada e está entediado?',
    opcoes: ['bored', 'sleepy', 'disappointed', 'relaxed'],
    resposta: 'bored',
  },
  {
    id: 'u4_feel_2_2', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual sentimento descreve alguém que recebeu uma má notícia?',
    opcoes: ['disappointed', 'afraid', 'shy', 'relaxed'],
    resposta: 'disappointed',
  },
  {
    id: 'u4_feel_2_3', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"Sleepy" significa assustado/com medo.',
    resposta: 'falso',
    explicacao: '"Sleepy" significa com sono. "Afraid" significa com medo.',
  },

  // === FEELINGS — Level 3 ===
  {
    id: 'u4_feel_3_1', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She is ___ of spiders." (Ela tem medo de aranhas.)',
    opcoes: ['afraid', 'shy', 'bored', 'sleepy'],
    resposta: 'afraid',
  },
  {
    id: 'u4_feel_3_2', unidade: 'Unidade 4', categoria: 'vocabulary', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione os sentimentos com suas traduções:',
    pares: [
      { esquerda: 'shy', direita: 'tímido(a)' },
      { esquerda: 'relaxed', direita: 'relaxado(a)' },
      { esquerda: 'afraid', direita: 'com medo' },
      { esquerda: 'disappointed', direita: 'decepcionado(a)' },
    ],
  },

  // === POSSESSIVE ADJECTIVES — Level 1 ===
  {
    id: 'u4_posadj_1_1', unidade: 'Unidade 4', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ name is John." (O nome dele é John.)',
    opcoes: ['His', 'Her', 'My', 'Their'],
    resposta: 'His',
  },
  {
    id: 'u4_posadj_1_2', unidade: 'Unidade 4', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ name is Mary." (O nome dela é Mary.)',
    opcoes: ['Her', 'His', 'My', 'Its'],
    resposta: 'Her',
  },
  {
    id: 'u4_posadj_1_3', unidade: 'Unidade 4', categoria: 'grammar', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione o pronome com o adjetivo possessivo:',
    pares: [
      { esquerda: 'I', direita: 'my' },
      { esquerda: 'you', direita: 'your' },
      { esquerda: 'he', direita: 'his' },
      { esquerda: 'she', direita: 'her' },
    ],
  },

  // === POSSESSIVE ADJECTIVES — Level 2-3 ===
  {
    id: 'u4_posadj_2_1', unidade: 'Unidade 4', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "We love ___ country." (Nós amamos nosso país.)',
    opcoes: ['our', 'their', 'us', 'we'],
    resposta: 'our',
  },
  {
    id: 'u4_posadj_2_2', unidade: 'Unidade 4', categoria: 'grammar', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione o pronome com o adjetivo possessivo:',
    pares: [
      { esquerda: 'it', direita: 'its' },
      { esquerda: 'we', direita: 'our' },
      { esquerda: 'they', direita: 'their' },
      { esquerda: 'you (plural)', direita: 'your' },
    ],
  },
  {
    id: 'u4_posadj_3_1', unidade: 'Unidade 4', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: '"The dog hurt it\'s leg." está correto.',
    resposta: 'falso',
    explicacao: '"its" (possessivo) não tem apóstrofo. "it\'s" = "it is".',
  },

  // === POSSESSIVE PRONOUNS — Level 4 ===
  {
    id: 'u4_pospron_4_1', unidade: 'Unidade 4', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Complete: "That book is ___." (Aquele livro é meu.)',
    opcoes: ['mine', 'my', 'me', 'I'],
    resposta: 'mine',
  },
  {
    id: 'u4_pospron_4_2', unidade: 'Unidade 4', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione o adjetivo possessivo com o pronome possessivo:',
    pares: [
      { esquerda: 'my', direita: 'mine' },
      { esquerda: 'your', direita: 'yours' },
      { esquerda: 'his', direita: 'his' },
      { esquerda: 'our', direita: 'ours' },
    ],
  },

  // === Level 5 — Mixed possessives ===
  {
    id: 'u4_5_1', unidade: 'Unidade 4', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa o possessivo CORRETAMENTE?',
    opcoes: [
      "This is my book. That one is yours.",
      "This is mine book. That one is your.",
      "This is my book. That one is your.",
      "This is mine book. That one is yours.",
    ],
    resposta: "This is my book. That one is yours.",
  },
];
