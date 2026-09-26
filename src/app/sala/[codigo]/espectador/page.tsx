'use client';
import { use } from 'react';
import { useJogo } from '@/hooks/useJogo';
import MinigameRenderer from '@/components/MinigameRenderer';
import MapaPath from '@/components/MapaPath';
import type { Pergunta } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

export default function EspectadorPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const { sala, grupos, carregando, erro } = useJogo(codigo);

  if (carregando) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <span className="text-[#7D8590] animate-pulse">Carregando...</span>
    </div>
  );
  if (erro || !sala) return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-3 p-6">
      <p className="text-red-400 font-bold">{erro ?? 'Sala não encontrada.'}</p>
      <a href="/" className="text-[#7D8590] underline text-sm">← Voltar</a>
    </div>
  );

  const grupoAtual    = grupos.find(g => g.id === sala.turno_grupo_id);
  const configCat     = sala.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
  const sorted        = [...grupos].sort((a, b) => b.posicao - a.posicao);
  const MEDALS        = ['🥇', '🥈', '🥉'];

  return (
    <main className="min-h-screen bg-[#0D1117] pb-12">

      {/* ── HEADER ── */}
      <div className="border-b border-[#21262D] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎮</span>
          <div>
            <h1 className="font-black text-white text-lg leading-tight">English Quest</h1>
            <p className="text-[#7D8590] text-xs">Modo telão</p>
          </div>
        </div>
        <span className="font-mono font-black text-amber-400 text-2xl tracking-[.25em]">{codigo}</span>
      </div>

      <div className="p-5 max-w-2xl mx-auto flex flex-col gap-5">

        {/* ── PLACAR ── */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
          <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-4">Placar</p>
          <div className="flex flex-col gap-3">
            {sorted.map((g, i) => (
              <div key={g.id} className="flex items-center gap-3">
                <span className="text-xl w-7 text-center flex-shrink-0">{MEDALS[i] ?? `${i+1}.`}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{g.emoji}</span>
                    <span className="font-bold text-sm truncate" style={{ color: g.cor }}>{g.nome}</span>
                    {g.id === sala.turno_grupo_id && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: g.cor + '33', color: g.cor }}
                      >
                        ▶ jogando
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-[#21262D] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(g.posicao / 50) * 100}%`, backgroundColor: g.cor }}
                    />
                  </div>
                </div>
                <span className="text-white font-bold text-sm flex-shrink-0">{g.posicao}<span className="text-[#7D8590] font-normal">/50</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ESTADO DO JOGO ── */}
        {sala.status === 'jogando' && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 flex flex-col gap-4">

            {/* Quem joga */}
            {grupoAtual && (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl border-2"
                  style={{ backgroundColor: grupoAtual.cor + '22', borderColor: grupoAtual.cor + '66' }}
                >
                  {grupoAtual.emoji}
                </div>
                <div>
                  <p className="font-black text-white">{grupoAtual.nome}</p>
                  <p className="text-[#7D8590] text-xs">está jogando</p>
                </div>
                {configCat && (
                  <span
                    className="ml-auto text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: configCat.corBg, color: configCat.cor }}
                  >
                    {configCat.emoji} {configCat.label}
                  </span>
                )}
              </div>
            )}

            {sala.fase === 'dado' && (
              <p className="text-[#7D8590] text-sm animate-pulse text-center py-2">
                ⏳ Aguardando o dado...
              </p>
            )}

            {sala.fase === 'minigame' && sala.pergunta_atual && (
              <MinigameRenderer
                pergunta={sala.pergunta_atual as Pergunta}
                onResponder={() => {}}
                readonly
              />
            )}

            {sala.fase === 'resultado' && sala.resultado_atual && (
              <div className={`rounded-2xl p-5 text-center border ${sala.resultado_atual.correto ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div className="text-5xl mb-2">{sala.resultado_atual.correto ? '🎉' : '😬'}</div>
                <h3 className={`text-2xl font-black ${sala.resultado_atual.correto ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sala.resultado_atual.correto ? 'ACERTOU!' : 'ERROU!'}
                </h3>
                <p className="text-white font-bold mt-1">
                  {sala.resultado_atual.correto
                    ? `+${sala.resultado_atual.casas_avancadas} casas 🚀`
                    : `Certo: ${String(sala.resultado_atual.resposta_correta)}`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── AGUARDANDO ── */}
        {sala.status === 'aguardando' && (
          <div className="flex flex-col items-center gap-3 py-8">
            <span className="text-4xl animate-bounce">⏳</span>
            <p className="text-[#7D8590]">Aguardando o professor iniciar o jogo...</p>
            <p className="text-[#30363D] text-sm">{grupos.length} grupo(s) na sala</p>
          </div>
        )}

        {/* ── FIM ── */}
        {sala.status === 'finalizado' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
            <span className="text-5xl">🏆</span>
            <h2 className="font-black text-white text-2xl">Fim de jogo!</h2>
            {sorted[0] && (
              <p className="font-bold" style={{ color: sorted[0].cor }}>
                {sorted[0].emoji} {sorted[0].nome} venceu!
              </p>
            )}
          </div>
        )}

        {/* ── MAPA ── */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#21262D]">
            <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest">Mapa</p>
          </div>
          <MapaPath grupos={grupos} grupoAtual={sala.turno_grupo_id} />
        </div>

      </div>
    </main>
  );
}
