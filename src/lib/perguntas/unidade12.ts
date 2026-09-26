import type { Pergunta } from '../tipos';

export const perguntasUnidade12: Pergunta[] = [
  // === Level 1 ===
  {
    id: 'u12_1_1', unidade: 'Unidade 12', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: '"This" é usado para coisas:',
    opcoes: ['próximas', 'distantes', 'plurais', 'invisíveis'],
    resposta: 'próximas',
  },
  {
    id: 'u12_1_2', unidade: 'Unidade 12', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: '"That" é usado para coisas:',
    opcoes: ['distantes', 'próximas', 'singulares', 'novas'],
    resposta: 'distantes',
  },
  {
    id: 'u12_1_3', unidade: 'Unidade 12', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"This" aponta para algo perto de você.',
    resposta: 'verdadeiro',
  },

  // === Level 2 ===
  {
    id: 'u12_2_1', unidade: 'Unidade 12', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ is my pen." (Apontando para a caneta na sua mão)',
    opcoes: ['This', 'That', 'These', 'Those'],
    resposta: 'This',
  },
  {
    id: 'u12_2_2', unidade: 'Unidade 12', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "Look at ___ bird over there!" (Olhe aquele pássaro lá!)',
    opcoes: ['that', 'this', 'here', 'it'],
    resposta: 'that',
  },
  {
    id: 'u12_2_3', unidade: 'Unidade 12', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"That book on your desk is mine." usa "that" corretamente para indicar algo distante do falante.',
    resposta: 'verdadeiro',
  },

  // === Level 3 ===
  {
    id: 'u12_3_1', unidade: 'Unidade 12', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Você está ao telefone e quer se apresentar. Qual é o correto?',
    opcoes: ['"This is Maria speaking."', '"That is Maria speaking."', '"Here is Maria speaking."', '"It is Maria speaking."'],
    resposta: '"This is Maria speaking."',
  },
  {
    id: 'u12_3_2', unidade: 'Unidade 12', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual frase usa this/that CORRETAMENTE?',
    opcoes: [
      '"This house here is old, but that house over there is new."',
      '"That house here is old, but this house over there is new."',
      '"This house here is old, but this house over there is new."',
      '"That house here is old, but that house over there is new."',
    ],
    resposta: '"This house here is old, but that house over there is new."',
  },

  // === Level 4-5 ===
  {
    id: 'u12_4_1', unidade: 'Unidade 12', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Escolha this ou that para cada situação:',
    pares: [
      { esquerda: 'Objeto na sua mão', direita: 'this' },
      { esquerda: 'Objeto do outro lado da sala', direita: 'that' },
      { esquerda: 'Se apresentar ao telefone', direita: 'this' },
      { esquerda: 'Apontar algo ao longe', direita: 'that' },
    ],
  },
  {
    id: 'u12_5_1', unidade: 'Unidade 12', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: '"___ is amazing!" — você está assistindo a um show de longe.',
    opcoes: ['That', 'This', 'Here', 'It'],
    resposta: 'That',
  },
];
