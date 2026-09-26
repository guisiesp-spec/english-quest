/**
 * Game logic helpers shared by API routes and client.
 * Must NOT import supabase (server-side API routes can't use it).
 */
import type { Grupo, CategoriasDado } from './tipos';
import { TOTAL_CASAS } from './constantes';

export const GRUPOS_SLOTS = [
  { nome: 'Grupo Vermelho',   cor: '#ef4444', emoji: '🔴' },
  { nome: 'Grupo Azul',       cor: '#3b82f6', emoji: '🔵' },
  { nome: 'Grupo Verde',      cor: '#22c55e', emoji: '🟢' },
  { nome: 'Grupo Amarelo',    cor: '#eab308', emoji: '🟡' },
  { nome: 'Grupo Roxo',       cor: '#a855f7', emoji: '🟣' },
  { nome: 'Grupo Laranja',    cor: '#f97316', emoji: '🟠' },
  { nome: 'Grupo Rosa',       cor: '#ec4899', emoji: '🩷' },
  { nome: 'Grupo Ciano',      cor: '#06b6d4', emoji: '🩵' },
  { nome: 'Grupo Marrom',     cor: '#92400e', emoji: '🟤' },
  { nome: 'Grupo Cinza',      cor: '#6b7280', emoji: '⚫' },
  { nome: 'Grupo Dourado',    cor: '#d97706', emoji: '⭐' },
  { nome: 'Grupo Turquesa',   cor: '#0d9488', emoji: '💚' },
  { nome: 'Grupo Índigo',     cor: '#6366f1', emoji: '💜' },
  { nome: 'Grupo Lima',       cor: '#84cc16', emoji: '🟩' },
  { nome: 'Grupo Coral',      cor: '#f43f5e', emoji: '🩸' },
  { nome: 'Grupo Esmeralda',  cor: '#10b981', emoji: '💎' },
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
  // Challenge always rewards the max; other categories cap at 5 so challenge is always best
  const casas = categoria === 'challenge' ? 6 : Math.min(nivel + 1, 5);
  return Math.min(doubleAtivo ? casas * 2 : casas, 6);
}

export function novaEstrela(estrelaAtual: number, correto: boolean, categoria: CategoriasDado): number {
  if (!['grammar','vocabulary','time_place','challenge'].includes(categoria)) return estrelaAtual;
  if (!correto) return 1;
  return Math.min(estrelaAtual + 1, 5);
}

export function calcularNovaPosicao(posicaoAtual: number, casasAvancadas: number, _ultimoCheckpoint: number): number {
  return Math.min(posicaoAtual + casasAvancadas, TOTAL_CASAS);
}
