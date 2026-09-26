/**
 * Game logic helpers shared by API routes and client.
 * Must NOT import supabase (server-side API routes can't use it).
 */
import type { Grupo, CategoriasDado } from './tipos';
import { CASAS_ESPECIAIS, TOTAL_CASAS } from './constantes';

export const GRUPOS_SLOTS = [
  { nome: 'Grupo Vermelho', cor: '#ef4444', emoji: '🔴' },
  { nome: 'Grupo Azul',     cor: '#3b82f6', emoji: '🔵' },
  { nome: 'Grupo Verde',    cor: '#22c55e', emoji: '🟢' },
  { nome: 'Grupo Amarelo',  cor: '#eab308', emoji: '🟡' },
  { nome: 'Grupo Roxo',     cor: '#a855f7', emoji: '🟣' },
  { nome: 'Grupo Laranja',  cor: '#f97316', emoji: '🟠' },
];

export function getEstrelaCategoria(grupo: Grupo, categoria: CategoriasDado): 1|2|3|4|5 {
  const mapa: Partial<Record<CategoriasDado, keyof Grupo['estrelas']>> = {
    grammar: 'grammar',
    vocabulary: 'vocabulary',
    time_place: 'time_place',
    challenge: 'challenge',
  };
  const chave = mapa[categoria];
  if (!chave) return 1;
  const val = grupo.estrelas[chave] ?? 1;
  return Math.min(Math.max(val, 1), 5) as 1|2|3|4|5;
}

export function calcularCasasAvancadas(
  nivel: 1|2|3|4|5,
  categoria: CategoriasDado,
  correto: boolean,
  doubleAtivo: boolean,
): number {
  if (!correto) return 0;
  let casas = nivel;
  if (categoria === 'challenge') casas = 3;
  if (doubleAtivo) casas *= 2;
  return casas;
}

export function novaEstrela(estrelaAtual: number, correto: boolean, categoria: CategoriasDado): number {
  if (!['grammar','vocabulary','time_place','challenge'].includes(categoria)) return estrelaAtual;
  if (!correto) return 1;
  return Math.min(estrelaAtual + 1, 5);
}

export function calcularNovaPosicao(posicaoAtual: number, casasAvancadas: number, ultimoCheckpoint: number): number {
  const nova = Math.min(posicaoAtual + casasAvancadas, TOTAL_CASAS);
  const casaEspecial = CASAS_ESPECIAIS[nova];
  if (!casaEspecial) return nova;
  switch (casaEspecial.tipo) {
    case 'presente': return Math.min(nova + 2, TOTAL_CASAS);
    case 'caveira':  return Math.max(nova - 3, ultimoCheckpoint);
    default:         return nova;
  }
}
