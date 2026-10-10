'use client';
import { use, useState, useEffect } from 'react';
import {
  BookOpen, MessageSquare, Clock, Zap, Shuffle, HelpCircle,
  GraduationCap, QrCode, Gamepad2, Eye, Wifi, Pause, Play,
  SkipForward, Flag, AlertTriangle, Palette, Trash2, CheckCircle,
  Lightbulb, RotateCw, Timer, X,
} from 'lucide-react';
import { useJogo } from '@/hooks/useJogo';
import type { Pergunta, PerguntaMultiplaEscolha, PerguntaVF, PerguntaLigar } from '@/lib/tipos';
import { DADO_CONFIG, GRUPOS_CONFIG } from '@/lib/constantes';
import QRCode from '@/components/QRCode';
import MinigameRenderer from '@/components/MinigameRenderer';

const CAT_ICONS = {
  grammar:    BookOpen,
  vocabulary: MessageSquare,
  time_place: Clock,
  challenge:  Zap,
  wild:       Shuffle,
  mystery:    HelpCircle,
} as const;

export default function ProfessorPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const { sala, grupos, carregando, erro, iniciarJogo, avancarTurno, ajustarPosicao, removerGrupo, trocarCor, pausar, encerrarJogo } = useJogo(codigo);
  const [showQR, setShowQR] = useState(false);
  const [salaURL, setSalaURL] = useState('');
  const [ip, setIp] = useState('');
  const [confirmEncerrar, setConfirmEncerrar] = useState(false);
  const [confirmRemover, setConfirmRemover] = useState<{ id: string; nome: string; cor: string; emoji: string } | null>(null);
  const [colorPickerGrupoId, setColorPickerGrupoId] = useState<string | null>(null);

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
      {/* Confirmação remover grupo */}
      {confirmRemover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#161B22] border border-red-500/30 rounded-3xl p-6 w-full max-w-sm text-center flex flex-col gap-4">
            <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: confirmRemover.cor, display: 'inline-block', margin: '0 auto' }} />
            <h2 className="text-white font-black text-xl">Remover equipe?</h2>
            <p className="text-[#7D8590] text-sm leading-relaxed">
              <span style={{ color: confirmRemover.cor }} className="font-bold">{confirmRemover.nome}</span> será removida da sala permanentemente.
            </p>
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setConfirmRemover(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#21262D] text-[#7D8590] hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={async () => { await removerGrupo(confirmRemover.id); setConfirmRemover(null); }}
                className="flex-1 py-3 rounded-xl font-black text-sm bg-red-600 hover:bg-red-500 text-white transition-all active:scale-[.97]"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color picker */}
      {colorPickerGrupoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-black text-base flex items-center gap-2"><Palette size={18} /> Alterar cor</h2>
              <button onClick={() => setColorPickerGrupoId(null)}
                className="text-[#7D8590] hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {GRUPOS_CONFIG.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={async () => { await trocarCor(colorPickerGrupoId, idx); setColorPickerGrupoId(null); }}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl border border-transparent hover:border-white/20 transition-all active:scale-95"
                  style={{ backgroundColor: slot.cor + '22' }}
                  title={slot.nome}
                >
                  <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: slot.cor, display: 'inline-block' }} />
                  <span className="text-xs font-semibold leading-tight text-center" style={{ color: slot.cor }}>
                    {slot.nome.replace('Grupo ', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmação encerrar */}
      {confirmEncerrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#161B22] border border-red-500/30 rounded-3xl p-6 w-full max-w-sm text-center flex flex-col gap-4">
            <Flag size={40} color="#ef4444" strokeWidth={1.5} />
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
            <div className="w-11 h-11 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center flex-shrink-0">
              <GraduationCap size={24} color="#7D8590" />
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
                {showQR ? <X size={14} /> : <QrCode size={14} />} QR
              </button>
            </div>
          </div>
        </div>

        {/* ── QR PANEL ── */}
        {showQR && salaURL && (
          <div className="border-b border-[#21262D] bg-[#161B22] px-5 py-6 flex flex-col items-center gap-6">
            {/* Player QR */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#7D8590] text-sm font-semibold flex items-center gap-1.5"><Gamepad2 size={14} /> Grupos entram aqui:</p>
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QRCode value={salaURL} size={160} />
              </div>
              <p className="font-mono text-amber-400 font-bold text-sm break-all text-center">{salaURL}</p>
            </div>

            {/* Spectator QR */}
            <div className="flex flex-col items-center gap-3 border-t border-[#30363D] pt-5 w-full">
              <p className="text-[#7D8590] text-sm font-semibold flex items-center gap-1.5"><Eye size={14} /> Espectadores assistem aqui:</p>
              <div className="bg-white p-3 rounded-2xl shadow-2xl">
                <QRCode value={`${salaURL}/espectador`} size={140} />
              </div>
              <p className="font-mono text-violet-400 font-bold text-xs break-all text-center">{salaURL}/espectador</p>
            </div>

            {ip && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-center text-sm">
                <p className="text-violet-300 text-xs flex items-center gap-1.5 justify-center">
                  <Wifi size={12} /> IP local: <strong className="text-white">{ip}</strong>
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
                <p className="font-black text-white text-lg leading-tight flex items-center gap-2">
                  {sala.status === 'aguardando' && <><Timer size={18} color="#fbbf24" /> Aguardando grupos</>}
                  {sala.status === 'jogando' && (sala.pausado ? <><Pause size={18} color="#fbbf24" /> Pausado</> : <><Play size={18} color="#34d399" /> Em jogo</>)}
                  {sala.status === 'finalizado' && <><Flag size={18} color="#7D8590" /> Finalizado</>}
                </p>
                {grupoAtual && sala.status === 'jogando' && (
                  <p className="text-sm mt-1 flex items-center gap-1.5" style={{ color: grupoAtual.cor }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                    {grupoAtual.nome}
                    <span className="text-[#7D8590] font-normal text-xs">— {sala.fase}</span>
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
                      className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97] flex items-center gap-1.5">
                      <Pause size={14} /> Pausar
                    </button>
                    <button onClick={avancarTurno}
                      className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97] flex items-center gap-1.5">
                      <SkipForward size={14} /> Skip
                    </button>
                    <button onClick={() => setConfirmEncerrar(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97] flex items-center gap-1.5">
                      <Flag size={14} /> Encerrar
                    </button>
                  </>
                )}
                {sala.status === 'jogando' && sala.pausado && (
                  <>
                    <button onClick={pausar}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97] flex items-center gap-1.5">
                      <Play size={14} /> Retomar
                    </button>
                    <button onClick={() => setConfirmEncerrar(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[.97] flex items-center gap-1.5">
                      <Flag size={14} /> Encerrar
                    </button>
                  </>
                )}
              </div>
            </div>

            {sala.status === 'aguardando' && grupos.length === 0 && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-300/80 text-sm">
                <span className="flex items-start gap-2"><AlertTriangle size={16} className="shrink-0 mt-0.5" /> Nenhum grupo entrou ainda. Mostre o QR para os grupos acessarem no celular.</span>
              </div>
            )}
          </div>

          {/* ── DADO ROLANDO ── */}
          {sala.status === 'jogando' && sala.fase === 'dado' && grupoAtual && (
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 flex items-center gap-4">
              <RotateCw size={32} color={grupoAtual.cor} className="animate-spin" style={{ animationDuration: '1.2s' }} />
              <div>
                <p className="text-white font-bold text-sm">Girando a roleta</p>
                <p className="text-xs mt-0.5 font-bold flex items-center gap-1" style={{ color: grupoAtual.cor }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                  {grupoAtual.nome}
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
                      {(() => { const Icon = CAT_ICONS[sala.categoria_atual!]; return <Icon size={13} color={configCat.cor} />; })()}
                      <span>{configCat.label}</span>
                    </div>
                  )}
                  {grupoAtual && (
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: grupoAtual.cor }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                      {grupoAtual.nome}
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
                {sala.resultado_atual.resposta_dada === '__timeout__'
                  ? <Timer size={22} color="#fbbf24" />
                  : <AlertTriangle size={22} color="#fca5a5" />}
                <div>
                  <p className="text-amber-300 font-bold text-sm">
                    {sala.resultado_atual.resposta_dada === '__timeout__' ? 'Tempo esgotado' : 'Grupo errou'} — aguardando liberação
                  </p>
                  {grupoAtual && (
                    <p className="text-amber-400/60 text-xs flex items-center gap-1">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                      {grupoAtual.nome}
                    </p>
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
                          <p className="text-blue-400 text-xs mt-1 flex items-start gap-1"><Lightbulb size={12} className="shrink-0 mt-0.5" /> {(p as PerguntaVF).explicacao}</p>
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
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[.97] text-black font-black py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Liberar próxima pergunta
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
                    <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block', flexShrink: 0 }} />
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
                      {sala.status !== 'finalizado' && (
                        <>
                          <button onClick={() => setColorPickerGrupoId(g.id)}
                            className="w-7 h-7 rounded-lg bg-violet-500/10 hover:bg-violet-500/30 text-violet-400 border border-violet-500/20 transition-all active:scale-95 flex items-center justify-center"
                            title="Alterar cor">
                            <Palette size={14} />
                          </button>
                          <button onClick={() => setConfirmRemover({ id: g.id, nome: g.nome, cor: g.cor, emoji: g.emoji })}
                            className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 transition-all active:scale-95 flex items-center justify-center"
                            title="Remover equipe">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LINK DE ACESSO ── */}
          {salaURL && sala.status === 'aguardando' && !showQR && (
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl px-4 py-3">
              <p className="text-violet-300 text-xs font-semibold mb-1 flex items-center gap-1"><Wifi size={12} /> Grupos acessam pelo celular:</p>
              <p className="font-mono text-amber-400 font-bold text-sm break-all">{salaURL}</p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
