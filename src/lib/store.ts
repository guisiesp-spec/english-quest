/**
 * Unified async store adapter.
 * LOCAL (dev / no Supabase): uses in-memory GameStore (global singleton).
 * ONLINE (Vercel + Supabase): reads/writes Supabase tables.
 */
import type { Sala, Grupo } from './tipos';

function isOnline(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !!url && !url.includes('placeholder');
}

function sb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// ── Read ─────────────────────────────────────────────────────────────────────

export async function storeSnapshot(
  codigo: string,
): Promise<{ sala: Sala; grupos: Grupo[] } | null> {
  const upper = codigo.toUpperCase();
  if (!isOnline()) {
    const { gameStore } = await import('./gameStore');
    return gameStore.snapshot(upper) ?? null;
  }
  const { data: sala } = await sb().from('salas').select('*').eq('codigo', upper).single();
  if (!sala) return null;
  const { data: grupos } = await sb()
    .from('grupos').select('*').eq('sala_id', sala.id).order('criado_em');
  return { sala: sala as Sala, grupos: (grupos ?? []) as Grupo[] };
}

// ── Write sala ────────────────────────────────────────────────────────────────

export async function storeSalaSave(sala: Sala): Promise<void> {
  if (!isOnline()) {
    const { gameStore } = await import('./gameStore');
    gameStore.setSala(sala);
    return;
  }
  await sb().from('salas').upsert(sala);
}

// ── Write grupo ───────────────────────────────────────────────────────────────

export async function storeGrupoAdd(grupo: Grupo): Promise<void> {
  if (!isOnline()) {
    const { gameStore } = await import('./gameStore');
    gameStore.addGrupo(grupo);
    return;
  }
  await sb().from('grupos').insert(grupo);
}

export async function storeGrupoUpdate(
  grupoId: string,
  updates: Partial<Grupo>,
): Promise<void> {
  if (!isOnline()) {
    const { gameStore } = await import('./gameStore');
    gameStore.updateGrupo(grupoId, updates);
    return;
  }
  await sb().from('grupos').update(updates).eq('id', grupoId);
}

export async function storeGrupoRemove(grupoId: string): Promise<void> {
  if (!isOnline()) {
    const { gameStore } = await import('./gameStore');
    gameStore.removeGrupo(grupoId);
    return;
  }
  await sb().from('grupos').delete().eq('id', grupoId);
}
