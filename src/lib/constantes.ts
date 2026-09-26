import type { CasaEspecial, ConfigDado, TipoCasa } from './tipos';

export const TOTAL_CASAS = 100;

export const GRUPOS_CONFIG = [
  { nome: 'Grupo Vermelho',  cor: '#ef4444', corTexto: '#ffffff', emoji: '🔴', id_slot: 0  },
  { nome: 'Grupo Azul',      cor: '#3b82f6', corTexto: '#ffffff', emoji: '🔵', id_slot: 1  },
  { nome: 'Grupo Verde',     cor: '#22c55e', corTexto: '#ffffff', emoji: '🟢', id_slot: 2  },
  { nome: 'Grupo Amarelo',   cor: '#eab308', corTexto: '#000000', emoji: '🟡', id_slot: 3  },
  { nome: 'Grupo Roxo',      cor: '#a855f7', corTexto: '#ffffff', emoji: '🟣', id_slot: 4  },
  { nome: 'Grupo Laranja',   cor: '#f97316', corTexto: '#ffffff', emoji: '🟠', id_slot: 5  },
  { nome: 'Grupo Rosa',      cor: '#ec4899', corTexto: '#ffffff', emoji: '🩷', id_slot: 6  },
  { nome: 'Grupo Ciano',     cor: '#06b6d4', corTexto: '#ffffff', emoji: '🩵', id_slot: 7  },
  { nome: 'Grupo Marrom',    cor: '#92400e', corTexto: '#ffffff', emoji: '🟤', id_slot: 8  },
  { nome: 'Grupo Cinza',     cor: '#6b7280', corTexto: '#ffffff', emoji: '⚫', id_slot: 9  },
  { nome: 'Grupo Dourado',   cor: '#d97706', corTexto: '#ffffff', emoji: '⭐', id_slot: 10 },
  { nome: 'Grupo Turquesa',  cor: '#0d9488', corTexto: '#ffffff', emoji: '💚', id_slot: 11 },
  { nome: 'Grupo Índigo',    cor: '#6366f1', corTexto: '#ffffff', emoji: '💜', id_slot: 12 },
  { nome: 'Grupo Lima',      cor: '#84cc16', corTexto: '#000000', emoji: '🟩', id_slot: 13 },
  { nome: 'Grupo Coral',     cor: '#f43f5e', corTexto: '#ffffff', emoji: '🩸', id_slot: 14 },
  { nome: 'Grupo Esmeralda', cor: '#10b981', corTexto: '#ffffff', emoji: '💎', id_slot: 15 },
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
export const TIMER_DADO = 10;
export const TIMER_MULTIPLA_ESCOLHA = 30;
export const TIMER_VF = 20;
export const TIMER_LIGAR = 45;
export const DURACAO_RESULTADO = 2000;
