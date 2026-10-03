import type { Pergunta } from '../../tipos';

export const perguntasUnidade1: Pergunta[] = [
  // === ALPHABET — Level 1 ===
  {
    id: 'u1_alph_1_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se pronuncia a letra "A" em inglês?',
    opcoes: ['ei', 'ah', 'bi', 'ai'],
    resposta: 'ei',
  },
  {
    id: 'u1_alph_1_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se pronuncia a letra "E" em inglês?',
    opcoes: ['i:', 'ei', 'bê', 'ó'],
    resposta: 'i:',
  },
  {
    id: 'u1_alph_1_3', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'A letra "B" em inglês tem o mesmo som que a letra "B" em português.',
    resposta: 'falso',
    explicacao: 'Em inglês, o "B" soa como "bi" (biiii), diferente do "bê" do português.',
  },
  {
    id: 'u1_alph_1_4', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual letra em inglês soa como a letra "I" do português?',
    opcoes: ['E', 'A', 'U', 'O'],
    resposta: 'E',
  },

  // === ALPHABET — Level 2 ===
  {
    id: 'u1_alph_2_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Como se pronuncia a letra "G" em inglês?',
    opcoes: ['dji:', 'gê', 'gui', 'jô'],
    resposta: 'dji:',
  },
  {
    id: 'u1_alph_2_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual letra em inglês tem som parecido com "ar" (como em "ar-te")?',
    opcoes: ['R', 'L', 'H', 'N'],
    resposta: 'R',
  },
  {
    id: 'u1_alph_2_3', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione a letra com seu som em inglês:',
    pares: [
      { esquerda: 'A', direita: 'ei' },
      { esquerda: 'E', direita: 'i:' },
      { esquerda: 'I', direita: 'ai' },
      { esquerda: 'O', direita: 'ou' },
    ],
  },
  {
    id: 'u1_alph_2_4', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: 'A letra "H" em inglês é pronunciada como "eitx".',
    resposta: 'verdadeiro',
  },

  // === ALPHABET — Level 3 ===
  {
    id: 'u1_alph_3_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como se soletra "CAT" em inglês? (diga as letras em inglês)',
    opcoes: ['Ci-Ei-Ti', 'Sê-A-Tê', 'Si-Ei-Ti', 'Cê-Ah-Tê'],
    resposta: 'Si-Ei-Ti',
  },
  {
    id: 'u1_alph_3_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione a letra com seu som:',
    pares: [
      { esquerda: 'W', direita: 'dâbliu' },
      { esquerda: 'Y', direita: 'uai' },
      { esquerda: 'Z', direita: 'zi:' },
      { esquerda: 'Q', direita: 'quiu' },
    ],
  },

  // === NUMBERS — Level 1 ===
  {
    id: 'u1_num_1_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz o número 3 em inglês?',
    opcoes: ['three', 'tree', 'free', 'thre'],
    resposta: 'three',
  },
  {
    id: 'u1_num_1_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz o número 10 em inglês?',
    opcoes: ['ten', 'teen', 'ton', 'tin'],
    resposta: 'ten',
  },
  {
    id: 'u1_num_1_3', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione o número com seu nome em inglês:',
    pares: [
      { esquerda: '1', direita: 'one' },
      { esquerda: '5', direita: 'five' },
      { esquerda: '8', direita: 'eight' },
      { esquerda: '12', direita: 'twelve' },
    ],
  },

  // === NUMBERS — Level 2 ===
  {
    id: 'u1_num_2_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'O número 13 em inglês usa qual terminação?',
    opcoes: ['-teen', '-ty', '-ten', '-th'],
    resposta: '-teen',
  },
  {
    id: 'u1_num_2_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'O número 80 em inglês é:',
    opcoes: ['eighty', 'eighten', 'eighthy', 'eight'],
    resposta: 'eighty',
  },
  {
    id: 'u1_num_2_3', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: 'O número 15 em inglês é escrito "fifteen" (com dois "e").',
    resposta: 'verdadeiro',
  },

  // === NUMBERS — Level 3 ===
  {
    id: 'u1_num_3_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual desses números usa terminação "-ty" (não "-teen")?',
    opcoes: ['forty', 'fourteen', 'fifteen', 'sixteen'],
    resposta: 'forty',
  },
  {
    id: 'u1_num_3_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione o algarismo com o nome em inglês:',
    pares: [
      { esquerda: '13', direita: 'thirteen' },
      { esquerda: '30', direita: 'thirty' },
      { esquerda: '40', direita: 'forty' },
      { esquerda: '14', direita: 'fourteen' },
    ],
  },

  // === NUMBERS — Level 4 ===
  {
    id: 'u1_num_4_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual é a grafia CORRETA?',
    opcoes: ['forty', 'fourty', 'forthy', 'fourti'],
    resposta: 'forty',
  },
  {
    id: 'u1_num_4_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 4, tipo: 'verdadeiro_falso',
    enunciado: '"Twelve" é o número 12 e "twenty" é o número 20.',
    resposta: 'verdadeiro',
  },

  // === Level 5 ===
  {
    id: 'u1_num_5_1', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Como se escreve o número 99 em inglês?',
    opcoes: ['ninety-nine', 'ninety-ninth', 'ninty-nine', 'nineteen-nine'],
    resposta: 'ninety-nine',
  },
  {
    id: 'u1_num_5_2', unidade: 'Unidade 1', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual número NÃO usa a terminação "-teen"?',
    opcoes: ['seventy', 'seventeen', 'thirteen', 'nineteen'],
    resposta: 'seventy',
  },
];
