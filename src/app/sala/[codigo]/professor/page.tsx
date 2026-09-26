'use client';
import { use, useState, useEffect } from 'react';
import { useJogo } from '@/hooks/useJogo';
import type { Pergunta, PerguntaMultiplaEscolha, PerguntaVF, PerguntaLigar } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';
import Tabuleiro from '@/components/Tabuleiro';
import QRCode from '@/components/QRCode';
import MapaModal from '@/components/MapaModal';
import MinigameRenderer from '@/components/MinigameRenderer';

export default function ProfessorPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const { sala, grupos, carregando, erro, iniciarJogo, avancarTurno, ajustarPosicao, pausar, encerrarJogo } = useJogo(codigo);
  const [showQR, setShowQR] = useState(false);
  const [mapaAberto, setMapaAberto] = useState(false);
  const [salaURL, setSalaURL] = useState('');
  const [ip, setIp] = useState('');
  const [confirmEncerrar, setConfirmEncerrar] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    const isLocal = /localhost|127\.0\.0\.1/.test(origin) || /^http:\/\/\d+\.\d+\.\d+\.\d+/.test(origin);

    if (!isLocal) {
      // Production (Vercel) — use the actual public URL
      setSalaURL(`${origin}/sala/${codigo}`);
      fetch(`/sala/${codigo}`).catch(() => {});
      return;
    }

    // Local dev — try to get LAN IP so phones on same WiFi can connect
    fetch('/api/ip').then(r => r.json()).then(data => {
      const localIp = data.ips?.[0] ?? '';
      setIp(localIp);
      setSalaURL(localIp
        ? `http://${localIp}:3000/sala/${codigo}`
        : `http://localhost:3000/sala/${codigo}`
      );
    }).catch(() => setSalaURL(`http://localhost:3000/sala/${codigo}`));

    fetch(`/sala/${codigo}`).catch(() => {});
  }, [codigo]);

  if (carregando) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <span className="text-[#7D8590] text-sm animate-pulse">Carregando...</span>
    </div>
  );
  if (erro || !sala) return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-3 p-6">
      <p className="text-red-400 font-bold">{erro ?? 'Sala não encontrada.'}</p>
      <a href="/" className="text-sm text-[#7D8590] hover:text-white underline">← Voltar</a>
    </div>
  );

  const grupoAtual  = grupos.find(g => g.id === sala.turno_grupo_id);
  const espectadorURL = salaURL.replace(`/sala/${codigo}`, `/sala/${codigo}/espectador`);

  return (
    <>
      {mapaAberto && (
        <MapaModal grupos={grupos} grupoAtual={sala.turno_grupo_id} meuGrupoId={null} onFechar={() => setMapaAberto(false)} />
      )}

      {/* Confirmação encerrar */}
      {confirmEncerrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#161B22] border border-red-500/30 rounded-3xl p-6 w-full max-w-sm text-center flex flex-col gap-4">
            <span className="text-4xl">🏁</span>
            <h2 className="text-white font-black text-xl">Encerrar o jogo?</h2>
            <p className="text-[#7D8590] text-sm leading-relaxed">
              O jogo será finalizado agora e o ranking será exibido para todos os grupos com base nas posições atuais no tabuleiro.
            </p>
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setConfirmEncerrar(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#21262D] text-[#7D8590] hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={async () => { setConfirmEncerrar(false); await encerrarJogo(); }}
                className="flex-1 py-3 rounded-xl font-black text-sm bg-red-600 hover:bg-red-500 text-white transition-all active:scale-[.97]"
              >
                Encerrar agora
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#0D1117] pb-10">

        {/* ── HEADER ── */}
        <div className="border-b border-[#21262D]">
          <div className="px-5 pt-12 pb-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center text-2xl flex-shrink-0">
              🎓
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-black text-white text-base leading-tight">Painel do Professor</h1>
              <p className="text-[#7D8590] text-xs mt-0.5">
                Código: <span className="font-mono font-black text-amber-400 tracking-widest">{codigo}</span>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowQR(v => !v)}
                className="text-xs font-bold px-3 py-2 rounded-xl transition-all border"
                style={{
                  backgroundColor: showQR ? '#6366F122' : '#161B22',
                  borderColor: showQR ? '#6366F155' : '#30363D',
                  color: showQR ? '#818CF8' : '#7D8590',
                }}
              >
                {showQR ? '✕' : '📱'} QR
              </button>
              {espectadorURL && (
                <a href={espectadorURL} target="_blank"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-[#7D8590] hover:text-white transition-all">
                  👁 Telão
                </a>
              )}
              <button
                onClick={() => setMapaAberto(true)}
                className="text-xs font-bold px-3 py-2 rounded-xl bg-[#161B22] border border-[#30363D] text-[#7D8590] hover:text-white transition-all"
              >
                🗺 Mapa
              </button>
            </div>
          </div>
        </div>

        {/* ── QR PANEL ── */}
        {showQR && salaURL && (
          <div className="border-b border-[#21262D] bg-[#161B22] px-5 py-6 flex flex-col items-center gap-6">
            {/* Player QR */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#7D8590] text-sm font-semibold">🎮 Grupos entram aqui:</p>
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QRCode value={salaURL} size={160} />
              </div>
              <p className="font-mono text-amber-400 font-bold text-sm break-all text-center">{salaURL}</p>
            </div>

            {/* Spectator QR */}
            <div className="flex flex-col items-center gap-3 border-t border-[#30363D] pt-5 w-full">
              <p className="text-[#7D8590] text-sm font-semibold">👁 Espectadores assistem aqui:</p>
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QRCode value={`${salaURL}/espectador`} size={140} />
              </div>
              <p className="font-mono text-violet-400 font-bold text-xs break-all text-center">{salaURL}/espectador</p>
            </div>

            {ip && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-center text-sm">
                <p className="text-violet-300 text-xs">
                  📡 IP local: <strong className="text-white">{ip}</strong>
                </p>
                <p className="text-violet-400/60 text-xs mt-1">Celulares no mesmo WiFi acessam este endereço</p>
              </div>
            )}
          </div>
        )}

        <div className="px-5 py-5 max-w-xl mx-auto flex flex-col gap-4">

          {/* ── STATUS + CONTROLES ── */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-1">Status</p>
                <p className="font-black text-white text-lg leading-tight">
                  {sala.status === 'aguardando' && '⏳ Aguardando grupos'}
                  {sala.status === 'jogando' && (sala.pausado ? '⏸ Pausado' : '▶ Em jogo')}
                  {sala.status === 'finalizado' && '🏁 Finalizado'}
                </p>
                {grupoAtual && sala.status === 'jogando' && (
                  <p className="text-sm mt-1" style={{ color: grupoAtual.cor }}>
                    {grupoAtual.emoji} {grupoAtual.nome}
                    <span className="text-[#7D8590] font-normal ml-1.5 text-xs">— {sala.fase}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {sala.status === 'aguardando' && (
                  <button
                    onClick={iniciarJogo}
                    disabled={grupos.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#21262D] disabled:text-[#7D8590] text-white font-black px-5 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]"
                  >
                    ▶ Iniciar
                  </button>
                )}
                {sala.status === 'jogando' && !sala.pausado && (
                  <>
                    <button onClick={pausar}
                      className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]">
                      ⏸ Pausar
                    </button>
                    <button onClick={avancarTurno}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]">
                      ⏩ Skip
                    </button>
                    <button onClick={() => setConfirmEncerrar(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]">
                      🏁 Encerrar
                    </button>
                  </>
                )}
                {sala.status === 'jogando' && sala.pausado && (
                  <>
                    <button onClick={pausar}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]">
                      ▶ Retomar
                    </button>
                    <button onClick={() => setConfirmEncerrar(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97]">
                      🏁 Encerrar
                    </button>
                  </>
                )}
              </div>
            </div>

            {sala.status === 'aguardando' && grupos.length === 0 && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-300/80 text-sm">
                ⚠️ Nenhum grupo entrou ainda. Mostre o QR para os grupos acessarem no celular.
              </div>
            )}
          </div>

          {/* ── DADO ROLANDO ── */}
          {sala.status === 'jogando' && sala.fase === 'dado' && grupoAtual && (
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 flex items-center gap-4">
              <span className="text-3xl inline-block animate-spin" style={{ animationDuration: '1.2s' }}>🎲</span>
              <div>
                <p className="text-white font-bold text-sm">Rolando o dado</p>
                <p className="text-xs mt-0.5 font-bold" style={{ color: grupoAtual.cor }}>
                  {grupoAtual.emoji} {grupoAtual.nome}
                </p>
              </div>
            </div>
          )}

          {/* ── PERGUNTA AO VIVO ── */}
          {sala.status === 'jogando' && sala.fase === 'minigame' && sala.pergunta_atual && (() => {
            const configCat = sala.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
            return (
              <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {configCat && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border"
                      style={{ backgroundColor: configCat.corBg + '22', color: configCat.cor, borderColor: configCat.cor + '44' }}>
                      <span>{configCat.emoji}</span>
                      <span>{configCat.label}</span>
                    </div>
                  )}
                  {grupoAtual && (
                    <span className="text-xs font-bold" style={{ color: grupoAtual.cor }}>
                      {grupoAtual.emoji} {grupoAtual.nome}
                    </span>
                  )}
                </div>
                <MinigameRenderer
                  pergunta={sala.pergunta_atual as Pergunta}
                  onResponder={() => {}}
                  readonly
                />
              </div>
            );
          })()}

          {/* ── LIBERAR PRÓXIMA PERGUNTA + GABARITO PROFESSOR ── */}
          {sala.status === 'jogando' && sala.fase === 'resultado' && sala.resultado_atual && !sala.resultado_atual.correto && (
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5 flex flex-col gap-4">

              {/* Header */}
              <div className="flex items-center gap-2">
                <span className="text-xl">{sala.resultado_atual.resposta_dada === '__timeout__' ? '⏰' : '😬'}</span>
                <div>
                  <p className="text-amber-300 font-bold text-sm">
                    {sala.resultado_atual.resposta_dada === '__timeout__' ? 'Tempo esgotado' : 'Grupo errou'} — aguardando liberação
                  </p>
                  {grupoAtual && (
                    <p className="text-amber-400/60 text-xs">{grupoAtual.emoji} {grupoAtual.nome}</p>
                  )}
                </div>
              </div>

              {/* Question details for professor */}
              {sala.pergunta_atual && (() => {
                const p = sala.pergunta_atual as Pergunta;
                const dada    = sala.resultado_atual?.resposta_dada;
                const correta = sala.resultado_atual?.resposta_correta;
                const isTimeout = dada === '__timeout__' || dada === '__max_erros__';

                return (
                  <div className="bg-[#0D1117] rounded-xl p-4 flex flex-col gap-3 border border-amber-500/20">
                    <p className="text-white text-sm font-bold leading-snug">{p.enunciado}</p>

                    {p.tipo !== 'ligar' && (
                      <div className="flex flex-col gap-1.5">
                        {!isTimeout && dada && (
                          <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/30">
                            <span className="text-red-400 text-xs font-black shrink-0 mt-0.5">✗ Marcou</span>
                            <span className="text-white text-xs">{dada}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                          <span className="text-emerald-400 text-xs font-black shrink-0 mt-0.5">✓ Correto</span>
                          <span className="text-white text-xs font-bold">{String(correta)}</span>
                        </div>
                        {p.tipo === 'verdadeiro_falso' && (p as PerguntaVF).explicacao && (
                          <p className="text-blue-400 text-xs mt-1">💡 {(p as PerguntaVF).explicacao}</p>
                        )}
                      </div>
                    )}

                    {p.tipo === 'ligar' && (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-amber-400/60 text-xs font-semibold">Gabarito:</p>
                        {(p as PerguntaLigar).pares.map((par, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-[#7D8590] bg-[#21262D] px-2 py-1 rounded flex-1 text-center">{par.esquerda}</span>
                            <span className="text-emerald-400 font-bold">→</span>
                            <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded flex-1 text-center">{par.direita}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {p.tipo === 'multipla_escolha' && (
                      <div className="flex flex-col gap-1">
                        {(p as PerguntaMultiplaEscolha).opcoes.map(op => {
                          const isCerta  = op === (p as PerguntaMultiplaEscolha).resposta;
                          const isMarcou = op === dada;
                          if (!isCerta && !isMarcou) return null;
                          return (
                            <div key={op} className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                              isCerta ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/15 border border-red-500/30 text-red-300'
                            }`}>
                              <span className="font-black">{isCerta ? '✓' : '✗'}</span>
                              <span>{op}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Release button */}
              <button
                onClick={avancarTurno}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[.97] text-black font-black py-3 rounded-xl text-sm transition-all"
              >
                ✅ Liberar próxima pergunta
              </button>
            </div>
          )}

          {/* ── GRUPOS ── */}
          {grupos.length > 0 && (
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
              <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-3">
                Grupos ({grupos.length})
              </p>
              <div className="flex flex-col gap-2">
                {grupos.map(g => (
                  <div key={g.id} className="flex items-center gap-3 rounded-xl px-4 py-2.5 border"
                    style={{
                      backgroundColor: g.id === sala.turno_grupo_id ? g.cor + '11' : 'transparent',
                      borderColor: g.id === sala.turno_grupo_id ? g.cor + '44' : '#21262D',
                    }}>
                    <span className="text-xl">{g.emoji}</span>
                    <span className="font-bold flex-1 text-sm" style={{ color: g.cor }}>{g.nome}</span>
                    <span className="text-[#7D8590] text-xs">
                      Casa <strong className="text-white">{g.posicao}</strong>
                    </span>
                    <div className="flex gap-1 ml-1">
                      <button onClick={() => ajustarPosicao(g.id, -1)}
                        className="w-7 h-7 rounded-lg font-black text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all active:scale-95">
                        −
                      </button>
                      <button onClick={() => ajustarPosicao(g.id, 1)}
                        className="w-7 h-7 rounded-lg font-black text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all active:scale-95">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LINK DE ACESSO ── */}
          {salaURL && sala.status === 'aguardando' && !showQR && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-3">
              <p className="text-violet-300 text-xs font-semibold mb-1">📡 Grupos acessam pelo celular:</p>
              <p className="font-mono text-amber-400 font-bold text-sm break-all">{salaURL}</p>
            </div>
          )}

          {/* ── TABULEIRO COMPACTO ── */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-4">
            <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-3">Visão geral</p>
            <Tabuleiro grupos={grupos} grupoAtual={sala.turno_grupo_id} compact />
          </div>

        </div>
      </main>
    </>
  );
}
