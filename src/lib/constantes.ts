import type { CasaEspecial, ConfigDado, TipoCasa } from './tipos';

export const TOTAL_CASAS = 300;

export const GRUPOS_CONFIG = [
  { nome: 'Grupo Vermelho', cor: '#ef4444', corTexto: '#ffffff', emoji: '🔴', id_slot: 0 },
  { nome: 'Grupo Azul',     cor: '#3b82f6', corTexto: '#ffffff', emoji: '🔵', id_slot: 1 },
  { nome: 'Grupo Verde',    cor: '#22c55e', corTexto: '#ffffff', emoji: '🟢', id_slot: 2 },
  { nome: 'Grupo Amarelo',  cor: '#eab308', corTexto: '#000000', emoji: '🟡', id_slot: 3 },
  { nome: 'Grupo Roxo',     cor: '#a855f7', corTexto: '#ffffff', emoji: '🟣', id_slot: 4 },
  { nome: 'Grupo Laranja',  cor: '#f97316', corTexto: '#ffffff', emoji: '🟠', id_slot: 5 },
];

// No special squares — all positions are plain numbered nodes
export const CASAS_ESPECIAIS: Record<number, CasaEspecial> = {};

export function getTipoCasa(posicao: number): TipoCasa {
  if (posicao === 0) return 'inicio';
  if (posicao >= TOTAL_CASAS) return 'fim';
  return (CASAS_ESPECIAIS[posicao]?.tipo as TipoCasa) ?? 'normal';
}

export const DADO_CONFIG: ConfigDado[] = [
  {
    categoria: 'grammar',
    emoji: '📝',
    label: 'Gramática',
    cor: '#3b82f6',
    corBg: '#eff6ff',
  },
  {
    categoria: 'vocabulary',
    emoji: '🗣️',
    label: 'Vocabulário',
    cor: '#22c55e',
    corBg: '#f0fdf4',
  },
  {
    categoria: 'time_place',
    emoji: '⏰',
    label: 'Tempo & Lugar',
    cor: '#f97316',
    corBg: '#fff7ed',
  },
  {
    categoria: 'challenge',
    emoji: '⚡',
    label: 'Desafio',
    cor: '#ef4444',
    corBg: '#fef2f2',
  },
  {
    categoria: 'wild',
    emoji: '🃏',
    label: 'Carta Curinga',
    cor: '#a855f7',
    corBg: '#faf5ff',
  },
  {
    categoria: 'mystery',
    emoji: '🎲',
    label: 'Mistério',
    cor: '#eab308',
    corBg: '#fefce8',
  },
];

export const CATEGORIAS_REAIS: Array<'grammar' | 'vocabulary' | 'time_place'> = [
  'grammar',
  'vocabulary',
  'time_place',
];

export const CHALLENGE_NIVEL_MIN = 4;
export const TIMER_MULTIPLA_ESCOLHA = 30;
export const TIMER_VF = 20;
export const TIMER_LIGAR = 45;
export const DURACAO_RESULTADO = 2000;
