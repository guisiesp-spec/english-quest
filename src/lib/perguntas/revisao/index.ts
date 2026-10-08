/**
 * Modalidade: Revisão
 * Banco de perguntas para revisão geral — Unidades 1-14 + Extras.
 * Conteúdo: alfabeto, números, TO BE, família, sentimentos, horas,
 * preposições de lugar, can/can't, Present Continuous, Simple Present,
 * don't/doesn't, comparativos, this/that/these/those, will, artigo the,
 * questões W (where/when/who/what/why/how).
 */
import type { Pergunta } from '../../tipos';

import { perguntasUnidade1 } from './unidade1';
import { perguntasUnidade2 } from './unidade2';
import { perguntasUnidade3 } from './unidade3';
import { perguntasExtras } from './extras';
import { perguntasUnidade4 } from './unidade4';
import { perguntasUnidade5 } from './unidade5';
import { perguntasUnidade6 } from './unidade6';
import { perguntasUnidade7 } from './unidade7';
import { perguntasUnidade8 } from './unidade8';
import { perguntasUnidade9 } from './unidade9';
import { perguntasUnidade10 } from './unidade10';
import { perguntasUnidade12 } from './unidade12';
import { perguntasUnidade13 } from './unidade13';
import { perguntasUnidade14 } from './unidade14';
import { perguntasExtras2 } from './extras2';
import { perguntasUnidade15 } from './unidade15';

export const perguntasRevisao: Pergunta[] = [
  ...perguntasUnidade1,
  ...perguntasUnidade2,
  ...perguntasUnidade3,
  ...perguntasExtras,
  ...perguntasExtras2,
  ...perguntasUnidade4,
  ...perguntasUnidade5,
  ...perguntasUnidade6,
  ...perguntasUnidade7,
  ...perguntasUnidade8,
  ...perguntasUnidade9,
  ...perguntasUnidade10,
  ...perguntasUnidade12,
  ...perguntasUnidade13,
  ...perguntasUnidade14,
  ...perguntasUnidade15,
];

export {
  perguntasUnidade1,
  perguntasUnidade2,
  perguntasUnidade3,
  perguntasExtras,
  perguntasExtras2,
  perguntasUnidade4,
  perguntasUnidade5,
  perguntasUnidade6,
  perguntasUnidade7,
  perguntasUnidade8,
  perguntasUnidade9,
  perguntasUnidade10,
  perguntasUnidade12,
  perguntasUnidade13,
  perguntasUnidade14,
  perguntasUnidade15,
};
