'use client';
/**
 * Unified real-time game hook.
 * LOCAL mode: polls /api/sala/[codigo] every 1 second.
 * ONLINE mode: subscribes to Supabase real-time.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Sala, Grupo, CategoriasDado, Pergunta, ResultadoMinigame } from '@/lib/tipos';
import { isLocal } from '@/lib/modoJogo';

export interface JogoState {
  sala: Sala | null;
  grupos: Grupo[];
  carregando: boolean;
  erro: string;
}

export interface JogoActions {
  entrarNaSala(slot: number): Promise<Grupo | null>;
  iniciarJogo(): Promise<void>;
  rolarDado(grupoId: string, categoria: CategoriasDado, perguntasFeitas: string[]): Promise<void>;
  responder(grupoId: string, resposta: string, correto: boolean): Promise<void>;
  avancarTurno(): Promise<void>;
  ajustarPosicao(grupoId: string, delta: number): Promise<void>;
  pausar(): Promise<void>;
  encerrarJogo(): Promise<void>;
}

export function useJogo(codigo: string | undefined): JogoState & JogoActions {
  const [sala, setSala] = useState<Sala | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applySnap = useCallback((data: { sala: Sala; grupos: Grupo[] }) => {
    setSala(data.sala);
    setGrupos(data.grupos);
  }, []);

  // ── Load and poll ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!codigo) return;
    const upper = codigo.toUpperCase();

    async function load() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`/api/sala/${upper}`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) { setErro('Sala não encontrada.'); setCarregando(false); return; }
        applySnap(await res.json());
        setCarregando(false);
      } catch {
        setErro('Sem conexão com o servidor. Verifique o WiFi.');
        setCarregando(false);
      }
    }

    load();

    // Polling every 1 second (works over WiFi without any external service)
    if (isLocal()) {
      pollingRef.current = setInterval(async () => {
        const res = await fetch(`/api/sala/${upper}`, { cache: 'no-store' }).catch(() => null);
        if (res?.ok) applySnap(await res.json());
      }, 1000);
    } else {
      // Supabase real-time
      startSupabaseSubscription(upper, applySnap).then((unsub) => {
        return () => unsub?.();
      });
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [codigo, applySnap]);

  // ── Actions ───────────────────────────────────────────────────────────────
  async function post(action: string, payload: Record<string, unknown> = {}) {
    if (!codigo) return null;
    const res = await fetch(`/api/sala/${codigo.toUpperCase()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.sala) applySnap(data);
    return data;
  }

  const entrarNaSala = useCallback(async (slot: number): Promise<Grupo | null> => {
    const data = await post('ENTRAR_SALA', { slot });
    return data?.grupo ?? null;
  }, [codigo]);

  const iniciarJogo = useCallback(async () => { await post('INICIAR_JOGO'); }, [codigo]);
  const rolarDado = useCallback(async (grupoId: string, categoria: CategoriasDado, perguntasFeitas: string[]) => {
    await post('ROLAR_DADO', { grupoId, categoria, perguntasFeitas });
  }, [codigo]);
  const responder = useCallback(async (grupoId: string, resposta: string, correto: boolean) => {
    await post('RESPONDER', { grupoId, resposta, correto });
  }, [codigo]);
  const avancarTurno = useCallback(async () => { await post('AVANCAR_TURNO'); }, [codigo]);
  const ajustarPosicao = useCallback(async (grupoId: string, delta: number) => {
    await post('AJUSTAR_POSICAO', { grupoId, delta });
  }, [codigo]);
  const pausar = useCallback(async () => { await post('PAUSAR'); }, [codigo]);
  const encerrarJogo = useCallback(async () => { await post('ENCERRAR_JOGO'); }, [codigo]);

  return { sala, grupos, carregando, erro, entrarNaSala, iniciarJogo, rolarDado, responder, avancarTurno, ajustarPosicao, pausar, encerrarJogo };
}

// Lazy-load Supabase to avoid import errors in local mode
async function startSupabaseSubscription(
  codigo: string,
  onUpdate: (data: { sala: Sala; grupos: Grupo[] }) => void,
): Promise<(() => void) | undefined> {
  try {
    const { supabase } = await import('@/lib/supabase');
    const salaRes = await supabase.from('salas').select('*').eq('codigo', codigo).single();
    if (!salaRes.data) return undefined;
    const salaId = (salaRes.data as Sala).id;

    onUpdate({
      sala: salaRes.data as Sala,
      grupos: ((await supabase.from('grupos').select('*').eq('sala_id', salaId).order('criado_em')).data ?? []) as Grupo[],
    });

    const channel = supabase
      .channel(`jogo-${codigo}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'salas', filter: `id=eq.${salaId}` },
        async (p) => {
          const gs = ((await supabase.from('grupos').select('*').eq('sala_id', salaId)).data ?? []) as Grupo[];
          onUpdate({ sala: p.new as Sala, grupos: gs });
        })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grupos', filter: `sala_id=eq.${salaId}` },
        async () => {
          const s = ((await supabase.from('salas').select('*').eq('id', salaId).single()).data) as Sala;
          const gs = ((await supabase.from('grupos').select('*').eq('sala_id', salaId)).data ?? []) as Grupo[];
          onUpdate({ sala: s, grupos: gs });
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  } catch {
    return undefined;
  }
}
