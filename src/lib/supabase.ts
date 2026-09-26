import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  _client = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return _client;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop: string) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

export type Database = {
  public: {
    Tables: {
      salas: {
        Row: {
          id: string;
          codigo: string;
          status: string;
          turno_grupo_id: string | null;
          fase: string;
          pergunta_atual: unknown;
          categoria_atual: string | null;
          resultado_atual: unknown;
          ordem_turnos: string[];
          indice_turno_atual: number;
          numero_grupos: number;
          criada_em: string;
        };
      };
      grupos: {
        Row: {
          id: string;
          sala_id: string;
          nome: string;
          cor: string;
          emoji: string;
          posicao: number;
          estrelas: unknown;
          ultimo_checkpoint: number;
          double_ativo: boolean;
        };
      };
      eventos: {
        Row: {
          id: string;
          sala_id: string;
          grupo_id: string | null;
          tipo: string;
          dados: unknown;
          criado_em: string;
        };
      };
    };
  };
};
