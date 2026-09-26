import type { Pergunta } from '../tipos';

export const perguntasUnidade5: Pergunta[] = [
  // === HOURS — Level 1 ===
  {
    id: 'u5_h_1_1', unidade: 'Unidade 5', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "São 3 horas." em inglês?',
    opcoes: ["It's three o'clock.", "It's three hours.", "It is three.", "Is three o'clock."],
    resposta: "It's three o'clock.",
  },
  {
    id: 'u5_h_1_2', unidade: 'Unidade 5', categoria: 'time_place', nivel: 1, tipo: 'verdadeiro_falso',
    enunciado: 'Para dizer horas em inglês, sempre começamos com "It\'s".',
    resposta: 'verdadeiro',
  },
  {
    id: 'u5_h_1_3', unidade: 'Unidade 5', categoria: 'time_place', nivel: 1, tipo: 'multipla_escolha',
    enunciado: '"AM" é usado para horas:',
    opcoes: ['da manhã (meia-noite ao meio-dia)', 'da tarde e noite', 'qualquer hora', 'só para meia-noite'],
    resposta: 'da manhã (meia-noite ao meio-dia)',
  },

  // === HOURS — Level 2 ===
  {
    id: 'u5_h_2_1', unidade: 'Unidade 5', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: '"It\'s half past two." significa:',
    opcoes: ['São 2h30.', 'São 2h15.', 'São 2h45.', 'São 2 horas.'],
    resposta: 'São 2h30.',
  },
  {
    id: 'u5_h_2_2', unidade: 'Unidade 5', categoria: 'time_place', nivel: 2, tipo: 'multipla_escolha',
    enunciado: '"It\'s quarter past three." significa:',
    opcoes: ["São 3h15.", "São 3h30.", "São 3h45.", "São 3h00."],
    resposta: "São 3h15.",
  },
  {
    id: 'u5_h_2_3', unidade: 'Unidade 5', categoria: 'time_place', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: '"Quarter" significa 15 minutos (um quarto de hora).',
    resposta: 'verdadeiro',
  },

  // === HOURS — Level 3 ===
  {
    id: 'u5_h_3_1', unidade: 'Unidade 5', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: '"It\'s ten to four." significa:',
    opcoes: ["São 3h50.", "São 4h10.", "São 4h50.", "São 3h10."],
    resposta: "São 3h50.",
  },
  {
    id: 'u5_h_3_2', unidade: 'Unidade 5', categoria: 'time_place', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "São 7h45" em inglês?',
    opcoes: ["It's quarter to eight.", "It's quarter past seven.", "It's half past seven.", "It's quarter to seven."],
    resposta: "It's quarter to eight.",
  },

  // === HOURS — Level 4-5 ===
  {
    id: 'u5_h_4_1', unidade: 'Unidade 5', categoria: 'time_place', nivel: 4, tipo: 'multipla_escolha',
    enunciado: '"Past" significa que os minutos já ___; "to" significa que ___.',
    opcoes: ['passaram da hora / faltam para a próxima', 'faltam / já passaram', 'são antes / são depois', 'são AM / são PM'],
    resposta: 'passaram da hora / faltam para a próxima',
  },
  {
    id: 'u5_h_5_1', unidade: 'Unidade 5', categoria: 'time_place', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "11h55 da noite" em inglês?',
    opcoes: ["It's five to midnight.", "It's five past eleven PM.", "It's five to twelve AM.", "It's five to eleven PM."],
    resposta: "It's five to midnight.",
  },

  // === DAYS OF THE WEEK — Level 1 ===
  {
    id: 'u5_day_1_1', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "segunda-feira" em inglês?',
    opcoes: ['Monday', 'Tuesday', 'Sunday', 'Wednesday'],
    resposta: 'Monday',
  },
  {
    id: 'u5_day_1_2', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione os dias:',
    pares: [
      { esquerda: 'Sunday', direita: 'domingo' },
      { esquerda: 'Saturday', direita: 'sábado' },
      { esquerda: 'Friday', direita: 'sexta-feira' },
      { esquerda: 'Thursday', direita: 'quinta-feira' },
    ],
  },

  // === DAYS — Level 2 ===
  {
    id: 'u5_day_2_1', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual dia vem DEPOIS de Wednesday?',
    opcoes: ['Thursday', 'Tuesday', 'Friday', 'Monday'],
    resposta: 'Thursday',
  },
  {
    id: 'u5_day_2_2', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 2, tipo: 'verdadeiro_falso',
    enunciado: 'Em inglês, a semana começa no domingo (Sunday).',
    resposta: 'verdadeiro',
  },

  // === DAYS — Level 3 ===
  {
    id: 'u5_day_3_1', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 3, tipo: 'multipla_escolha',
    enunciado: 'Qual a ordem correta dos dias da semana em inglês?',
    opcoes: [
      'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
      'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      'Mon, Sun, Tue, Wed, Thu, Fri, Sat',
      'Sat, Sun, Mon, Tue, Wed, Thu, Fri',
    ],
    resposta: 'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
  },

  // === WEATHER — Level 1 ===
  {
    id: 'u5_wth_1_1', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 1, tipo: 'multipla_escolha',
    enunciado: 'Como se diz "ensolarado" em inglês?',
    opcoes: ['sunny', 'rainy', 'cloudy', 'windy'],
    resposta: 'sunny',
  },
  {
    id: 'u5_wth_1_2', unidade: 'Unidade 5', categoria: 'vocabulary', nivel: 1, tipo: 'ligar',
    enunciado: 'Relacione o clima:',
    pares: [
      { esquerda: 'rainy', direita: 'chuvoso' },
      { esquerda: 'cloudy', direita: 'nublado' },
      { esquerda: 'snowy', direita: 'com neve' },
      { esquerda: 'stormy', direita: 'com tempestade' },
    ],
  },

  // === WEATHER — Suffix -Y — Level 2-3 ===
  {
    id: 'u5_wth_2_1', unidade: 'Unidade 5', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'O sufixo "-y" transforma um substantivo em:',
    opcoes: ['adjetivo', 'verbo', 'advérbio', 'pronome'],
    resposta: 'adjetivo',
  },
  {
    id: 'u5_wth_2_2', unidade: 'Unidade 5', categoria: 'grammar', nivel: 2, tipo: 'multipla_escolha',
    enunciado: 'Qual é o adjetivo formado de "wind"?',
    opcoes: ['windy', 'winds', 'winded', 'windly'],
    resposta: 'windy',
  },
  {
    id: 'u5_wth_3_1', unidade: 'Unidade 5', categoria: 'grammar', nivel: 3, tipo: 'ligar',
    enunciado: 'Adicione o sufixo "-y" para formar adjetivos:',
    pares: [
      { esquerda: 'sun', direita: 'sunny' },
      { esquerda: 'cloud', direita: 'cloudy' },
      { esquerda: 'rain', direita: 'rainy' },
      { esquerda: 'snow', direita: 'snowy' },
    ],
  },
  {
    id: 'u5_wth_4_1', unidade: 'Unidade 5', categoria: 'grammar', nivel: 4, tipo: 'verdadeiro_falso',
    enunciado: 'Para palavras terminadas em consoante+vogal+consoante (como "sun"), dobramos a última consoante antes de adicionar "-y": sun → sunny.',
    resposta: 'verdadeiro',
  },
  {
    id: 'u5_wth_5_1', unidade: 'Unidade 5', categoria: 'grammar', nivel: 5, tipo: 'multipla_escolha',
    enunciado: 'Qual formação de adjetivo com "-y" está INCORRETA?',
    opcoes: ['foogy (fog → foggy)', 'cloudy', 'rainy', 'snowy'],
    resposta: 'foogy (fog → foggy)',
  },
];
