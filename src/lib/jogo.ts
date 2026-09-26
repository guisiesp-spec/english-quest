import type { Grupo, Sala, CategoriasDado, Pergunta, ResultadoMinigame } from './tipos';
import { CASAS_ESPECIAIS, TOTAL_CASAS, DADO_CONFIG } from './constantes';
import { supabase } from './supabase';

export function proximaCategoriaAleatoriaDoGrupo(): CategoriasDado {
  const faces: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge', 'wild', 'mystery'];
  return faces[Math.floor(Math.random() * faces.length)];
}

export function getEstrelaCategoria(grupo: Grupo, categoria: CategoriasDado): 1 | 2 | 3 | 4 | 5 {
  const mapa: Record<CategoriasDado, keyof Grupo['estrelas'] | null> = {
    grammar: 'grammar',
    vocabulary: 'vocabulary',
    time_place: 'time_place',
    challenge: 'challenge',
    wild: null,
    mystery: null,
  };
  const chave = mapa[categoria];
  if (!chave) return 1;
  const val = grupo.estrelas[chave] ?? 1;
  return Math.min(Math.max(val, 1), 5) as 1 | 2 | 3 | 4 | 5;
}

export function calcularCasasAvancadas(
  nivel: 1 | 2 | 3 | 4 | 5,
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

export function novaEstrela(
  estrelaAtual: number,
  correto: boolean,
  categoria: CategoriasDado,
): number {
  if (!['grammar', 'vocabulary', 'time_place', 'challenge'].includes(categoria)) return estrelaAtual;
  if (!correto) return 1;
  return Math.min(estrelaAtual + 1, 5);
}

export function calcularNovaPosicao(posicaoAtual: number, casasAvancadas: number, ultimoCheckpoint: number): number {
  const nova = posicaoAtual + casasAvancadas;
  const clamp = Math.min(nova, TOTAL_CASAS);

  // Aplicar efeito de casas especiais
  const casaEspecial = CASAS_ESPECIAIS[clamp];
  if (!casaEspecial) return clamp;

  switch (casaEspecial.tipo) {
    case 'presente':
      return Math.min(clamp + 2, TOTAL_CASAS);
    case 'caveira':
      return Math.max(clamp - 3, ultimoCheckpoint);
    default:
      return clamp;
  }
}

export function getProximoGrupoId(sala: Sala): string | null {
  if (!sala.ordem_turnos.length) return null;
  const proximo = (sala.indice_turno_atual + 1) % sala.ordem_turnos.length;
  return sala.ordem_turnos[proximo];
}

export function getConfigDado(categoria: CategoriasDado) {
  return DADO_CONFIG.find((d) => d.categoria === categoria) ?? DADO_CONFIG[0];
}

// Supabase operations

export async function criarSala(numeroGrupos: number): Promise<{ sala: Sala | null; erro: string | null }> {
  const codigo = gerarCodigo();
  const { data, error } = await supabase
    .from('salas')
    .insert({
      codigo,
      status: 'aguardando',
      turno_grupo_id: null,
      fase: 'esperando_jogadores',
      pergunta_atual: null,
      categoria_atual: null,
      resultado_atual: null,
      numero_grupos: numeroGrupos,
      ordem_turnos: [],
      indice_turno_atual: -1,
    })
    .select()
    .single();

  if (error) return { sala: null, erro: error.message };
  return { sala: data as unknown as Sala, erro: null };
}

export async function buscarSalaPorCodigo(codigo: string): Promise<Sala | null> {
  const { data, error } = await supabase
    .from('salas')
    .select('*')
    .eq('codigo', codigo.toUpperCase())
    .single();

  if (error || !data) return null;
  return data as unknown as Sala;
}

export async function entrarNaSala(
  salaId: string,
  slot: number,
): Promise<{ grupo: Grupo | null; erro: string | null }> {
  const config = GRUPOS_SLOTS[slot % GRUPOS_SLOTS.length];
  const { data, error } = await supabase
    .from('grupos')
    .insert({
      sala_id: salaId,
      nome: config.nome,
      cor: config.cor,
      emoji: config.emoji,
      posicao: 0,
      estrelas: { grammar: 1, vocabulary: 1, time_place: 1, challenge: 1 },
      ultimo_checkpoint: 0,
      double_ativo: false,
    })
    .select()
    .single();

  if (error) return { grupo: null, erro: error.message };
  return { grupo: data as unknown as Grupo, erro: null };
}

export async function buscarGruposDaSala(salaId: string): Promise<Grupo[]> {
  const { data } = await supabase
    .from('grupos')
    .select('*')
    .eq('sala_id', salaId)
    .order('criado_em', { ascending: true });

  return (data ?? []) as unknown as Grupo[];
}

export async function atualizarPosicaoGrupo(
  grupoId: string,
  novaPosicao: number,
  novasEstrelas: Grupo['estrelas'],
  novoCheckpoint: number,
  doubleAtivo: boolean,
): Promise<void> {
  await supabase
    .from('grupos')
    .update({
      posicao: novaPosicao,
      estrelas: novasEstrelas,
      ultimo_checkpoint: novoCheckpoint,
      double_ativo: doubleAtivo,
    })
    .eq('id', grupoId);
}

export async function atualizarEstadoSala(
  salaId: string,
  updates: Partial<{
    fase: string;
    turno_grupo_id: string | null;
    pergunta_atual: Pergunta | null;
    categoria_atual: CategoriasDado | null;
    resultado_atual: ResultadoMinigame | null;
    indice_turno_atual: number;
    ordem_turnos: string[];
    status: string;
  }>,
): Promise<void> {
  await supabase.from('salas').update(updates).eq('id', salaId);
}

export async function iniciarJogo(salaId: string, grupos: Grupo[]): Promise<void> {
  const ordem = grupos.map((g) => g.id);
  await supabase.from('salas').update({
    status: 'jogando',
    fase: 'dado',
    ordem_turnos: ordem,
    indice_turno_atual: 0,
    turno_grupo_id: ordem[0],
  }).eq('id', salaId);
}

function gerarCodigo(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

const GRUPOS_SLOTS = [
  { nome: 'Grupo Vermelho', cor: '#ef4444', emoji: '🔴' },
  { nome: 'Grupo Azul',     cor: '#3b82f6', emoji: '🔵' },
  { nome: 'Grupo Verde',    cor: '#22c55e', emoji: '🟢' },
  { nome: 'Grupo Amarelo',  cor: '#eab308', emoji: '🟡' },
  { nome: 'Grupo Roxo',     cor: '#a855f7', emoji: '🟣' },
  { nome: 'Grupo Laranja',  cor: '#f97316', emoji: '🟠' },
];
