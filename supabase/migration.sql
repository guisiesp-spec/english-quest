-- English Quest — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL editor → New query)

-- ── Tables ───────────────────────────────────────────────────────────────────

create table if not exists salas (
  id            text primary key,
  codigo        text not null unique,
  status        text not null default 'aguardando',
  turno_grupo_id text,
  fase          text not null default 'esperando_jogadores',
  pergunta_atual jsonb,
  categoria_atual text,
  resultado_atual jsonb,
  ordem_turnos  jsonb not null default '[]',
  indice_turno_atual integer not null default -1,
  numero_grupos integer not null default 4,
  pausado       boolean not null default false,
  criada_em     timestamptz not null default now()
);

create table if not exists grupos (
  id                text primary key,
  sala_id           text not null references salas(id) on delete cascade,
  nome              text not null,
  cor               text not null,
  emoji             text not null,
  posicao           integer not null default 0,
  estrelas          jsonb not null default '{"grammar":1,"vocabulary":1,"time_place":1,"challenge":1}',
  ultimo_checkpoint integer not null default 0,
  double_ativo      boolean not null default false,
  criado_em         timestamptz not null default now()
);

-- ── Row-level security ────────────────────────────────────────────────────────
-- The game code itself is the access control — any client can read/write.
-- This is fine for a classroom game with random room codes.

alter table salas  enable row level security;
alter table grupos enable row level security;

create policy "public_salas"  on salas  for all using (true) with check (true);
create policy "public_grupos" on grupos for all using (true) with check (true);

-- ── Realtime ──────────────────────────────────────────────────────────────────
-- Enables the Supabase Realtime subscription used by useJogo in online mode.

alter publication supabase_realtime add table salas;
alter publication supabase_realtime add table grupos;

-- ── Auto-cleanup: delete rooms older than 24 h ───────────────────────────────
-- (optional) Run in a Supabase scheduled function or pg_cron if you want cleanup.
-- delete from salas where criada_em < now() - interval '24 hours';
