import type { Pergunta } from '../tipos';

export const perguntasUnidade13: Pergunta[] = [
  // === Level 1 ===
  {
    id: 'u13_1_1', unidade: 'Unidade 13', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: '"Will" é usado para falar sobre:',
    opcoes: ['o futuro', 'o passado', 'hábitos', 'habilidades'],
    resposta: 'o futuro',
  },
  {
    id: 'u13_1_2', unidade: 'Unidade 13', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I ___ call you tomorrow." (Eu vou te ligar amanhã.)',
    opcoes: ['will', 'am', 'do', 'can'],
    resposta: 'will',
  },
  {
    id: 'u13_1_3', unidade: 'Unidade 13', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"Will" é o mesmo para todos os pronomes: I will, she will, they will...',
    resposta: 'verdadeiro',
  },

  // === Level 2 ===
  {
    id: 'u13_2_1', unidade: 'Unidade 13', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma NEGATIVA de "will"?',
    opcoes: ["won't / will not", "willn't", "don't will", "will never"],
    resposta: "won't / will not",
  },
  {
    id: 'u13_2_2', unidade: 'Unidade 13', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She ___ study tonight." (Ela não vai estudar esta noite.)',
    opcoes: ["won't", "will", "doesn't will", "isn't will"],
    resposta: "won't",
  },
  {
    id: 'u13_2_3', unidade: 'Unidade 13', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"She will goes to the party." está correto.',
    resposta: 'falso',
    explicacao: 'Após "will", o verbo fica no infinitivo: "She will go to the party."',
  },

  // === Level 3 ===
  {
    id: 'u13_3_1', unidade: 'Unidade 13', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como fazer uma pergunta com "will"? Ex: "you / study tomorrow"',
    opcoes: ['Will you study tomorrow?', 'You will study tomorrow?', 'Do you will study tomorrow?', 'Will you studies tomorrow?'],
    resposta: 'Will you study tomorrow?',
  },
  {
    id: 'u13_3_2', unidade: 'Unidade 13', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'A contração de "I will" é:',
    opcoes: ["I'll", "I'd", "I'm", "I've"],
    resposta: "I'll",
  },

  // === Level 4 ===
  {
    id: 'u13_4_1', unidade: 'Unidade 13', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione o sujeito com sua contração com "will":',
    pares: [
      { esquerda: 'I', direita: "I'll" },
      { esquerda: 'He', direita: "He'll" },
      { esquerda: 'They', direita: "They'll" },
      { esquerda: 'We', direita: "We'll" },
    ],
  },
  {
    id: 'u13_4_2', unidade: 'Unidade 13', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está INCORRETA?',
    opcoes: [
      'She will to come tomorrow.',
      "She won't come tomorrow.",
      'Will she come tomorrow?',
      "She'll come tomorrow.",
    ],
    resposta: 'She will to come tomorrow.',
  },

  // === Level 5 ===
  {
    id: 'u13_5_1', unidade: 'Unidade 13', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa o futuro com "will" CORRETAMENTE?',
    opcoes: [
      "They'll travel to Europe next summer.",
      "They'll travels to Europe next summer.",
      "They will to travel to Europe next summer.",
      "They won't to travel to Europe next summer.",
    ],
    resposta: "They'll travel to Europe next summer.",
  },
];
