import type { CasaEspecial, ConfigDado, TipoCasa } from './tipos';

export const TOTAL_CASAS = 50;

export const GRUPOS_CONFIG = [
  { nome: 'Grupo Vermelho', cor: '#ef4444', corTexto: '#ffffff', emoji: '🔴', id_slot: 0 },
  { nome: 'Grupo Azul',     cor: '#3b82f6', corTexto: '#ffffff', emoji: '🔵', id_slot: 1 },
  { nome: 'Grupo Verde',    cor: '#22c55e', corTexto: '#ffffff', emoji: '🟢', id_slot: 2 },
  { nome: 'Grupo Amarelo',  cor: '#eab308', corTexto: '#000000', emoji: '🟡', id_slot: 3 },
  { nome: 'Grupo Roxo',     cor: '#a855f7', corTexto: '#ffffff', emoji: '🟣', id_slot: 4 },
  { nome: 'Grupo Laranja',  cor: '#f97316', corTexto: '#ffffff', emoji: '🟠', id_slot: 5 },
];

export const CASAS_ESPECIAIS: Record<number, CasaEspecial> = {
  5:  { tipo: 'checkpoint', emoji: '⭐', descricao: 'Checkpoint! Você não volta abaixo daqui.' },
  8:  { tipo: 'presente',   emoji: '🎁', descricao: 'Presente! Avance +2 casas bônus.' },
  10: { tipo: 'caveira',    emoji: '💀', descricao: 'Armadilha! Volte 3 casas.' },
  12: { tipo: 'duplo',      emoji: '🎯', descricao: 'Double! Seu próximo acerto vale o dobro de casas.' },
  15: { tipo: 'checkpoint', emoji: '⭐', descricao: 'Checkpoint! Você não volta abaixo daqui.' },
  18: { tipo: 'troca',      emoji: '🔄', descricao: 'Troca! Escolha um grupo para trocar de posição.' },
  20: { tipo: 'caveira',    emoji: '💀', descricao: 'Armadilha! Volte 3 casas.' },
  22: { tipo: 'presente',   emoji: '🎁', descricao: 'Presente! Avance +2 casas bônus.' },
  25: { tipo: 'checkpoint', emoji: '⭐', descricao: 'Checkpoint! Você não volta abaixo daqui.' },
  28: { tipo: 'duplo',      emoji: '🎯', descricao: 'Double! Seu próximo acerto vale o dobro de casas.' },
  30: { tipo: 'caveira',    emoji: '💀', descricao: 'Armadilha! Volte 3 casas.' },
  32: { tipo: 'troca',      emoji: '🔄', descricao: 'Troca! Escolha um grupo para trocar de posição.' },
  35: { tipo: 'checkpoint', emoji: '⭐', descricao: 'Checkpoint! Você não volta abaixo daqui.' },
  38: { tipo: 'presente',   emoji: '🎁', descricao: 'Presente! Avance +2 casas bônus.' },
  40: { tipo: 'caveira',    emoji: '💀', descricao: 'Armadilha! Volte 3 casas.' },
  42: { tipo: 'duplo',      emoji: '🎯', descricao: 'Double!' },
  45: { tipo: 'checkpoint', emoji: '⭐', descricao: 'Checkpoint! Você não volta abaixo daqui.' },
  48: { tipo: 'troca',      emoji: '🔄', descricao: 'Troca! Escolha um grupo para trocar de posição.' },
};

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
