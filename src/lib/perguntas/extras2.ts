import type { Pergunta } from '../tipos';

export const perguntasExtras2: Pergunta[] = [

  // ==================== GRAMMAR ====================

  // Level 1 — Articles
  {
    id: 'e2_gr_1_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "I have ___ apple."',
    opcoes: ['an', 'a', 'the', '—'],
    resposta: 'an',
  },
  {
    id: 'e2_gr_1_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She is ___ teacher."',
    opcoes: ['a', 'an', 'the', '—'],
    resposta: 'a',
  },
  {
    id: 'e2_gr_1_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'Usamos "an" antes de palavras que começam com som de vogal.',
    resposta: 'verdadeiro',
    explicacao: 'Ex: an apple, an umbrella, an hour (o H é mudo).',
  },

  // Level 2 — Simple Present (3rd person)
  {
    id: 'e2_gr_2_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "She ___ to school every day."',
    opcoes: ['goes', 'go', 'going', 'went'],
    resposta: 'goes',
  },
  {
    id: 'e2_gr_2_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"He play football." está correto.',
    resposta: 'falso',
    explicacao: 'Na 3ª pessoa do singular, adicionamos -s: "He plays football."',
  },
  {
    id: 'e2_gr_2_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ she like pizza?"',
    opcoes: ['Does', 'Do', 'Is', 'Are'],
    resposta: 'Does',
  },
  {
    id: 'e2_gr_2_4', unidade: 'Extra 2', categoria: 'grammar', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione o pronome com o auxiliar correto no Simple Present:',
    pares: [
      { esquerda: 'I / You / We', direita: 'do' },
      { esquerda: 'He / She / It', direita: 'does' },
      { esquerda: 'They', direita: 'do' },
      { esquerda: 'My brother', direita: 'does' },
    ],
  },

  // Level 3 — Present Continuous
  {
    id: 'e2_gr_3_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "They ___ watching TV right now."',
    opcoes: ['are', 'is', 'am', 'be'],
    resposta: 'are',
  },
  {
    id: 'e2_gr_3_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual frase está no Present Continuous?',
    opcoes: ['She is reading a book.', 'She reads a book.', 'She read a book.', 'She will read a book.'],
    resposta: 'She is reading a book.',
  },
  {
    id: 'e2_gr_3_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 3, tipo: 'verdadeiro_falso',
    enunciado: 'O Present Continuous é formado por: sujeito + verb TO BE + verbo com -ING.',
    resposta: 'verdadeiro',
  },

  // Level 4 — Past Simple
  {
    id: 'e2_gr_4_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual é o passado de "go"?',
    opcoes: ['went', 'goed', 'goes', 'gone'],
    resposta: 'went',
  },
  {
    id: 'e2_gr_4_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Complete: "Yesterday I ___ a great movie."',
    opcoes: ['watched', 'watch', 'watching', 'watches'],
    resposta: 'watched',
  },
  {
    id: 'e2_gr_4_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione o verbo com seu passado irregular:',
    pares: [
      { esquerda: 'eat', direita: 'ate' },
      { esquerda: 'see', direita: 'saw' },
      { esquerda: 'come', direita: 'came' },
      { esquerda: 'have', direita: 'had' },
    ],
  },

  // Level 5 — Future & Comparatives
  {
    id: 'e2_gr_5_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Complete: "This book is ___ than that one." (interessante)',
    opcoes: ['more interesting', 'interestinger', 'most interesting', 'interesting more'],
    resposta: 'more interesting',
  },
  {
    id: 'e2_gr_5_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Complete: "It ___ rain tomorrow." (vai chover)',
    opcoes: ["It's going to", 'It will to', 'It going to', 'It are going to'],
    resposta: "It's going to",
  },
  {
    id: 'e2_gr_5_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'verdadeiro_falso',
    enunciado: '"She didn\'t went to school." está gramaticalmente correto.',
    resposta: 'falso',
    explicacao: 'Com "didn\'t" o verbo principal fica no infinitivo: "She didn\'t go to school."',
  },

  // ==================== VOCABULARY ====================

  // Level 1 — Colors & School items
  {
    id: 'e2_voc_1_1', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "vermelho" em inglês?',
    opcoes: ['red', 'blue', 'green', 'yellow'],
    resposta: 'red',
  },
  {
    id: 'e2_voc_1_2', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "caderno" em inglês?',
    opcoes: ['notebook', 'bookcase', 'notepaper', 'copybook'],
    resposta: 'notebook',
  },
  {
    id: 'e2_voc_1_3', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione a cor em inglês com seu significado:',
    pares: [
      { esquerda: 'black', direita: 'preto' },
      { esquerda: 'white', direita: 'branco' },
      { esquerda: 'orange', direita: 'laranja' },
      { esquerda: 'purple', direita: 'roxo' },
    ],
  },

  // Level 2 — Family & Animals
  {
    id: 'e2_voc_2_1', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "irmã" em inglês?',
    opcoes: ['sister', 'brother', 'mother', 'aunt'],
    resposta: 'sister',
  },
  {
    id: 'e2_voc_2_2', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "cachorro" em inglês?',
    opcoes: ['dog', 'cat', 'bird', 'fish'],
    resposta: 'dog',
  },
  {
    id: 'e2_voc_2_3', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione o membro da família com seu significado:',
    pares: [
      { esquerda: 'father', direita: 'pai' },
      { esquerda: 'grandmother', direita: 'avó' },
      { esquerda: 'uncle', direita: 'tio' },
      { esquerda: 'cousin', direita: 'primo/prima' },
    ],
  },
  {
    id: 'e2_voc_2_4', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"Bird" em inglês significa "pássaro".',
    resposta: 'verdadeiro',
  },

  // Level 3 — Food, Professions & Adjectives
  {
    id: 'e2_voc_3_1', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "médico/médica" em inglês?',
    opcoes: ['doctor', 'teacher', 'engineer', 'lawyer'],
    resposta: 'doctor',
  },
  {
    id: 'e2_voc_3_2', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual é o oposto de "hot" em inglês?',
    opcoes: ['cold', 'warm', 'cool', 'freezing'],
    resposta: 'cold',
  },
  {
    id: 'e2_voc_3_3', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione o alimento com seu nome em inglês:',
    pares: [
      { esquerda: 'apple', direita: 'maçã' },
      { esquerda: 'bread', direita: 'pão' },
      { esquerda: 'rice', direita: 'arroz' },
      { esquerda: 'chicken', direita: 'frango' },
    ],
  },

  // Level 4 — Body parts & Sports
  {
    id: 'e2_voc_4_1', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "joelho" em inglês?',
    opcoes: ['knee', 'elbow', 'ankle', 'wrist'],
    resposta: 'knee',
  },
  {
    id: 'e2_voc_4_2', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual desporto usa as palavras "serve", "volley" e "match"?',
    opcoes: ['tennis', 'football', 'basketball', 'swimming'],
    resposta: 'tennis',
  },
  {
    id: 'e2_voc_4_3', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione a profissão com sua área:',
    pares: [
      { esquerda: 'pilot', direita: 'aviação' },
      { esquerda: 'chef', direita: 'culinária' },
      { esquerda: 'nurse', direita: 'saúde' },
      { esquerda: 'architect', direita: 'construção' },
    ],
  },

  // Level 5 — Advanced vocabulary
  {
    id: 'e2_voc_5_1', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'O que significa "exhausted" em inglês?',
    opcoes: ['exausto/muito cansado', 'animado', 'confuso', 'entediado'],
    resposta: 'exausto/muito cansado',
  },
  {
    id: 'e2_voc_5_2', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase expressa "concordar" em inglês?',
    opcoes: ['I agree', 'I argue', 'I ignore', 'I compare'],
    resposta: 'I agree',
  },
  {
    id: 'e2_voc_5_3', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 5, tipo: 'verdadeiro_falso',
    enunciado: '"Siblings" significa irmãos e irmãs (de forma geral).',
    resposta: 'verdadeiro',
    explicacao: '"Siblings" inclui brothers (irmãos) e sisters (irmãs) juntos.',
  },

  // ==================== TIME & PLACE ====================

  // Level 1 — Days of the week
  {
    id: 'e2_tp_1_1', unidade: 'Extra 2', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Qual dia vem depois de Monday (segunda-feira)?',
    opcoes: ['Tuesday', 'Sunday', 'Wednesday', 'Friday'],
    resposta: 'Tuesday',
  },
  {
    id: 'e2_tp_1_2', unidade: 'Extra 2', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "sábado" em inglês?',
    opcoes: ['Saturday', 'Sunday', 'Friday', 'Thursday'],
    resposta: 'Saturday',
  },
  {
    id: 'e2_tp_1_3', unidade: 'Extra 2', categoria: 'time_place', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: '"Sunday" é o domingo em inglês.',
    resposta: 'verdadeiro',
  },

  // Level 2 — Months & Seasons
  {
    id: 'e2_tp_2_1', unidade: 'Extra 2', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é o mês de dezembro em inglês?',
    opcoes: ['December', 'November', 'October', 'January'],
    resposta: 'December',
  },
  {
    id: 'e2_tp_2_2', unidade: 'Extra 2', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "inverno" em inglês?',
    opcoes: ['winter', 'summer', 'spring', 'autumn'],
    resposta: 'winter',
  },
  {
    id: 'e2_tp_2_3', unidade: 'Extra 2', categoria: 'time_place', nivel: 2, tipo: 'ligar',
    enunciado: 'Relacione os dias com seu nome em inglês:',
    pares: [
      { esquerda: 'segunda-feira', direita: 'Monday' },
      { esquerda: 'quarta-feira', direita: 'Wednesday' },
      { esquerda: 'sexta-feira', direita: 'Friday' },
      { esquerda: 'domingo', direita: 'Sunday' },
    ],
  },

  // Level 3 — Prepositions of time
  {
    id: 'e2_tp_3_1', unidade: 'Extra 2', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "My birthday is ___ July."',
    opcoes: ['in', 'on', 'at', 'by'],
    resposta: 'in',
  },
  {
    id: 'e2_tp_3_2', unidade: 'Extra 2', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "The party is ___ Friday."',
    opcoes: ['on', 'in', 'at', 'by'],
    resposta: 'on',
  },
  {
    id: 'e2_tp_3_3', unidade: 'Extra 2', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "The class starts ___ 8 o\'clock."',
    opcoes: ['at', 'in', 'on', 'by'],
    resposta: 'at',
  },
  {
    id: 'e2_tp_3_4', unidade: 'Extra 2', categoria: 'time_place', nivel: 3, tipo: 'ligar',
    enunciado: 'Relacione a preposição de tempo com quando usá-la:',
    pares: [
      { esquerda: 'in', direita: 'meses e anos' },
      { esquerda: 'on', direita: 'dias da semana' },
      { esquerda: 'at', direita: 'horas específicas' },
      { esquerda: 'in', direita: 'estações do ano' },
    ],
  },

  // Level 4 — Prepositions of place & Directions
  {
    id: 'e2_tp_4_1', unidade: 'Extra 2', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Complete: "The supermarket is ___ the school." (em frente à)',
    opcoes: ['in front of', 'behind', 'next to', 'between'],
    resposta: 'in front of',
  },
  {
    id: 'e2_tp_4_2', unidade: 'Extra 2', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Para pedir para alguém virar à esquerda, dizemos:',
    opcoes: ['Turn left', 'Turn right', 'Go straight', 'Go back'],
    resposta: 'Turn left',
  },
  {
    id: 'e2_tp_4_3', unidade: 'Extra 2', categoria: 'time_place', nivel: 4, tipo: 'verdadeiro_falso',
    enunciado: '"Between" significa entre DOIS itens ou lugares.',
    resposta: 'verdadeiro',
    explicacao: 'Para mais de dois, usamos "among".',
  },

  // Level 5 — Advanced time expressions
  {
    id: 'e2_tp_5_1', unidade: 'Extra 2', categoria: 'time_place', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual advérbio de frequência indica que algo acontece 100% das vezes?',
    opcoes: ['always', 'usually', 'sometimes', 'never'],
    resposta: 'always',
  },
  {
    id: 'e2_tp_5_2', unidade: 'Extra 2', categoria: 'time_place', nivel: 5, tipo: 'multipla_escolha',
    enunciado: '"The bank is ___ the post office and the pharmacy." (entre)',
    opcoes: ['between', 'among', 'beside', 'along'],
    resposta: 'between',
  },
  {
    id: 'e2_tp_5_3', unidade: 'Extra 2', categoria: 'time_place', nivel: 5, tipo: 'ligar',
    enunciado: 'Relacione a expressão de tempo com seu significado:',
    pares: [
      { esquerda: 'yesterday', direita: 'ontem' },
      { esquerda: 'tomorrow', direita: 'amanhã' },
      { esquerda: 'last week', direita: 'semana passada' },
      { esquerda: 'next month', direita: 'próximo mês' },
    ],
  },

  // Bonus — Grammar nivel 3
  {
    id: 'e2_gr_3_4', unidade: 'Extra 2', categoria: 'grammar', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Complete: "Can you ___ English?" (falar)',
    opcoes: ['speak', 'speaks', 'speaking', 'spoke'],
    resposta: 'speak',
  },

  // Bonus — Vocabulary nivel 3
  {
    id: 'e2_voc_3_4', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "camiseta" em inglês?',
    opcoes: ['T-shirt', 'trousers', 'jacket', 'socks'],
    resposta: 'T-shirt',
  },

  // ==================== PERGUNTAS DIFÍCEIS — mesmos temas, maior dificuldade ====================

  // Grammar nivel 4-5 — Simple Present, negação, perguntas difíceis
  {
    id: 'e2_hard_gr_4_1', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: '"They don\'t go to school on ___." Qual dia NÃO completa corretamente essa frase?',
    opcoes: ['Monday', 'Saturday', 'Sunday', 'Both Saturday and Sunday'],
    resposta: 'Monday',
  },
  {
    id: 'e2_hard_gr_4_2', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual resposta está ERRADA para "Does she speak French?"',
    opcoes: ['Yes, she does speak.', 'No, she doesn\'t.', 'Yes, she does.', 'No, she does not.'],
    resposta: 'Yes, she does speak.',
  },
  {
    id: 'e2_hard_gr_4_3', unidade: 'Extra 2', categoria: 'grammar', nivel: 4, tipo: 'ligar',
    enunciado: 'Relacione a pergunta com a resposta curta correta:',
    pares: [
      { esquerda: 'Do you like pizza?', direita: 'Yes, I do.' },
      { esquerda: 'Does he work here?', direita: 'No, he doesn\'t.' },
      { esquerda: 'Are they students?', direita: 'Yes, they are.' },
      { esquerda: 'Is she at home?', direita: 'No, she isn\'t.' },
    ],
  },

  // Grammar nivel 5 — Present Continuous vs Simple Present
  {
    id: 'e2_hard_gr_5_4', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual é o SUPERLATIVO de "good"?',
    opcoes: ['the best', 'the goodest', 'better', 'the most good'],
    resposta: 'the best',
  },
  {
    id: 'e2_hard_gr_5_5', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: '"She doesn\'t ___ any homework today." Qual verbo NÃO pode completar a frase?',
    opcoes: ['have', 'has', 'do', 'need'],
    resposta: 'has',
  },
  {
    id: 'e2_hard_gr_5_6', unidade: 'Extra 2', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual é a forma NEGATIVA de "It will rain tomorrow."?',
    opcoes: ["It won't rain tomorrow.", "It willn't rain tomorrow.", "It doesn't will rain tomorrow.", "It won't rains tomorrow."],
    resposta: "It won't rain tomorrow.",
  },

  // Vocabulary nivel 4-5 — números, letras, dias (mais difícil)
  {
    id: 'e2_hard_voc_4_4', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Como se diz o número 1.000 em inglês?',
    opcoes: ['one thousand', 'one million', 'one hundred', 'ten hundred'],
    resposta: 'one thousand',
  },
  {
    id: 'e2_hard_voc_4_5', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Qual palavra NÃO é um sentimento (feeling) em inglês?',
    opcoes: ['kitchen', 'bored', 'excited', 'scared'],
    resposta: 'kitchen',
  },
  {
    id: 'e2_hard_voc_5_4', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual frase com "can" está CORRETA?',
    opcoes: ['She can swim.', 'She cans swim.', 'She can swims.', 'She can swimming.'],
    resposta: 'She can swim.',
  },
  {
    id: 'e2_hard_voc_5_5', unidade: 'Extra 2', categoria: 'vocabulary', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Como se diz 1.500 em inglês?',
    opcoes: ['one thousand five hundred', 'fifteen hundred', 'one million five hundred', 'one hundred and five thousand'],
    resposta: 'one thousand five hundred',
  },

  // Time & Place nivel 4-5 — perguntas W mais difíceis
  {
    id: 'e2_hard_tp_4_4', unidade: 'Extra 2', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: 'Complete: "___ do you go to the gym?" — a resposta esperada é "three times a week".',
    opcoes: ['How often', 'How many', 'How much', 'How long'],
    resposta: 'How often',
  },
  {
    id: 'e2_hard_tp_4_5', unidade: 'Extra 2', categoria: 'time_place', nivel: 4, tipo: 'verdadeiro_falso',
    enunciado: '"How long does it take?" é usada para perguntar sobre a DURAÇÃO de algo.',
    resposta: 'verdadeiro',
    explicacao: 'Ex: "How long does it take to get there?" — Quanto tempo leva para chegar lá?',
  },
  {
    id: 'e2_hard_tp_5_4', unidade: 'Extra 2', categoria: 'time_place', nivel: 5, tipo: 'multipla_escolha',
    enunciado: '"___ did you last see her?" (Quando foi a última vez que você a viu?)',
    opcoes: ['When', 'Where', 'What time', 'How long'],
    resposta: 'When',
  },
  {
    id: 'e2_hard_tp_5_5', unidade: 'Extra 2', categoria: 'time_place', nivel: 5, tipo: 'ligar',
    enunciado: 'Relacione a pergunta com o tipo de resposta esperada:',
    pares: [
      { esquerda: 'How many students?', direita: 'A number (30 students)' },
      { esquerda: 'How much water?', direita: 'A quantity (2 liters)' },
      { esquerda: 'How often?', direita: 'A frequency (twice a week)' },
      { esquerda: 'How long?', direita: 'A duration (3 hours)' },
    ],
  },
];
