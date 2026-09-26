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

export default function SalaJogador({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const jogo = useJogo(codigo);
  const { sala, grupos, carregando, erro } = jogo;

  const [meuGrupoId, setMeuGrupoId]     = useState<string | null>(null);
  const [perguntasFeitas, setPerguntasFeitas] = useState<string[]>([]);
  const [esperandoWild, setEsperandoWild]    = useState(false);
  const [respondendo, setRespondendo]        = useState(false);
  const [mostrarSorteio, setMostrarSorteio]  = useState(false);

  const avancarRef    = useRef(jogo.avancarTurno);
  const boardRef      = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<string | undefined>(undefined);
  const prevPosRef    = useRef<number>(-1);

  const meuGrupo   = grupos.find(g => g.id === meuGrupoId) ?? null;
  const ehMeuTurno = sala?.turno_grupo_id === meuGrupoId;
  const grupoAtual = grupos.find(g => g.id === sala?.turno_grupo_id);
  const configCat  = sala?.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
  const cor        = meuGrupo?.cor ?? '#6366F1';

  useEffect(() => { avancarRef.current = jogo.avancarTurno; });

  // Client-side auto-advance
  useEffect(() => {
    if (sala?.fase !== 'resultado' || !ehMeuTurno) return;
    const t = setTimeout(() => avancarRef.current(), DURACAO_RESULTADO);
    return () => clearTimeout(t);
  }, [sala?.fase, ehMeuTurno]);

  // Show sorteio animation when game starts
  useEffect(() => {
    if (prevStatusRef.current === 'aguardando' && sala?.status === 'jogando') {
      setMostrarSorteio(true);
      const t = setTimeout(() => setMostrarSorteio(false), 3800);
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
        <MapaPath grupos={grupos} grupoAtual={sala.turno_grupo_id} meuGrupoId={meuGrupoId} />
      </div>

      {/* ── HEADER (fixed overlay) ── */}
      <header
        className="absolute top-0 left-0 right-0 z-20"
        style={{ background: 'rgba(13,17,23,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="px-4 pt-10 pb-2.5 flex items-center gap-3">
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
              <span className="text-xs font-bold flex-shrink-0" style={{ color: MUTED }}>
                {meuGrupo?.posicao ?? 0}/50
              </span>
            </div>
            <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: BORDER }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${((meuGrupo?.posicao ?? 0) / 50) * 100}%`, backgroundColor: cor }}
              />
            </div>
          </div>
        </div>

        {/* Stars */}
        {meuGrupo && (
          <div className="px-4 pb-2.5 flex gap-4">
            {(['grammar', 'vocabulary', 'time_place'] as CategoriasDado[]).map(cat => {
              const n    = getEstrelaCategoria(meuGrupo, cat);
              const icon: Record<string, string> = { grammar: '📝', vocabulary: '🗣️', time_place: '⏰' };
              return (
                <div key={cat} className="flex items-center gap-1">
                  <span className="text-xs">{icon[cat]}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-[9px] ${i < n ? 'text-amber-400' : 'text-[#30363D]'}`}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* ── TURN INDICATOR (floating bottom, only when no popup) ── */}
      {!temPopup && sala.status === 'jogando' && (
        <div className="absolute bottom-8 inset-x-0 flex justify-center z-20 pointer-events-none animate-slide-up">
          {ehMeuTurno ? (
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm animate-pulse"
              style={{ backgroundColor: cor + '22', color: cor, border: `1px solid ${cor}55`, backdropFilter: 'blur(10px)' }}
            >
              🎯 Sua vez! Aguarde o popup
            </div>
          ) : (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(10px)', border: `1px solid ${BORDER}` }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: grupoAtual?.cor }} />
              <span className="text-white">Vez de <strong style={{ color: grupoAtual?.cor }}>{grupoAtual?.nome}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* ── WAITING STATE ── */}
      {sala.status === 'aguardando' && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-10"
          style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.97) 65%, transparent)' }}
        >
          <AguardandoOverlay codigo={codigo} grupos={grupos} meuGrupoId={meuGrupoId} cor={cor} />
        </div>
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border"
                style={{ backgroundColor: configCat.corBg + '33', color: configCat.cor, borderColor: configCat.cor + '44' }}
              >
                <span className="text-base">{configCat.emoji}</span>
                <span>{configCat.label}</span>
                {meuGrupo && ehMeuTurno && (
                  <span className="ml-auto text-xs opacity-60">Nível {getEstrelaCategoria(meuGrupo, sala.categoria_atual!)} ★</span>
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
    const t = setTimeout(() => setRevelado(true), 2200);
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
        ? <MoedaFlip grupos={grupos} vencedor={vencedor} revelado={revelado} />
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

function MoedaFlip({ grupos, vencedor, revelado }: { grupos: Grupo[]; vencedor?: Grupo; revelado: boolean }) {
  const [face, setFace] = useState(0);

  useEffect(() => {
    if (revelado) {
      const winIdx = grupos.findIndex(g => g.id === vencedor?.id);
      setFace(winIdx >= 0 ? winIdx % 2 : 0);
      return;
    }
    const t = setInterval(() => setFace(f => (f + 1) % 2), 120);
    return () => clearInterval(t);
  }, [revelado]);

  const g = grupos[face] ?? grupos[0];

  return (
    <div className="flex justify-center">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center text-5xl border-4 border-white"
        style={{
          backgroundColor: g.cor,
          boxShadow: `0 0 50px ${g.cor}99`,
          transition: revelado ? 'background-color 0.4s, box-shadow 0.4s' : 'background-color 0.1s',
        }}
      >
        {g.emoji}
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
              opacity:   dimmed ? 0.2 : 1,
              transform: isWinner && revelado ? 'scale(1.25)' : 'scale(1)',
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
  resultado: { correto: boolean; casas_avancadas: number; resposta_correta: string | Record<string, string> };
  ehMeuTurno: boolean;
  cor?: string;
  grupoAtual?: Grupo;
}) {
  const ok = resultado.correto;
  return (
    <div
      className={`rounded-3xl p-6 text-center border flex flex-col items-center gap-3 animate-pop-in ${
        ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      <span className="text-6xl">{ok ? '🎉' : '😬'}</span>
      <h3 className={`text-2xl font-black ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
        {ok ? 'Acertou!' : 'Errou!'}
        {!ehMeuTurno && grupoAtual && (
          <span className="text-base font-normal opacity-60"> ({grupoAtual.nome})</span>
        )}
      </h3>
      <p className="text-white font-bold text-lg">
        {ok
          ? `+${resultado.casas_avancadas} casa${resultado.casas_avancadas !== 1 ? 's' : ''} 🚀`
          : 'Estrelas resetadas ⭐'}
      </p>
      {!ok && resultado.resposta_correta && (
        <p className="text-sm" style={{ color: MUTED }}>
          Certo: <strong className="text-white">{String(resultado.resposta_correta)}</strong>
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
  const sorted = [...grupos].sort((a, b) => b.posicao - a.posicao);
  const meuIdx = sorted.findIndex(g => g.id === meuGrupoId);
  const MEDALS = ['🥇', '🥈', '🥉'];

  return (
    <div className="rounded-3xl p-6 border animate-pop-in" style={{ backgroundColor: '#161B22', borderColor: BORDER }}>
      <div className="text-center mb-5">
        <span className="text-5xl">🏆</span>
        <h2 className="font-black text-white text-2xl mt-2">Fim de jogo!</h2>
        {meuGrupoId && (
          <p className="mt-1" style={{ color: MUTED }}>
            {meuIdx === 0 ? '🎉 Vocês venceram!' : `Vocês ficaram em ${meuIdx + 1}º lugar`}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map((g, i) => (
          <div
            key={g.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3 border"
            style={{
              backgroundColor: g.id === meuGrupoId ? g.cor + '18' : 'transparent',
              borderColor:     g.id === meuGrupoId ? g.cor + '55' : BORDER,
            }}
          >
            <span className="text-xl w-7">{MEDALS[i] ?? `${i + 1}.`}</span>
            <span className="text-xl">{g.emoji}</span>
            <span className="font-bold flex-1" style={{ color: g.cor }}>{g.nome}</span>
            <span className="text-sm font-bold" style={{ color: MUTED }}>Casa {g.posicao}</span>
          </div>
        ))}
      </div>
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
