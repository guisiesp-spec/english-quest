import type { Pergunta, CategoriasDado } from '../tipos';
import { CATEGORIAS_REAIS, CHALLENGE_NIVEL_MIN } from '../constantes';
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

export const todasPerguntas: Pergunta[] = [
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
];

export function sortearPergunta(
  categoria: CategoriasDado,
  nivel: 1 | 2 | 3 | 4 | 5,
  perguntasJaFeitas: string[] = [],
): Pergunta | null {
  let categoriaEfetiva: CategoriasDado = categoria;

  if (categoria === 'mystery') {
    categoriaEfetiva = CATEGORIAS_REAIS[Math.floor(Math.random() * CATEGORIAS_REAIS.length)];
  }

  let nivelEfetivo = nivel;
  if (categoria === 'challenge') {
    nivelEfetivo = (Math.random() < 0.5 ? 4 : 5) as 4 | 5;
    categoriaEfetiva = CATEGORIAS_REAIS[Math.floor(Math.random() * CATEGORIAS_REAIS.length)];
  }

  const candidatas = todasPerguntas.filter(
    (p) =>
      p.categoria === categoriaEfetiva &&
      p.nivel === nivelEfetivo &&
      !perguntasJaFeitas.includes(p.id),
  );

  if (candidatas.length === 0) {
    // Se não houver perguntas não feitas nesse nível, usa qualquer uma do nível
    const fallback = todasPerguntas.filter(
      (p) => p.categoria === categoriaEfetiva && p.nivel === nivelEfetivo,
    );
    if (fallback.length === 0) return null;
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidatas[Math.floor(Math.random() * candidatas.length)];
}

export function sortearCategoriaAleatoria(): CategoriasDado {
  return CATEGORIAS_REAIS[Math.floor(Math.random() * CATEGORIAS_REAIS.length)];
}

export { todasPerguntas as default };
