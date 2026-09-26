-- =============================================
-- English Quest — Setup do banco de dados
-- Cole esse SQL no editor do Supabase (SQL Editor)
-- =============================================

-- Tabela: salas
CREATE TABLE IF NOT EXISTS salas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'aguardando',
  turno_grupo_id UUID,
  fase TEXT DEFAULT 'esperando_jogadores',
  pergunta_atual JSONB,
  categoria_atual TEXT,
  resultado_atual JSONB,
  numero_grupos INTEGER DEFAULT 4,
  ordem_turnos UUID[] DEFAULT '{}',
  indice_turno_atual INTEGER DEFAULT -1,
  criada_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: grupos
CREATE TABLE IF NOT EXISTS grupos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sala_id UUID REFERENCES salas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  emoji TEXT NOT NULL,
  posicao INTEGER DEFAULT 0,
  estrelas JSONB DEFAULT '{"grammar":1,"vocabulary":1,"time_place":1,"challenge":1}',
  ultimo_checkpoint INTEGER DEFAULT 0,
  double_ativo BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: eventos (log opcional)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sala_id UUID REFERENCES salas(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  dados JSONB,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Políticas: acesso total para anônimos (uso em sala de aula)
CREATE POLICY "anon_all_salas"  ON salas  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_grupos" ON grupos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_eventos" ON eventos FOR ALL TO anon USING (true) WITH CHECK (true);

-- Habilitar Realtime nas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE salas;
ALTER PUBLICATION supabase_realtime ADD TABLE grupos;
ALTER PUBLICATION supabase_realtime ADD TABLE eventos;
