'use client';
import { useState, useEffect, useRef, use } from 'react';
import type { Pergunta, CategoriasDado, Grupo } from '@/lib/tipos';
import { useJogo } from '@/hooks/useJogo';
import { DADO_CONFIG, DURACAO_RESULTADO } from '@/lib/constantes';
import Dado from '@/components/Dado';
import MinigameRenderer from '@/components/MinigameRenderer';
import WildCard from '@/components/WildCard';
import MapaPath, { nodePos, MAPA_W, MAPA_H } from '@/components/MapaPath';
import { getEstrelaCategoria } from '@/lib/jogoLocal';

const MUTED  = '#7D8590';
const BORDER = '#21262D';

// ── SVG pawn shape — classic cone (wide base → narrows up) with ball on tip ──
function PawnShape({ color, active = false, mine = false, size = 32 }: {
  color: string; active?: boolean; mine?: boolean; size?: number;
}) {
  // viewBox: 0 0 40 60
  // Ball sits at the NARROW tip (top). Cone widens downward. Flat disc base.
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
      {/* Drop shadow */}
      <ellipse cx="20" cy="57" rx="13" ry="3.5" fill="rgba(0,0,0,0.45)" />
      {/* Base disc (bottom) */}
      <ellipse cx="20" cy="50" rx="14" ry="5" fill={color} />
      {/* Cone body: narrow at top (y≈22) → wide at base (y≈50) */}
      <path d="M14 22 L5 50 L35 50 L26 22 Z" fill={color} />
      {/* Smooth the cone edges */}
      <path d="M14 22 Q7 36 5 50 L35 50 Q33 36 26 22 Z" fill={color} />
      {/* Neck connector between cone tip and ball */}
      <rect x="17" y="16" width="6" height="8" rx="3" fill={color} />
      {/* Ball at top tip */}
      <circle cx="20" cy="9" r="9" fill={color} />
      {/* White stroke outlines */}
      <circle cx="20" cy="9" r="9" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
      <ellipse cx="20" cy="50" rx="14" ry="5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* Shine on ball */}
      <circle cx="13" cy="5" r="4" fill="white" opacity="0.22" />
      {/* Active glow ring (gold, around ball) */}
      {active && <circle cx="20" cy="9" r="13" fill="none" stroke="#FCD34D" strokeWidth="3" />}
      {/* Mine indicator (white ring) */}
      {mine && !active && <circle cx="20" cy="9" r="12.5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.7" />}
    </svg>
  );
}

export default function SalaJogador({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const jogo = useJogo(codigo);
  const { sala, grupos, carregando, erro } = jogo;

  const [meuGrupoId, setMeuGrupoId]     = useState<string | null>(null);
  const [perguntasFeitas, setPerguntasFeitas] = useState<string[]>([]);
  const [esperandoWild, setEsperandoWild]    = useState(false);
  const [respondendo, setRespondendo]        = useState(false);
  const [mostrarSorteio, setMostrarSorteio]  = useState(false);
  const [mostrarVezDe, setMostrarVezDe]      = useState(false);

  const avancarRef    = useRef(jogo.avancarTurno);
  const boardRef      = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<string | undefined>(undefined);
  const prevPosRef    = useRef<number>(-1);
  const prevTurnoRef  = useRef<string | null>(null);

  const meuGrupo   = grupos.find(g => g.id === meuGrupoId) ?? null;
  const ehMeuTurno = sala?.turno_grupo_id === meuGrupoId;
  const grupoAtual = grupos.find(g => g.id === sala?.turno_grupo_id);
  const configCat  = sala?.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
  const cor        = meuGrupo?.cor ?? '#6366F1';

  useEffect(() => { avancarRef.current = jogo.avancarTurno; });

  // Client-side auto-advance — only for correct answers; wrong answers wait for professor
  useEffect(() => {
    if (sala?.fase !== 'resultado' || !ehMeuTurno) return;
    if (!sala.resultado_atual?.correto) return;
    const t = setTimeout(() => avancarRef.current(), DURACAO_RESULTADO);
    return () => clearTimeout(t);
  }, [sala?.fase, ehMeuTurno, sala?.resultado_atual?.correto]);

  // Turn-change popup — shows for 2.5s when it becomes another group's turn
  useEffect(() => {
    const turno = sala?.turno_grupo_id;
    if (!turno || turno === prevTurnoRef.current) return;
    prevTurnoRef.current = turno;
    if (turno === meuGrupoId) return;
    setMostrarVezDe(true);
    const t = setTimeout(() => setMostrarVezDe(false), 2500);
    return () => clearTimeout(t);
  }, [sala?.turno_grupo_id, meuGrupoId]);

  // Show sorteio animation when game starts
  useEffect(() => {
    if (prevStatusRef.current === 'aguardando' && sala?.status === 'jogando') {
      setMostrarSorteio(true);
      const t = setTimeout(() => setMostrarSorteio(false), 4200);
      return () => clearTimeout(t);
    }
    if (sala?.status) prevStatusRef.current = sala.status;
  }, [sala?.status]);

  // Enter room
  useEffect(() => {
    if (!sala || meuGrupoId) return;
    const chave = `grupo_${sala.id}`;
    const salvo = localStorage.getItem(chave);
    if (salvo && grupos.find(g => g.id === salvo)) { setMeuGrupoId(salvo); return; }
    jogo.entrarNaSala(grupos.length).then(g => {
      if (g) { setMeuGrupoId(g.id); localStorage.setItem(chave, g.id); }
    });
  }, [sala?.id, grupos.length]);

  // Auto-scroll board to player's piece
  useEffect(() => {
    if (!meuGrupo || !boardRef.current) return;
    const pos = meuGrupo.posicao;
    if (pos === prevPosRef.current) return;
    prevPosRef.current = pos;

    const target = Math.max(1, pos);
    const { y: svgY } = nodePos(target);
    const containerW  = boardRef.current.clientWidth;
    const containerH  = boardRef.current.clientHeight;
    const scale       = containerW / MAPA_W;
    const scrollTop   = svgY * scale - containerH * 0.45;
    boardRef.current.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
  }, [meuGrupo?.posicao]);

  async function handleDado(cat: CategoriasDado) {
    if (!meuGrupoId) return;
    if (cat === 'wild') { setEsperandoWild(true); return; }
    if (cat === 'mystery') {
      const list: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place'];
      cat = list[Math.floor(Math.random() * list.length)];
    }
    await jogo.rolarDado(meuGrupoId, cat, perguntasFeitas);
  }

  async function handleWild(cat: CategoriasDado) {
    setEsperandoWild(false);
    await jogo.rolarDado(meuGrupoId!, cat, perguntasFeitas);
  }

  async function handleResposta(resposta: string, correto: boolean) {
    if (!meuGrupoId || respondendo) return;
    setRespondendo(true);
    if (sala?.pergunta_atual) setPerguntasFeitas(p => [...p, (sala.pergunta_atual as Pergunta).id]);
    await jogo.responder(meuGrupoId, resposta, correto);
    setTimeout(() => setRespondendo(false), 200);
  }

  if (carregando) return <Splash codigo={codigo} />;
  if (erro || !sala) return <ErroTela msg={erro || 'Sala não encontrada.'} />;

  const temPopup =
    mostrarSorteio ||
    mostrarVezDe ||
    sala.status === 'finalizado' ||
    (sala.status === 'jogando' && (
      (ehMeuTurno && sala.fase === 'dado' && !esperandoWild) ||
      (ehMeuTurno && esperandoWild) ||
      sala.fase === 'minigame' ||
      sala.fase === 'resultado'
    ));

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D1117' }}>

      {/* ── BOARD (always visible) ── */}
      <div ref={boardRef} className="absolute inset-0 overflow-y-auto scrollbar-none">
        <div style={{ position: 'relative', maxWidth: MAPA_W, margin: '0 auto' }}>
          <MapaPath grupos={grupos} grupoAtual={sala.turno_grupo_id} meuGrupoId={meuGrupoId} />

          {/* HTML pawn overlay — animates via CSS transitions on left/top % */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {grupos.map(g => {
              const pos  = Math.max(1, g.posicao);
              const { x, y } = nodePos(pos);

              // Offset stacked pieces on the same square
              const aqui    = grupos.filter(h => Math.max(1, h.posicao) === pos);
              const myIdx   = aqui.findIndex(h => h.id === g.id);
              const offsetX = aqui.length === 1 ? 0 : (myIdx % 2 === 0 ? -12 : 12);
              const stackY  = Math.floor(myIdx / 2) * -6;

              // topPct = node center; transform -83% aligns pawn base disc to node center
              const leftPct = `${(x / MAPA_W) * 100}%`;
              const topPct  = `${(y / MAPA_H) * 100}%`;
              const isActive = g.id === sala.turno_grupo_id;
              const isMine   = g.id === meuGrupoId;
              const sz = isMine ? 34 : 28;

              return (
                <div
                  key={g.id}
                  style={{
                    position: 'absolute',
                    left: leftPct,
                    top: topPct,
                    transform: `translate(calc(-50% + ${offsetX}px), calc(-83% + ${stackY}px))`,
                    transition: 'left 1.0s cubic-bezier(0.34, 1.56, 0.64, 1), top 1.0s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: isMine ? 2 : 1,
                    filter: isActive ? `drop-shadow(0 0 10px ${g.cor})` : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
                  }}
                >
                  <PawnShape color={g.cor} active={isActive} mine={isMine} size={sz} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HEADER (fixed overlay) ── */}
      <header
        className="absolute top-0 left-0 right-0 z-20"
        style={{ background: 'rgba(13,17,23,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="px-4 pt-10 pb-3 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border"
            style={{ backgroundColor: cor + '22', borderColor: cor + '66' }}
          >
            {meuGrupo?.emoji ?? '🎮'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-black text-white text-base leading-tight truncate">
                {meuGrupo?.nome ?? 'Entrando...'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── TURN POPUP (centered, shown for 2.5s when another group's turn starts) ── */}
      {mostrarVezDe && !mostrarSorteio && grupoAtual && (
        <Overlay>
          <div
            className="rounded-3xl p-8 text-center border animate-pop-in"
            style={{ backgroundColor: '#161B22', borderColor: BORDER }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: grupoAtual.cor + '22', border: `2px solid ${grupoAtual.cor}` }}
            >
              {grupoAtual.emoji}
            </div>
            <p className="text-white text-base mb-1" style={{ color: MUTED }}>Vez de</p>
            <p className="font-black text-3xl" style={{ color: grupoAtual.cor }}>{grupoAtual.nome}</p>
          </div>
        </Overlay>
      )}

      {/* ── WAITING STATE ── */}
      {sala.status === 'aguardando' && (
        <Overlay>
          <AguardandoOverlay codigo={codigo} grupos={grupos} meuGrupoId={meuGrupoId} cor={cor} />
        </Overlay>
      )}

      {/* ── POPUPS (overlay + blur) ── */}

      {mostrarSorteio && (
        <Overlay>
          <SorteioModal grupos={grupos} vencedorId={sala.turno_grupo_id} />
        </Overlay>
      )}

      {!mostrarSorteio && sala.status === 'jogando' && ehMeuTurno && esperandoWild && (
        <Overlay><WildCard onEscolher={handleWild} /></Overlay>
      )}

      {!mostrarSorteio && sala.status === 'jogando' && ehMeuTurno && sala.fase === 'dado' && !esperandoWild && (
        <Overlay>
          <div className="flex flex-col items-center gap-4 py-2 animate-pop-in">
            <p className="text-xl font-black text-white">🎲 Role o dado!</p>
            <p className="text-sm" style={{ color: MUTED }}>Sorteia a categoria da pergunta</p>
            <Dado onRolar={handleDado} />
          </div>
        </Overlay>
      )}

      {!mostrarSorteio && sala.status === 'jogando' && sala.fase === 'minigame' && sala.pergunta_atual && (
        <Overlay>
          <div className="flex flex-col gap-3 w-full animate-pop-in">
            {configCat && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border"
                style={{ backgroundColor: configCat.corBg + '33', color: configCat.cor, borderColor: configCat.cor + '44' }}
              >
                <span className="text-base">{configCat.emoji}</span>
                <span>{configCat.label}</span>
                {meuGrupo && ehMeuTurno && (
                  <span className="ml-auto text-xs flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ fontSize: 10, color: i < getEstrelaCategoria(meuGrupo, sala.categoria_atual!) ? '#fbbf24' : '#30363D' }}>★</span>
                    ))}
                  </span>
                )}
                {!ehMeuTurno && grupoAtual && (
                  <span className="ml-auto text-xs font-bold" style={{ color: grupoAtual.cor }}>● {grupoAtual.nome}</span>
                )}
              </div>
            )}
            <MinigameRenderer
              pergunta={sala.pergunta_atual as Pergunta}
              onResponder={ehMeuTurno ? handleResposta : () => {}}
              readonly={!ehMeuTurno}
            />
          </div>
        </Overlay>
      )}

      {!mostrarSorteio && sala.status === 'jogando' && sala.fase === 'resultado' && sala.resultado_atual && (
        <Overlay>
          <ResultadoPopup
            resultado={sala.resultado_atual}
            ehMeuTurno={ehMeuTurno}
            cor={cor}
            grupoAtual={grupoAtual}
          />
        </Overlay>
      )}

      {sala.status === 'finalizado' && (
        <Overlay>
          <FimDeJogo grupos={grupos} meuGrupoId={meuGrupoId} />
        </Overlay>
      )}
    </div>
  );
}

// ── Overlay shell ─────────────────────────────────────────────────────────────
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(10px)', background: 'rgba(13,17,23,0.72)' }}
    >
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

// ── Sorteio modal ─────────────────────────────────────────────────────────────
function SorteioModal({ grupos, vencedorId }: { grupos: Grupo[]; vencedorId: string | null }) {
  const [revelado, setRevelado] = useState(false);
  const vencedor = grupos.find(g => g.id === vencedorId);

  useEffect(() => {
    const t = setTimeout(() => setRevelado(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="text-center rounded-3xl p-6 border animate-pop-in"
      style={{ backgroundColor: '#161B22', borderColor: BORDER }}
    >
      {!revelado && (
        <p className="text-white font-black text-xl mb-5">
          {grupos.length <= 2 ? '🪙 Jogando moeda...' : '🎲 Sorteando time...'}
        </p>
      )}

      {grupos.length <= 2
        ? <MoedaFlip3D grupos={grupos} vencedor={vencedor} revelado={revelado} />
        : <SorteioTimes grupos={grupos} vencedor={vencedor} revelado={revelado} />
      }

      {revelado && vencedor && (
        <div className="mt-6 animate-pop-in">
          <p className="font-black text-3xl" style={{ color: vencedor.cor }}>
            {vencedor.emoji} {vencedor.nome}
          </p>
          <p className="text-white text-lg mt-1">começa primeiro! 🚀</p>
        </div>
      )}
    </div>
  );
}

function MoedaFlip3D({ grupos, vencedor, revelado }: { grupos: Grupo[]; vencedor?: Grupo; revelado: boolean }) {
  const [coinRot, setCoinRot] = useState(0);
  const [settling, setSettling] = useState(false);
  const coinRef = useRef(0);

  useEffect(() => {
    if (revelado) {
      setSettling(true);
      const winIdx = grupos.findIndex(g => g.id === vencedor?.id);
      // front = team 0, back (180deg) = team 1
      const targetAngle = winIdx === 1 ? 180 : 0;
      const finalAngle = Math.ceil(coinRef.current / 360) * 360 + targetAngle;
      coinRef.current = finalAngle;
      setCoinRot(finalAngle);
      return;
    }

    let angle = coinRef.current;
    const interval = setInterval(() => {
      angle += 180;
      coinRef.current = angle;
      setCoinRot(angle);
    }, 130);
    return () => clearInterval(interval);
  }, [revelado]);

  const g0 = grupos[0];
  const g1 = grupos[1] ?? grupos[0];

  return (
    <div className="coin-scene mx-auto">
      <div
        className="coin-body"
        style={{
          transform: `rotateY(${coinRot}deg)`,
          transition: settling
            ? 'transform 1.1s cubic-bezier(0.25, 0.1, 0.25, 1)'
            : 'transform 0.11s linear',
        }}
      >
        <div
          className="coin-face coin-face-front"
          style={{ backgroundColor: g0?.cor ?? '#6366F1', boxShadow: `0 0 30px ${g0?.cor ?? '#6366F1'}66` }}
        >
          <span style={{ fontSize: 48 }}>{g0?.emoji}</span>
        </div>
        <div
          className="coin-face coin-face-back"
          style={{ backgroundColor: g1?.cor ?? '#6366F1', boxShadow: `0 0 30px ${g1?.cor ?? '#6366F1'}66` }}
        >
          <span style={{ fontSize: 48 }}>{g1?.emoji}</span>
        </div>
      </div>
    </div>
  );
}

function SorteioTimes({ grupos, vencedor, revelado }: { grupos: Grupo[]; vencedor?: Grupo; revelado: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {grupos.map((g, i) => {
        const isWinner = g.id === vencedor?.id;
        const dimmed   = revelado && !isWinner;
        return (
          <div
            key={g.id}
            className="flex flex-col items-center gap-1.5"
            style={{
              opacity:    dimmed ? 0.2 : 1,
              transform:  isWinner && revelado ? 'scale(1.25)' : 'scale(1)',
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
              style={{
                backgroundColor: g.cor,
                borderColor:     isWinner && revelado ? '#FCD34D' : g.cor,
                boxShadow:       isWinner && revelado ? `0 0 25px ${g.cor}` : 'none',
                animation:       !revelado ? `tokenBounce 0.4s ${i * 0.12}s infinite alternate` : 'none',
              }}
            >
              {g.emoji}
            </div>
            <span className="text-xs text-white font-bold">{g.nome}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Resultado popup ───────────────────────────────────────────────────────────
function ResultadoPopup({
  resultado, ehMeuTurno, cor, grupoAtual,
}: {
  resultado: { correto: boolean; casas_avancadas: number; resposta_correta: string | Record<string, string>; resposta_dada?: string | null };
  ehMeuTurno: boolean;
  cor?: string;
  grupoAtual?: Grupo;
}) {
  const ok        = resultado.correto;
  const isTimeout = resultado.resposta_dada === '__timeout__';

  const bgClass   = ok ? 'bg-emerald-500/10 border-emerald-500/30'
                  : isTimeout ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-red-500/10 border-red-500/30';
  const textClass = ok ? 'text-emerald-400' : isTimeout ? 'text-amber-400' : 'text-red-400';
  const emoji     = ok ? '🎉' : isTimeout ? '⏰' : '😬';
  const titulo    = ok ? 'Acertou!' : isTimeout ? 'Tempo esgotado!' : 'Errou!';

  return (
    <div className={`rounded-3xl p-6 text-center border flex flex-col items-center gap-3 animate-pop-in ${bgClass}`}>
      <span className="text-6xl">{emoji}</span>
      <h3 className={`text-2xl font-black ${textClass}`}>
        {titulo}
        {!ehMeuTurno && grupoAtual && (
          <span className="text-base font-normal opacity-60"> ({grupoAtual.nome})</span>
        )}
      </h3>
      {ok && (
        <p className="text-white font-bold text-lg">
          +{resultado.casas_avancadas} casa{resultado.casas_avancadas !== 1 ? 's' : ''} 🚀
        </p>
      )}
      {!ok && !isTimeout && resultado.resposta_correta && (
        <p className="text-sm" style={{ color: MUTED }}>
          Certo: <strong className="text-white">{String(resultado.resposta_correta)}</strong>
        </p>
      )}
      {!ok && !isTimeout && ehMeuTurno && (
        <p className="text-xs mt-1 animate-pulse" style={{ color: MUTED }}>
          Aguardando professor liberar próxima pergunta…
        </p>
      )}
    </div>
  );
}

// ── Aguardando overlay ────────────────────────────────────────────────────────
function AguardandoOverlay({ codigo, grupos, meuGrupoId, cor }: {
  codigo: string; grupos: Grupo[]; meuGrupoId: string | null; cor: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-center">
        <p className="text-white font-black text-lg">Aguardando início</p>
        <p className="text-sm" style={{ color: MUTED }}>O professor vai iniciar o jogo</p>
      </div>
      <div
        className="px-6 py-3 rounded-2xl text-center border mx-auto"
        style={{ backgroundColor: cor + '11', borderColor: cor + '44' }}
      >
        <p className="text-xs mb-0.5" style={{ color: MUTED }}>Código da sala</p>
        <p className="font-black text-2xl tracking-[.3em] text-white font-mono">{codigo}</p>
      </div>
      {grupos.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {grupos.map(g => (
            <div
              key={g.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm"
              style={{ backgroundColor: g.cor + '18', borderColor: g.cor + '44' }}
            >
              <span>{g.emoji}</span>
              <span className="font-bold" style={{ color: g.cor }}>{g.nome}</span>
              {g.id === meuGrupoId && <span className="text-[10px]" style={{ color: MUTED }}>você</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Fim de jogo ───────────────────────────────────────────────────────────────
function FimDeJogo({ grupos, meuGrupoId }: { grupos: Grupo[]; meuGrupoId: string | null }) {
  const sorted  = [...grupos].sort((a, b) => b.posicao - a.posicao);
  const winner  = sorted[0];
  const rest    = sorted.slice(1);
  const meuIdx  = sorted.findIndex(g => g.id === meuGrupoId);
  const souVencedor = meuIdx === 0;

  return (
    <div className="rounded-3xl border overflow-hidden animate-pop-in" style={{ backgroundColor: '#161B22', borderColor: BORDER }}>

      {/* Winner banner */}
      <div
        className="px-6 pt-7 pb-6 flex flex-col items-center gap-2 text-center"
        style={{ background: `linear-gradient(160deg, ${winner?.cor}22 0%, transparent 70%)` }}
      >
        <span className="text-5xl mb-1">🏆</span>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Grande vencedor</p>
        <p className="font-black text-4xl leading-tight" style={{ color: winner?.cor }}>
          {winner?.emoji} {winner?.nome}
        </p>
        <p className="text-white font-bold text-sm">
          Casa <span style={{ color: winner?.cor }}>{winner?.posicao}</span>
        </p>
        {meuGrupoId && (
          <div
            className="mt-2 px-4 py-1.5 rounded-full text-sm font-bold border"
            style={souVencedor
              ? { backgroundColor: winner?.cor + '22', borderColor: winner?.cor + '55', color: winner?.cor }
              : { backgroundColor: '#21262D', borderColor: BORDER, color: MUTED }}
          >
            {souVencedor ? '🎉 Você venceu!' : `Você ficou em ${meuIdx + 1}º lugar`}
          </div>
        )}
      </div>

      {/* Other teams */}
      {rest.length > 0 && (
        <div className="px-4 pb-5 flex flex-col gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs font-semibold uppercase tracking-widest pt-4 pb-1" style={{ color: MUTED }}>Classificação</p>
          {rest.map((g, i) => {
            const pos  = i + 2;
            const MEDALS: Record<number, string> = { 2: '🥈', 3: '🥉' };
            const isMe = g.id === meuGrupoId;
            return (
              <div
                key={g.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                style={{
                  backgroundColor: isMe ? g.cor + '15' : '#0D111799',
                  borderColor:     isMe ? g.cor + '44' : BORDER,
                }}
              >
                <span className="text-lg w-7 text-center">{MEDALS[pos] ?? `${pos}º`}</span>
                <span className="text-lg">{g.emoji}</span>
                <span className="font-bold flex-1 text-sm" style={{ color: g.cor }}>{g.nome}</span>
                <span className="text-xs font-bold" style={{ color: MUTED }}>Casa {g.posicao}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Splash / Error ────────────────────────────────────────────────────────────
function Splash({ codigo }: { codigo: string }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 px-6">
      <span className="text-4xl animate-pulse">🎮</span>
      <p className="text-sm" style={{ color: MUTED }}>
        Conectando à sala <strong className="text-white font-mono">{codigo}</strong>…
      </p>
      {s >= 5 && (
        <div className="mt-2 flex flex-col items-center gap-3 text-center">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm max-w-xs">
            {s >= 10
              ? '❌ Sala não encontrada ou servidor offline.'
              : '⏳ Demorando mais que o esperado…'}
          </div>
          <a href="/" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white">
            ← Voltar
          </a>
        </div>
      )}
    </div>
  );
}

function ErroTela({ msg }: { msg: string }) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 p-6">
      <span className="text-3xl">😕</span>
      <p className="text-red-400 font-bold text-center">{msg}</p>
      <a href="/" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white">← Voltar</a>
    </div>
  );
}
