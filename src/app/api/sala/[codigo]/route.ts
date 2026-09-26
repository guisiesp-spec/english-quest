import { NextRequest, NextResponse } from 'next/server';
import { storeSnapshot, storeSalaSave, storeGrupoAdd, storeGrupoUpdate } from '@/lib/store';
import type { Grupo, Sala, CategoriasDado, Pergunta, ResultadoMinigame } from '@/lib/tipos';
import { sortearPergunta } from '@/lib/perguntas';
import {
  getEstrelaCategoria, novaEstrela, calcularCasasAvancadas,
  calcularNovaPosicao, GRUPOS_SLOTS,
} from '@/lib/jogoLocal';
import { CASAS_ESPECIAIS, DURACAO_RESULTADO, TOTAL_CASAS } from '@/lib/constantes';

// Keep DURACAO_RESULTADO in scope so it's not reported as unused, even though
// auto-advance is now handled client-side (setTimeout doesn't survive serverless).
void DURACAO_RESULTADO;

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
  const snap = await storeSnapshot(codigo.toUpperCase());
  if (!snap) return NextResponse.json({ erro: 'Sala não encontrada' }, { status: 404 });
  return NextResponse.json(snap);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
  const upper = codigo.toUpperCase();

  const snap = await storeSnapshot(upper);
  if (!snap) return NextResponse.json({ erro: 'Sala não encontrada' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { action, payload } = body as { action: string; payload: Record<string, unknown> };

  let sala = snap.sala;
  let grupos = snap.grupos;

  switch (action) {
    case 'ENTRAR_SALA': {
      const slot = Number(payload.slot ?? 0);
      const config = GRUPOS_SLOTS[slot % GRUPOS_SLOTS.length];
      const grupo: Grupo = {
        id: crypto.randomUUID(),
        sala_id: sala.id,
        nome: config.nome,
        cor: config.cor,
        emoji: config.emoji,
        posicao: 0,
        estrelas: { grammar: 1, vocabulary: 1, time_place: 1, challenge: 1 },
        ultimo_checkpoint: 0,
        double_ativo: false,
      };
      await storeGrupoAdd(grupo);
      grupos = [...grupos, grupo];
      return NextResponse.json({ grupo, sala, grupos });
    }

    case 'INICIAR_JOGO': {
      const ordem = [...grupos.map((g) => g.id)].sort(() => Math.random() - 0.5);
      sala = {
        ...sala,
        status: 'jogando',
        fase: 'dado',
        ordem_turnos: ordem,
        indice_turno_atual: 0,
        turno_grupo_id: ordem[0] ?? null,
      };
      await storeSalaSave(sala);
      return NextResponse.json({ sala, grupos });
    }

    case 'ROLAR_DADO': {
      const categoria = payload.categoria as CategoriasDado;
      const grupoId = payload.grupoId as string;
      const perguntasFeitas = (payload.perguntasFeitas as string[]) ?? [];

      const grupo = grupos.find((g) => g.id === grupoId);
      if (!grupo) return NextResponse.json({ erro: 'Grupo não encontrado' }, { status: 404 });

      const nivel = getEstrelaCategoria(grupo, categoria);
      const pergunta = sortearPergunta(categoria, nivel, perguntasFeitas);
      if (!pergunta) return NextResponse.json({ erro: 'Sem perguntas disponíveis' }, { status: 500 });

      sala = { ...sala, fase: 'minigame', categoria_atual: categoria, pergunta_atual: pergunta };
      await storeSalaSave(sala);
      return NextResponse.json({ sala, grupos });
    }

    case 'RESPONDER': {
      const grupoId = payload.grupoId as string;
      const resposta = (payload.resposta as string) ?? '';
      const correto = Boolean(payload.correto);

      const grupo = grupos.find((g) => g.id === grupoId);
      if (!grupo) return NextResponse.json({ erro: 'Grupo não encontrado' }, { status: 404 });

      const categoria = sala.categoria_atual ?? 'grammar';
      const estrelaAtual = getEstrelaCategoria(grupo, categoria);
      const casas = calcularCasasAvancadas(estrelaAtual as 1|2|3|4|5, categoria, correto, grupo.double_ativo);
      const novaPosicao = calcularNovaPosicao(grupo.posicao, casas, grupo.ultimo_checkpoint);

      const casaEspecial = CASAS_ESPECIAIS[novaPosicao];
      const novoCheckpoint = casaEspecial?.tipo === 'checkpoint' ? novaPosicao : grupo.ultimo_checkpoint;

      const novasEstrelas = {
        ...grupo.estrelas,
        ...((['grammar','vocabulary','time_place','challenge'] as CategoriasDado[]).includes(categoria as CategoriasDado)
          ? { [categoria]: novaEstrela(estrelaAtual, correto, categoria as CategoriasDado) }
          : {}),
      };

      const resultado: ResultadoMinigame = {
        correto,
        casas_avancadas: casas,
        resposta_correta: sala.pergunta_atual
          ? ((sala.pergunta_atual as Pergunta & { resposta?: string }).resposta ?? '')
          : '',
        resposta_dada: resposta,
      };

      const grupoAtualizado: Partial<Grupo> = {
        posicao: novaPosicao,
        estrelas: novasEstrelas,
        ultimo_checkpoint: novoCheckpoint,
        double_ativo: false,
      };
      await storeGrupoUpdate(grupoId, grupoAtualizado);
      grupos = grupos.map(g => g.id === grupoId ? { ...g, ...grupoAtualizado } : g);

      const fimDeJogo = novaPosicao >= TOTAL_CASAS;
      sala = {
        ...sala,
        fase: fimDeJogo ? 'fim' : 'resultado',
        status: fimDeJogo ? 'finalizado' : sala.status,
        resultado_atual: resultado,
      };
      await storeSalaSave(sala);
      // Auto-advance is handled client-side — setTimeout doesn't survive serverless functions.
      return NextResponse.json({ sala, grupos });
    }

    case 'AVANCAR_TURNO': {
      const proximo = (sala.indice_turno_atual + 1) % sala.ordem_turnos.length;
      sala = {
        ...sala,
        fase: 'dado',
        turno_grupo_id: sala.ordem_turnos[proximo],
        pergunta_atual: null,
        categoria_atual: null,
        resultado_atual: null,
        indice_turno_atual: proximo,
      };
      await storeSalaSave(sala);
      return NextResponse.json({ sala, grupos });
    }

    case 'AJUSTAR_POSICAO': {
      const grupoId = payload.grupoId as string;
      const delta = Number(payload.delta ?? 0);
      const grupo = grupos.find((g) => g.id === grupoId);
      if (!grupo) return NextResponse.json({ erro: 'Grupo não encontrado' }, { status: 404 });
      const novaPosicao = Math.max(0, Math.min(TOTAL_CASAS, grupo.posicao + delta));
      await storeGrupoUpdate(grupoId, { posicao: novaPosicao });
      grupos = grupos.map(g => g.id === grupoId ? { ...g, posicao: novaPosicao } : g);
      return NextResponse.json({ sala, grupos });
    }

    case 'PAUSAR': {
      sala = { ...sala, pausado: !sala.pausado };
      await storeSalaSave(sala);
      return NextResponse.json({ sala, grupos });
    }

    case 'ENCERRAR_JOGO': {
      sala = { ...sala, status: 'finalizado', fase: 'fim' };
      await storeSalaSave(sala);
      return NextResponse.json({ sala, grupos });
    }

    default:
      return NextResponse.json({ erro: `Ação desconhecida: ${action}` }, { status: 400 });
  }
}
