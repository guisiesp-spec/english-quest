import { NextRequest, NextResponse } from 'next/server';
import { storeSnapshot, storeSalaSave } from '@/lib/store';
import type { Sala } from '@/lib/tipos';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const numGrupos = Number(body.numGrupos) || 4;

  const codigo = gerarCodigo();
  const sala: Sala = {
    id: crypto.randomUUID(),
    codigo,
    status: 'aguardando',
    turno_grupo_id: null,
    fase: 'esperando_jogadores',
    pergunta_atual: null,
    categoria_atual: null,
    resultado_atual: null,
    numero_grupos: numGrupos,
    ordem_turnos: [],
    indice_turno_atual: -1,
    pausado: false,
    criada_em: new Date().toISOString(),
  };

  await storeSalaSave(sala);
  return NextResponse.json({ sala });
}

export async function GET(req: NextRequest) {
  const codigo = new URL(req.url).searchParams.get('codigo');
  if (!codigo) return NextResponse.json({ erro: 'Código obrigatório' }, { status: 400 });

  const snap = await storeSnapshot(codigo.toUpperCase());
  if (!snap) return NextResponse.json({ erro: 'Sala não encontrada' }, { status: 404 });

  return NextResponse.json(snap);
}

function gerarCodigo(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}
