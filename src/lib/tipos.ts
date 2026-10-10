export type CategoriasDado = 'grammar' | 'vocabulary' | 'time_place' | 'challenge' | 'wild' | 'mystery';
export type TipoMinigame = 'multipla_escolha' | 'verdadeiro_falso' | 'ligar';
export type StatusSala = 'aguardando' | 'jogando' | 'finalizado';
export type FaseJogo = 'esperando_jogadores' | 'dado' | 'minigame' | 'resultado' | 'casa_especial' | 'fim';
export type TipoCasa = 'normal' | 'checkpoint' | 'presente' | 'caveira' | 'troca' | 'duplo' | 'inicio' | 'fim';

export interface Estrelas {
  grammar: number;
  vocabulary: number;
  time_place: number;
  challenge: number;
}

export interface Grupo {
  id: string;
  sala_id: string;
  nome: string;
  cor: string;
  emoji: string;
  posicao: number;
  estrelas: Estrelas;
  ultimo_checkpoint: number;
  double_ativo: boolean;
}

export interface Sala {
  id: string;
  codigo: string;
  status: StatusSala;
  turno_grupo_id: string | null;
  fase: FaseJogo;
  pergunta_atual: Pergunta | null;
  categoria_atual: CategoriasDado | null;
  resultado_atual: ResultadoMinigame | null;
  numero_grupos: number;
  ordem_turnos: string[];
  indice_turno_atual: number;
  pausado: boolean;
  criada_em: string;
}

interface PerguntaBase {
  id: string;
  unidade: string;
  categoria: CategoriasDado;
  nivel: 1 | 2 | 3 | 4 | 5;
}

export interface PerguntaMultiplaEscolha extends PerguntaBase {
  tipo: 'multipla_escolha';
  enunciado: string;
  opcoes: string[];
  resposta: string;
}

export interface PerguntaVF extends PerguntaBase {
  tipo: 'verdadeiro_falso';
  enunciado: string;
  resposta: 'verdadeiro' | 'falso';
  explicacao?: string;
}

export interface PerguntaLigar extends PerguntaBase {
  tipo: 'ligar';
  enunciado: string;
  pares: { esquerda: string; direita: string }[];
}

export type Pergunta = PerguntaMultiplaEscolha | PerguntaVF | PerguntaLigar;

export interface ResultadoMinigame {
  correto: boolean;
  casas_avancadas: number;
  resposta_correta: string | Record<string, string>;
  resposta_dada: string | null;
  pontos_parciais?: number;
}

export interface CasaEspecial {
  tipo: TipoCasa;
  emoji: string;
  descricao: string;
}

export interface ConfigDado {
  categoria: CategoriasDado;
  label: string;
  cor: string;
  corBg: string;
}
