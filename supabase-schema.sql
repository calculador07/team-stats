-- ============================================================
-- TEAM STATS - Supabase Schema
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- Tabela de jogadores
CREATE TABLE IF NOT EXISTS jogadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  posicao VARCHAR(50) NOT NULL,
  numero INTEGER,
  foto_url TEXT,
  gols INTEGER DEFAULT 0,
  assistencias INTEGER DEFAULT 0,
  jogos INTEGER DEFAULT 0,
  vitorias INTEGER DEFAULT 0,
  derrotas INTEGER DEFAULT 0,
  mvps INTEGER DEFAULT 0,
  overall INTEGER DEFAULT 60,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS partidas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  adversario VARCHAR(100) NOT NULL,
  placar_nos INTEGER NOT NULL DEFAULT 0,
  placar_adversario INTEGER NOT NULL DEFAULT 0,
  resultado VARCHAR(10) GENERATED ALWAYS AS (
    CASE
      WHEN placar_nos > placar_adversario THEN 'vitoria'
      WHEN placar_nos < placar_adversario THEN 'derrota'
      ELSE 'empate'
    END
  ) STORED,
  local VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de estatísticas por partida (gols/assist por jogador em cada partida)
CREATE TABLE IF NOT EXISTS estatisticas_partida (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partida_id UUID REFERENCES partidas(id) ON DELETE CASCADE,
  jogador_id UUID REFERENCES jogadores(id) ON DELETE CASCADE,
  gols INTEGER DEFAULT 0,
  assistencias INTEGER DEFAULT 0,
  mvp BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(partida_id, jogador_id)
);

-- Storage bucket para fotos de jogadores
INSERT INTO storage.buckets (id, name, public)
VALUES ('jogadores', 'jogadores', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies (ajuste conforme necessidade de auth)
ALTER TABLE jogadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estatisticas_partida ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (para desenvolvimento - ajuste para produção)
CREATE POLICY "Acesso público leitura jogadores" ON jogadores FOR SELECT USING (true);
CREATE POLICY "Acesso público inserção jogadores" ON jogadores FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público atualização jogadores" ON jogadores FOR UPDATE USING (true);
CREATE POLICY "Acesso público delete jogadores" ON jogadores FOR DELETE USING (true);

CREATE POLICY "Acesso público leitura partidas" ON partidas FOR SELECT USING (true);
CREATE POLICY "Acesso público inserção partidas" ON partidas FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público atualização partidas" ON partidas FOR UPDATE USING (true);
CREATE POLICY "Acesso público delete partidas" ON partidas FOR DELETE USING (true);

CREATE POLICY "Acesso público leitura estatisticas" ON estatisticas_partida FOR SELECT USING (true);
CREATE POLICY "Acesso público inserção estatisticas" ON estatisticas_partida FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público atualização estatisticas" ON estatisticas_partida FOR UPDATE USING (true);
CREATE POLICY "Acesso público delete estatisticas" ON estatisticas_partida FOR DELETE USING (true);

-- Policy para storage
CREATE POLICY "Acesso público storage jogadores" ON storage.objects FOR ALL USING (bucket_id = 'jogadores');

-- Função para recalcular overall automaticamente
CREATE OR REPLACE FUNCTION calcular_overall(
  p_gols INTEGER,
  p_assistencias INTEGER,
  p_vitorias INTEGER,
  p_mvps INTEGER,
  p_derrotas INTEGER,
  p_jogos INTEGER
) RETURNS INTEGER AS $$
DECLARE
  pontos INTEGER;
  overall INTEGER;
BEGIN
  pontos := (p_gols * 5) + (p_assistencias * 3) + (p_vitorias * 2) + (p_mvps * 7) - (p_derrotas * 1) + (p_jogos * 1);
  -- Normalizar entre 60 e 99
  overall := GREATEST(60, LEAST(99, 60 + FLOOR(pontos::FLOAT / GREATEST(p_jogos, 1) * 3)));
  RETURN overall;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo
INSERT INTO jogadores (nome, posicao, numero, gols, assistencias, jogos, vitorias, derrotas, mvps, overall) VALUES
('Carlos Silva', 'Atacante', 9, 12, 4, 15, 10, 3, 5, 87),
('Rafael Lima', 'Meia', 10, 7, 11, 15, 10, 3, 3, 84),
('Bruno Santos', 'Defensor', 4, 1, 2, 14, 9, 3, 1, 76),
('Diego Costa', 'Atacante', 11, 9, 5, 13, 8, 4, 2, 80),
('Marcos Oliveira', 'Goleiro', 1, 0, 0, 15, 10, 3, 2, 75)
ON CONFLICT DO NOTHING;
