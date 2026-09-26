/**
 * Game logic helpers shared by API routes and client.
 * Must NOT import supabase (server-side API routes can't use it).
 */
import type { Grupo, CategoriasDado } from './tipos';
import { TOTAL_CASAS } from './constantes';

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
  let casas = nivel + 1; // nivel 1→2, 2→3, 3→4, 4→5, 5→6
  if (doubleAtivo) casas *= 2;
  return Math.min(casas, 6); // hard cap: never more than 6
}

export function novaEstrela(estrelaAtual: number, correto: boolean, categoria: CategoriasDado): number {
  if (!['grammar','vocabulary','time_place','challenge'].includes(categoria)) return estrelaAtual;
  if (!correto) return 1;
  return Math.min(estrelaAtual + 1, 5);
}

export function calcularNovaPosicao(posicaoAtual: number, casasAvancadas: number, _ultimoCheckpoint: number): number {
  return Math.min(posicaoAtual + casasAvancadas, TOTAL_CASAS);
}
