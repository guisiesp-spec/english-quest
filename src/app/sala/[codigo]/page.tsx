'use client';
import { useState, useEffect, useRef, use } from 'react';
import type { Pergunta, CategoriasDado, Grupo } from '@/lib/tipos';
import { useJogo } from '@/hooks/useJogo';
import { DADO_CONFIG, DURACAO_RESULTADO } from '@/lib/constantes';
import Dado from '@/components/Dado';
import MinigameRenderer from '@/components/MinigameRenderer';
import WildCard from '@/components/WildCard';
import MapaModal from '@/components/MapaModal';
import { getEstrelaCategoria } from '@/lib/jogoLocal';

// ── Design tokens ────────────────────────────────────────────────────────────
const BG      = '#0D1117';
const SURFACE = '#161B22';
const BORDER  = '#21262D';
const MUTED   = '#7D8590';

export default function SalaJogador({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const jogo = useJogo(codigo);
  const { sala, grupos, carregando, erro } = jogo;

  const [meuGrupoId, setMeuGrupoId] = useState<string | null>(null);
  const [perguntasFeitas, setPerguntasFeitas] = useState<string[]>([]);
  const [esperandoWild, setEsperandoWild] = useState(false);
  const [respondendo, setRespondendo] = useState(false);
  const [mapaAberto, setMapaAberto] = useState(false);
  const avancarRef = useRef(jogo.avancarTurno);

  const meuGrupo    = grupos.find(g => g.id === meuGrupoId) ?? null;
  const ehMeuTurno  = sala?.turno_grupo_id === meuGrupoId;
  const grupoAtual  = grupos.find(g => g.id === sala?.turno_grupo_id);
  const configCat   = sala?.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;
  const cor         = meuGrupo?.cor ?? '#6366F1';

  // Keep ref fresh so the timeout closure below always calls the latest version
  useEffect(() => { avancarRef.current = jogo.avancarTurno; });

  // Client-side auto-advance: replaces the server setTimeout (which doesn't survive serverless)
  useEffect(() => {
    if (sala?.fase !== 'resultado' || !ehMeuTurno) return;
    const t = setTimeout(() => avancarRef.current(), DURACAO_RESULTADO);
    return () => clearTimeout(t);
  }, [sala?.fase, ehMeuTurno]);

  useEffect(() => {
    if (!sala || meuGrupoId) return;
    const chave = `grupo_${sala.id}`;
    const salvo = localStorage.getItem(chave);
    if (salvo && grupos.find(g => g.id === salvo)) { setMeuGrupoId(salvo); return; }
    jogo.entrarNaSala(grupos.length).then(g => {
      if (g) { setMeuGrupoId(g.id); localStorage.setItem(chave, g.id); }
    });
  }, [sala?.id, grupos.length]);

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

  return (
    <>
      {mapaAberto && (
        <MapaModal grupos={grupos} grupoAtual={sala.turno_grupo_id} meuGrupoId={meuGrupoId} onFechar={() => setMapaAberto(false)} />
      )}

      <main className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>

        {/* ── HEADER ── */}
        <header style={{ borderBottom: `1px solid ${BORDER}` }}>
          {/* Grupo color strip */}
          <div className="h-1 w-full" style={{ backgroundColor: cor }} />

          <div className="px-5 pt-10 pb-4 flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border-2"
              style={{ backgroundColor: cor + '22', borderColor: cor + '66' }}
            >
              {meuGrupo?.emoji ?? '🎮'}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-black text-white text-lg leading-tight truncate">
                {meuGrupo?.nome ?? 'Entrando...'}
              </h1>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: BORDER }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${((meuGrupo?.posicao ?? 0) / 50) * 100}%`, backgroundColor: cor }}
                  />
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: MUTED }}>
                  {meuGrupo?.posicao ?? 0}/50
                </span>
              </div>
            </div>

            <button
              onClick={() => setMapaAberto(true)}
              className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <span className="text-base">🗺</span>
              <span className="text-[9px] font-semibold" style={{ color: MUTED }}>Mapa</span>
            </button>
          </div>

          {/* Estrelas */}
          {meuGrupo && (
            <div className="px-5 pb-3 flex gap-4">
              {(['grammar', 'vocabulary', 'time_place'] as CategoriasDado[]).map(cat => {
                const n = getEstrelaCategoria(meuGrupo, cat);
                const label: Record<string, string> = { grammar: 'Grammar', vocabulary: 'Vocab', time_place: 'Time' };
                const icon: Record<string, string>  = { grammar: '📝', vocabulary: '🗣️', time_place: '⏰' };
                return (
                  <div key={cat} className="flex items-center gap-1.5">
                    <span className="text-sm">{icon[cat]}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-[10px] ${i < n ? 'text-amber-400' : 'text-[#30363D]'}`}>★</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </header>

        {/* ── BODY ── */}
        <div className="flex-1 px-5 py-5 max-w-lg mx-auto w-full flex flex-col gap-4">

          {/* FIM */}
          {sala.status === 'finalizado' && (
            <FimDeJogo grupos={grupos} meuGrupoId={meuGrupoId} onMapa={() => setMapaAberto(true)} />
          )}

          {/* AGUARDANDO */}
          {sala.status === 'aguardando' && (
            <Aguardando codigo={codigo} grupos={grupos} meuGrupoId={meuGrupoId} cor={cor} />
          )}

          {/* JOGO */}
          {sala.status === 'jogando' && (
            <>
              {/* Turno banner */}
              <div className="flex items-center justify-between">
                {ehMeuTurno ? (
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-pulse"
                    style={{ backgroundColor: cor + '22', color: cor, border: `1px solid ${cor}55` }}
                  >
                    🎯 Sua vez!
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: grupoAtual?.cor }} />
                    <span className="text-sm" style={{ color: MUTED }}>
                      Vez de <strong style={{ color: grupoAtual?.cor }}>{grupoAtual?.nome}</strong>
                    </span>
                  </div>
                )}
                {configCat && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: configCat.corBg, color: configCat.cor }}
                  >
                    {configCat.emoji} {configCat.label}
                  </span>
                )}
              </div>

              {/* Wild Card */}
              {ehMeuTurno && esperandoWild && <WildCard onEscolher={handleWild} />}

              {/* Dado */}
              {ehMeuTurno && sala.fase === 'dado' && !esperandoWild && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-sm" style={{ color: MUTED }}>Role o dado para sortear a categoria</p>
                  <Dado onRolar={handleDado} />
                </div>
              )}

              {/* Minigame */}
              {sala.fase === 'minigame' && sala.pergunta_atual && !esperandoWild && (
                <div className="flex flex-col gap-3">
                  {configCat && (
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border"
                      style={{ backgroundColor: configCat.corBg + '33', color: configCat.cor, borderColor: configCat.cor + '44' }}
                    >
                      <span className="text-base">{configCat.emoji}</span>
                      <span>{configCat.label}</span>
                      {meuGrupo && (
                        <span className="ml-auto text-xs opacity-60">
                          Nível {getEstrelaCategoria(meuGrupo, sala.categoria_atual!)} ★
                        </span>
                      )}
                    </div>
                  )}
                  <MinigameRenderer
                    pergunta={sala.pergunta_atual as Pergunta}
                    onResponder={ehMeuTurno ? handleResposta : () => {}}
                    readonly={!ehMeuTurno}
                  />
                </div>
              )}

              {/* Resultado */}
              {sala.fase === 'resultado' && sala.resultado_atual && (
                <Resultado resultado={sala.resultado_atual} ehMeuTurno={ehMeuTurno} cor={cor} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Resultado({
  resultado, ehMeuTurno, cor,
}: {
  resultado: { correto: boolean; casas_avancadas: number; resposta_correta: string | Record<string, string> };
  ehMeuTurno: boolean; cor?: string;
}) {
  const ok = resultado.correto;
  return (
    <div className={`rounded-2xl p-6 text-center border flex flex-col items-center gap-3 ${ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
      <span className="text-6xl">{ok ? '🎉' : '😬'}</span>
      <h3 className={`text-2xl font-black ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
        {ok ? 'Acertou!' : 'Errou!'}
        {!ehMeuTurno && <span className="text-base font-normal opacity-60 ml-2">(deles)</span>}
      </h3>
      <p className="text-white font-bold text-lg">
        {ok ? `+${resultado.casas_avancadas} casa${resultado.casas_avancadas !== 1 ? 's' : ''} 🚀` : 'Estrelas resetadas ⭐'}
      </p>
      {!ok && resultado.resposta_correta && (
        <p className="text-sm" style={{ color: '#7D8590' }}>
          Certo: <strong className="text-white">{String(resultado.resposta_correta)}</strong>
        </p>
      )}
    </div>
  );
}

function Aguardando({ codigo, grupos, meuGrupoId, cor }: {
  codigo: string; grupos: Grupo[]; meuGrupoId: string | null; cor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="text-5xl">⏳</div>
      <div className="text-center">
        <h2 className="font-black text-white text-xl">Aguardando início</h2>
        <p className="text-[#7D8590] text-sm mt-1">O professor vai iniciar o jogo em breve</p>
      </div>
      <div
        className="px-8 py-4 rounded-2xl text-center border"
        style={{ backgroundColor: cor + '11', borderColor: cor + '44' }}
      >
        <p className="text-[#7D8590] text-xs mb-1">Código da sala</p>
        <p className="font-black text-3xl tracking-[.3em] text-white font-mono">{codigo}</p>
      </div>
      {grupos.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          <p className="text-[#30363D] text-xs uppercase tracking-widest text-center">Grupos</p>
          {grupos.map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-[#161B22] border border-[#21262D] rounded-xl px-4 py-2.5">
              <span className="text-xl">{g.emoji}</span>
              <span className="font-bold flex-1" style={{ color: g.cor }}>{g.nome}</span>
              {g.id === meuGrupoId && <span className="text-xs text-[#30363D]">você</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FimDeJogo({ grupos, meuGrupoId, onMapa }: {
  grupos: Grupo[]; meuGrupoId: string | null; onMapa: () => void;
}) {
  const sorted  = [...grupos].sort((a, b) => b.posicao - a.posicao);
  const meuIdx  = sorted.findIndex(g => g.id === meuGrupoId);
  const MEDALS  = ['🥇', '🥈', '🥉'];

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="text-6xl">🏆</div>
      <div className="text-center">
        <h2 className="font-black text-white text-2xl">Fim de jogo!</h2>
        {meuGrupoId && (
          <p className="text-[#7D8590] mt-1">
            {meuIdx === 0 ? '🎉 Vocês venceram!' : `Vocês ficaram em ${meuIdx + 1}º lugar`}
          </p>
        )}
      </div>
      <div className="w-full flex flex-col gap-2">
        {sorted.map((g, i) => (
          <div key={g.id} className="flex items-center gap-3 rounded-xl px-4 py-3 border"
            style={{
              backgroundColor: g.id === meuGrupoId ? g.cor + '18' : '#161B22',
              borderColor:     g.id === meuGrupoId ? g.cor + '55' : '#21262D',
            }}>
            <span className="text-xl w-7">{MEDALS[i] ?? `${i+1}.`}</span>
            <span className="text-xl">{g.emoji}</span>
            <span className="font-bold flex-1" style={{ color: g.cor }}>{g.nome}</span>
            <span className="text-sm font-bold text-[#7D8590]">Casa {g.posicao}</span>
          </div>
        ))}
      </div>
      <button onClick={onMapa} className="text-[#7D8590] text-sm underline">Ver mapa final</button>
    </div>
  );
}

function Splash({ codigo }: { codigo: string }) {
  const [segundos, setSegundos] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSegundos(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 px-6">
      <span className="text-4xl animate-pulse">🎮</span>
      <p className="text-[#7D8590] text-sm">Conectando à sala <strong className="text-white font-mono">{codigo}</strong>…</p>
      {segundos >= 5 && (
        <div className="mt-2 flex flex-col items-center gap-3 text-center">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm max-w-xs">
            {segundos >= 10
              ? '❌ Sala não encontrada ou servidor offline. Verifique o código e o WiFi.'
              : '⏳ Demorando mais que o esperado…'}
          </div>
          <a href="/" className="text-sm font-bold px-5 py-2.5 rounded-xl bg-[#161B22] border border-[#30363D] text-white">
            ← Voltar ao início
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
