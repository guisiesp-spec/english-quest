import type { Pergunta } from '../../tipos';

export const perguntasUnidade3: Pergunta[] = [
  // === FAMILY — Level 1 ===
  {
    id: 'u3_fam_1_1', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "mãe" em inglês?',
    opcoes: ['mother', 'father', 'sister', 'daughter'],
    resposta: 'mother',
  },
  {
    id: 'u3_fam_1_2', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "irmão" em inglês?',
    opcoes: ['brother', 'sister', 'son', 'nephew'],
    resposta: 'brother',
  },
  {
    id: 'u3_fam_1_3', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione os membros da família:',
    pares: [
      { esquerda: 'father', direita: 'pai' },
      { esquerda: 'mother', direita: 'mãe' },
      { esquerda: 'brother', direita: 'irmão' },
      { esquerda: 'sister', direita: 'irmã' },
    ],
  },

  // === FAMILY — Level 2 ===
  {
    id: 'u3_fam_2_1', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "avô" em inglês?',
    opcoes: ['grandfather', 'grandmother', 'uncle', 'nephew'],
    resposta: 'grandfather',
  },
  {
    id: 'u3_fam_2_2', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione os parentes:',
    pares: [
      { esquerda: 'uncle', direita: 'tio' },
      { esquerda: 'aunt', direita: 'tia' },
      { esquerda: 'cousin', direita: 'primo/prima' },
      { esquerda: 'nephew', direita: 'sobrinho' },
    ],
  },

  // === FAMILY — Level 3 ===
  {
    id: 'u3_fam_3_1', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Your mother\'s father is your ___.',
    opcoes: ['grandfather', 'uncle', 'father', 'stepfather'],
    resposta: 'grandfather',
  },
  {
    id: 'u3_fam_3_2', unidade: 'Unidade 3', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Your father\'s sister is your ___.',
    opcoes: ['aunt', 'cousin', 'niece', 'grandmother'],
    resposta: 'aunt',
  },

  // === THERE IS / THERE ARE — Level 1 ===
  {
    id: 'u3_there_1_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ a cat in the garden."',
    opcoes: ['There is', 'There are', 'There am', 'It is'],
    resposta: 'There is',
  },
  {
    id: 'u3_there_1_2', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ three books on the table."',
    opcoes: ['There are', 'There is', 'There am', 'They are'],
    resposta: 'There are',
  },
  {
    id: 'u3_there_1_3', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"There is" é usado com substantivos no PLURAL.',
    resposta: 'falso',
    explicacao: '"There is" é usado com singular. "There are" é usado com plural.',
  },

  // === THERE IS / THERE ARE — Level 2 ===
  {
    id: 'u3_there_2_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ some students in the classroom."',
    opcoes: ['There are', 'There is', 'There has', 'There have'],
    resposta: 'There are',
  },
  {
    id: 'u3_there_2_2', unidade: 'Unidade 3', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma NEGATIVA de "There is a dog here."?',
    opcoes: ["There isn't a dog here.", "There aren't a dog here.", "There not is a dog here.", "There no dog here."],
    resposta: "There isn't a dog here.",
  },

  // === THERE IS / THERE ARE — Level 3 ===
  {
    id: 'u3_there_3_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ any milk in the fridge?"',
    opcoes: ['Is there', 'Are there', 'There is', 'There are'],
    resposta: 'Is there',
  },

  // === A / AN — Level 1 ===
  {
    id: 'u3_aan_1_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ apple."',
    opcoes: ['an', 'a', 'the', 'one'],
    resposta: 'an',
  },
  {
    id: 'u3_aan_1_2', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ dog."',
    opcoes: ['a', 'an', 'the', 'one'],
    resposta: 'a',
  },
  {
    id: 'u3_aan_1_3', unidade: 'Unidade 3', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'Usamos "an" antes de palavras que começam com vogal (a, e, i, o, u).',
    resposta: 'verdadeiro',
  },

  // === A / AN — Level 2 ===
  {
    id: 'u3_aan_2_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione com o artigo correto (a ou an):',
    pares: [
      { esquerda: 'elephant', direita: 'an' },
      { esquerda: 'book', direita: 'a' },
      { esquerda: 'orange', direita: 'an' },
      { esquerda: 'car', direita: 'a' },
    ],
  },
  {
    id: 'u3_aan_2_2', unidade: 'Unidade 3', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é o artigo correto para "umbrella"?',
    opcoes: ['an', 'a', 'the', 'none'],
    resposta: 'an',
  },

  // === A / AN — Level 3-4 ===
  {
    id: 'u3_aan_3_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: '"A hour" está correto porque "hour" começa com a letra H.',
    resposta: 'falso',
    explicacao: 'O H de "hour" é mudo, então soa como vogal. Correto: "AN hour".',
  },
  {
    id: 'u3_aan_4_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa o artigo CORRETO?',
    opcoes: ['She is an engineer.', 'She is a engineer.', 'She is the engineer.', 'She is one engineer.'],
    resposta: 'She is an engineer.',
  },

  // === Level 5 — Mixed ===
  {
    id: 'u3_5_1', unidade: 'Unidade 3', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está COMPLETAMENTE correta?',
    opcoes: [
      "There is an orange and a apple on the table.",
      "There is an orange and an apple on the table.",
      "There are an orange and a apple on the table.",
      "There are an orange and an apples on the table.",
    ],
    resposta: "There is an orange and an apple on the table.",
  },
];
