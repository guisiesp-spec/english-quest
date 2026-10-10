'use client';
import { useState, useEffect, useRef, use } from 'react';
import {
  BookOpen, MessageSquare, Clock, Zap, Shuffle, HelpCircle,
  Trophy, Star, Gamepad2, AlertCircle, Sparkles, Timer, Frown,
  Rocket, RotateCw,
} from 'lucide-react';
import type { Pergunta, CategoriasDado, Grupo } from '@/lib/tipos';
import { useJogo } from '@/hooks/useJogo';
import { DADO_CONFIG, DURACAO_RESULTADO, TIMER_DADO } from '@/lib/constantes';
import Roleta from '@/components/Roleta';
import MinigameRenderer from '@/components/MinigameRenderer';
import WildCard from '@/components/WildCard';
import MapaPath, { nodePos, MAPA_W, MAPA_H } from '@/components/MapaPath';
import { getEstrelaCategoria } from '@/lib/jogoLocal';

const CAT_ICONS = {
  grammar:    BookOpen,
  vocabulary: MessageSquare,
  time_place: Clock,
  challenge:  Zap,
  wild:       Shuffle,
  mystery:    HelpCircle,
} as const;

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
  const [tempoDado, setTempoDado]            = useState(TIMER_DADO);

  const avancarRef    = useRef(jogo.avancarTurno);
  const rolarRef      = useRef(jogo.rolarDado);
  const boardRef      = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<string | undefined>(undefined);
  const prevPosRef    = useRef<number>(-1);
  const prevTurnoRef  = useRef<string | null>(null);
  const timerExpiradoRef = useRef(false);
  const joiningRef    = useRef(false);

  const meuGrupo   = grupos.find(g => g.id === meuGrupoId) ?? null;
  const ehMeuTurno = sala?.turno_grupo_id === meuGrupoId;
  const grupoAtual = grupos.find(g => g.id === sala?.turno_grupo_id);
  const configCat  = sala?.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
  const cor        = meuGrupo?.cor ?? '#6366F1';

  useEffect(() => { avancarRef.current = jogo.avancarTurno; });
  useEffect(() => { rolarRef.current = jogo.rolarDado; });

  // Dice timer — countdown; guards with timerExpiradoRef so auto-roll only fires
  // when THIS turn's timer actually ran out (not from a stale 0 carried over)
  useEffect(() => {
    timerExpiradoRef.current = false;
    if (sala?.fase !== 'dado' || !ehMeuTurno || !meuGrupoId || esperandoWild) {
      setTempoDado(TIMER_DADO);
      return;
    }
    setTempoDado(TIMER_DADO);
    const id = setInterval(() => {
      setTempoDado(t => {
        if (t <= 1) {
          clearInterval(id);
          timerExpiradoRef.current = true;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sala?.fase, ehMeuTurno, meuGrupoId, esperandoWild]);

  // Auto-roll — only fires when the ref confirms the timer really expired this turn
  useEffect(() => {
    if (!timerExpiradoRef.current || sala?.fase !== 'dado' || !ehMeuTurno || !meuGrupoId || esperandoWild) return;
    timerExpiradoRef.current = false;
    const cats: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place'];
    rolarRef.current(meuGrupoId, cats[Math.floor(Math.random() * cats.length)], []);
  }, [tempoDado, sala?.fase, ehMeuTurno, meuGrupoId, esperandoWild]);

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
      prevStatusRef.current = 'jogando'; // update immediately so polls don't retrigger
      setMostrarSorteio(true);
      const t = setTimeout(() => setMostrarSorteio(false), 4200);
      return () => clearTimeout(t);
    }
    if (sala?.status) prevStatusRef.current = sala.status;
  }, [sala?.status]);

  // Enter room — sessionStorage is tab-local (unlike localStorage) so each tab gets its own group
  useEffect(() => {
    if (!sala || meuGrupoId || joiningRef.current) return;
    const chave = `grupo_${sala.id}`;
    const salvo = sessionStorage.getItem(chave);
    if (salvo && grupos.find(g => g.id === salvo)) { setMeuGrupoId(salvo); return; }
    joiningRef.current = true;
    jogo.entrarNaSala(grupos.length).then(g => {
      if (g) { setMeuGrupoId(g.id); sessionStorage.setItem(chave, g.id); }
      joiningRef.current = false;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sala?.id]);

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
      sala.fase === 'dado' ||
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
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
            style={{ backgroundColor: cor + '22', borderColor: cor + '66' }}
          >
            {meuGrupo
              ? <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: cor, display: 'inline-block' }} />
              : <Gamepad2 size={20} color={cor} />}
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
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: grupoAtual.cor + '22', border: `2px solid ${grupoAtual.cor}` }}
            >
              <span style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
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

      {!mostrarSorteio && sala.status === 'jogando' && sala.fase === 'dado' && (
        <Overlay>
          {ehMeuTurno && esperandoWild ? (
            <WildCard onEscolher={handleWild} />
          ) : ehMeuTurno ? (
            <div className="flex flex-col items-center gap-4 py-2 animate-pop-in w-full">
              {/* Timer bar */}
              <div className="w-full" style={{ maxWidth: 280 }}>
                <div className="flex justify-between text-xs font-bold mb-1" style={{ color: MUTED }}>
                  <span className="flex items-center gap-1"><Shuffle size={12} /> Gire a roleta!</span>
                  <span style={{ color: tempoDado <= 5 ? '#ef4444' : tempoDado <= 10 ? '#f59e0b' : '#58cc02' }}>
                    {tempoDado}s
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#21262D', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(tempoDado / TIMER_DADO) * 100}%`,
                    backgroundColor: tempoDado <= 5 ? '#ef4444' : tempoDado <= 10 ? '#f59e0b' : '#58cc02',
                    borderRadius: 99,
                    transition: 'width 1s linear, background-color 0.3s',
                  }} />
                </div>
              </div>
              <p className="text-sm" style={{ color: MUTED }}>Sorteia a categoria da pergunta</p>
              <Roleta onRolar={handleDado} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-4 animate-pop-in text-center">
              {grupoAtual && (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                  style={{ backgroundColor: grupoAtual.cor + '22', borderColor: grupoAtual.cor }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                </div>
              )}
              <div>
                <p className="font-black text-2xl" style={{ color: grupoAtual?.cor ?? '#fff' }}>
                  {grupoAtual?.nome}
                </p>
                <p className="text-sm mt-1" style={{ color: MUTED }}>está girando a roleta...</p>
              </div>
              <RotateCw size={48} color={grupoAtual?.cor ?? '#7D8590'} className="animate-spin" style={{ animationDuration: '1.2s' }} />
            </div>
          )}
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
                {(() => { const Icon = CAT_ICONS[sala.categoria_atual!]; return <Icon size={16} color={configCat.cor} />; })()}
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
        <p className="text-white font-black text-xl mb-5 flex items-center justify-center gap-2">
          <RotateCw size={20} className="animate-spin" />
          {grupos.length <= 2 ? 'Jogando moeda...' : 'Sorteando time...'}
        </p>
      )}

      {grupos.length <= 2
        ? <MoedaFlip3D grupos={grupos} vencedor={vencedor} revelado={revelado} />
        : <SorteioTimes grupos={grupos} vencedor={vencedor} revelado={revelado} />
      }

      {revelado && vencedor && (
        <div className="mt-6 animate-pop-in">
          <p className="font-black text-3xl flex items-center gap-2" style={{ color: vencedor.cor }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: vencedor.cor, display: 'inline-block', border: '2px solid white' }} />
            {vencedor.nome}
          </p>
          <p className="text-white text-lg mt-1 flex items-center gap-1.5">começa primeiro! <Rocket size={18} color="#fff" /></p>
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
          <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'inline-block', border: '3px solid rgba(255,255,255,0.6)' }} />
        </div>
        <div
          className="coin-face coin-face-back"
          style={{ backgroundColor: g1?.cor ?? '#6366F1', boxShadow: `0 0 30px ${g1?.cor ?? '#6366F1'}66` }}
        >
          <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', display: 'inline-block', border: '3px solid rgba(255,255,255,0.6)' }} />
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
              className="w-16 h-16 rounded-full flex items-center justify-center border-2"
              style={{
                backgroundColor: g.cor + '33',
                borderColor:     isWinner && revelado ? '#FCD34D' : g.cor,
                boxShadow:       isWinner && revelado ? `0 0 25px ${g.cor}` : 'none',
                animation:       !revelado ? `tokenBounce 0.4s ${i * 0.12}s infinite alternate` : 'none',
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block' }} />
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
  const titulo    = ok ? 'Acertou!' : isTimeout ? 'Tempo esgotado!' : 'Errou!';
  const ResultIcon = ok ? Sparkles : isTimeout ? Timer : Frown;
  const iconColor  = ok ? '#34d399' : isTimeout ? '#fbbf24' : '#f87171';

  return (
    <div className={`rounded-3xl p-6 text-center border flex flex-col items-center gap-3 animate-pop-in ${bgClass}`}>
      <ResultIcon size={56} color={iconColor} strokeWidth={1.5} />
      <h3 className={`text-2xl font-black ${textClass}`}>
        {titulo}
        {!ehMeuTurno && grupoAtual && (
          <span className="text-base font-normal opacity-60"> ({grupoAtual.nome})</span>
        )}
      </h3>
      {ok && (
        <p className="text-white font-bold text-lg flex items-center gap-1.5">
          +{resultado.casas_avancadas} casa{resultado.casas_avancadas !== 1 ? 's' : ''} <Rocket size={18} color="#fff" />
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
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block' }} />
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
        <Trophy size={48} color="#FCD34D" strokeWidth={1.5} className="mb-1" />
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Grande vencedor</p>
        <p className="font-black text-4xl leading-tight" style={{ color: winner?.cor }}>
          {winner?.nome}
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
            {souVencedor ? <span className="flex items-center gap-1.5"><Sparkles size={14} /> Você venceu!</span> : `Você ficou em ${meuIdx + 1}º lugar`}
          </div>
        )}
      </div>

      {/* Other teams */}
      {rest.length > 0 && (
        <div className="px-4 pb-5 flex flex-col gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs font-semibold uppercase tracking-widest pt-4 pb-1" style={{ color: MUTED }}>Classificação</p>
          {rest.map((g, i) => {
            const pos  = i + 2;
            const MEDALS: Record<number, string> = { 2: '2º', 3: '3º' };
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
                <span className="text-sm w-7 text-center font-bold" style={{ color: MUTED }}>{MEDALS[pos] ?? `${pos}º`}</span>
                <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block', flexShrink: 0 }} />
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
      <Gamepad2 size={48} color="#7D8590" className="animate-pulse" />
      <p className="text-sm" style={{ color: MUTED }}>
        Conectando à sala <strong className="text-white font-mono">{codigo}</strong>…
      </p>
      {s >= 5 && (
        <div className="mt-2 flex flex-col items-center gap-3 text-center">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm max-w-xs">
            {s >= 10
              ? <span className="flex items-center gap-1.5 justify-center"><AlertCircle size={14} /> Sala não encontrada ou servidor offline.</span>
              : <span className="flex items-center gap-1.5 justify-center"><Timer size={14} /> Demorando mais que o esperado…</span>}
          </div>
          <a href="/" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white flex items-center gap-1.5">
            <Star size={14} /> Voltar
          </a>
        </div>
      )}
    </div>
  );
}

function ErroTela({ msg }: { msg: string }) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 p-6">
      <AlertCircle size={40} color="#f87171" />
      <p className="text-red-400 font-bold text-center">{msg}</p>
      <a href="/" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white">← Voltar</a>
    </div>
  );
}
