import type { Pergunta } from '../tipos';

export const perguntasUnidade14: Pergunta[] = [
  // === Level 1 ===
  {
    id: 'u14_1_1', unidade: 'Unidade 14', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: '"The" é o artigo:',
    opcoes: ['definido (específico)', 'indefinido (geral)', 'possessivo', 'interrogativo'],
    resposta: 'definido (específico)',
  },
  {
    id: 'u14_1_2', unidade: 'Unidade 14', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"A" e "An" são artigos indefinidos usados para mencionar algo pela PRIMEIRA vez ou de forma genérica.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u14_1_3', unidade: 'Unidade 14', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I have ___ dog." (Menção geral — não sabemos qual cachorro)',
    opcoes: ['a', 'the', 'an', 'some'],
    resposta: 'a',
  },

  // === Level 2 ===
  {
    id: 'u14_2_1', unidade: 'Unidade 14', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ sun is very hot today." (O sol é específico — existe só um)',
    opcoes: ['The', 'A', 'An', 'Some'],
    resposta: 'The',
  },
  {
    id: 'u14_2_2', unidade: 'Unidade 14', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Quando você já mencionou algo antes, na segunda vez você usa:',
    opcoes: ['the', 'a', 'an', 'one'],
    resposta: 'the',
  },
  {
    id: 'u14_2_3', unidade: 'Unidade 14', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"I saw a movie. The movie was great." — o uso de "a" e depois "the" está correto.',
    resposta: 'verdadeiro',
  },

  // === Level 3 ===
  {
    id: 'u14_3_1', unidade: 'Unidade 14', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: '"___ Moon is full tonight." — qual artigo?',
    opcoes: ['The', 'A', 'An', 'Nenhum'],
    resposta: 'The',
  },
  {
    id: 'u14_3_2', unidade: 'Unidade 14', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: '"She is ___ engineer." — qual artigo?',
    opcoes: ['an', 'a', 'the', 'Nenhum'],
    resposta: 'an',
  },

  // === Level 4 ===
  {
    id: 'u14_4_1', unidade: 'Unidade 14', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione a situação com o artigo correto:',
    pares: [
      { esquerda: 'Único no mundo (the sun, the moon)', direita: 'the' },
      { esquerda: 'Primeira menção genérica', direita: 'a/an' },
      { esquerda: 'Segunda menção (já conhecido)', direita: 'the' },
      { esquerda: 'Profissão (she is ___)', direita: 'a/an' },
    ],
  },
  {
    id: 'u14_4_2', unidade: 'Unidade 14', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa artigos CORRETAMENTE?',
    opcoes: [
      'I have a cat. The cat is black.',
      'I have the cat. A cat is black.',
      'I have a cat. A cat is black.',
      'I have the cat. The cat is black.',
    ],
    resposta: 'I have a cat. The cat is black.',
  },

  // === Level 5 ===
  {
    id: 'u14_5_1', unidade: 'Unidade 14', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa artigos INCORRETAMENTE?',
    opcoes: [
      'I am the best student in a class.',
      'I am the best student in the class.',
      'She is an honest person.',
      'The Earth is a planet.',
    ],
    resposta: 'I am the best student in a class.',
  },
];
