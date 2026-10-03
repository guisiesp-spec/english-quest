import type { Pergunta, CategoriasDado } from '../tipos';
import { CATEGORIAS_REAIS } from '../constantes';
import { perguntasRevisao } from './revisao';

export { perguntasRevisao };

export const todasPerguntas: Pergunta[] = perguntasRevisao;

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
