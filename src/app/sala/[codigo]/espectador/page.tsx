'use client';
import { use, useEffect, useRef } from 'react';
import {
  BookOpen, MessageSquare, Clock, Zap, Shuffle, HelpCircle,
  Trophy, Sparkles, Timer, Frown, RotateCw,
} from 'lucide-react';
import type { Pergunta } from '@/lib/tipos';
import { useJogo } from '@/hooks/useJogo';
import { DADO_CONFIG } from '@/lib/constantes';

const CAT_ICONS = {
  grammar:    BookOpen,
  vocabulary: MessageSquare,
  time_place: Clock,
  challenge:  Zap,
  wild:       Shuffle,
  mystery:    HelpCircle,
} as const;
import MinigameRenderer from '@/components/MinigameRenderer';
import MapaPath, { nodePos, MAPA_W, MAPA_H } from '@/components/MapaPath';

export default function EspectadorPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = use(params);
  const { sala, grupos, carregando, erro } = useJogo(codigo);
  const boardRef = useRef<HTMLDivElement>(null);
  const prevTurnoRef = useRef<string | null>(null);

  // Auto-scroll to current group's position when turn changes
  useEffect(() => {
    if (!sala || sala.turno_grupo_id === prevTurnoRef.current) return;
    prevTurnoRef.current = sala.turno_grupo_id;
    const grupo = grupos.find(g => g.id === sala.turno_grupo_id);
    if (!grupo || !boardRef.current) return;
    const { y } = nodePos(Math.max(1, grupo.posicao));
    const containerW = boardRef.current.clientWidth;
    const containerH = boardRef.current.clientHeight;
    const scale = containerW / MAPA_W;
    boardRef.current.scrollTo({ top: Math.max(0, y * scale - containerH * 0.45), behavior: 'smooth' });
  }, [sala?.turno_grupo_id, grupos]);

  if (carregando) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <span className="text-[#7D8590] text-sm animate-pulse">Conectando…</span>
    </div>
  );
  if (erro || !sala) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <p className="text-red-400">{erro ?? 'Sala não encontrada.'}</p>
    </div>
  );

  const grupoAtual = grupos.find(g => g.id === sala.turno_grupo_id);
  const configCat  = sala.categoria_atual ? DADO_CONFIG.find(d => d.categoria === sala.categoria_atual) : null;

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D1117' }}>

      {/* Board */}
      <div ref={boardRef} className="absolute inset-0 overflow-y-auto scrollbar-none">
        <div style={{ position: 'relative', maxWidth: MAPA_W, margin: '0 auto' }}>
          <MapaPath grupos={grupos} grupoAtual={sala.turno_grupo_id} />

          {/* Pawns */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {grupos.map(g => {
              const pos = Math.max(1, g.posicao);
              const { x, y } = nodePos(pos);
              const aqui   = grupos.filter(h => Math.max(1, h.posicao) === pos);
              const myIdx  = aqui.findIndex(h => h.id === g.id);
              const offsetX = aqui.length === 1 ? 0 : (myIdx % 2 === 0 ? -12 : 12);
              const stackY  = Math.floor(myIdx / 2) * -6;
              const isActive = g.id === sala.turno_grupo_id;

              return (
                <div key={g.id} style={{
                  position: 'absolute',
                  left: `${(x / MAPA_W) * 100}%`,
                  top:  `${(y / MAPA_H) * 100}%`,
                  transform: `translate(calc(-50% + ${offsetX}px), calc(-83% + ${stackY}px))`,
                  transition: 'left 1s cubic-bezier(0.34,1.56,0.64,1), top 1s cubic-bezier(0.34,1.56,0.64,1)',
                  zIndex: isActive ? 2 : 1,
                  filter: isActive ? `drop-shadow(0 0 10px ${g.cor})` : `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
                }}>
                  <svg width={isActive ? 32 : 26} height={isActive ? 48 : 39} viewBox="0 0 40 60">
                    <ellipse cx="20" cy="57" rx="13" ry="3.5" fill="rgba(0,0,0,0.45)" />
                    <ellipse cx="20" cy="50" rx="14" ry="5" fill={g.cor} />
                    <path d="M14 22 Q7 36 5 50 L35 50 Q33 36 26 22 Z" fill={g.cor} />
                    <rect x="17" y="16" width="6" height="8" rx="3" fill={g.cor} />
                    <circle cx="20" cy="9" r="9" fill={g.cor} />
                    <circle cx="20" cy="9" r="9" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" />
                    <circle cx="13" cy="5" r="4" fill="white" opacity="0.22" />
                    {isActive && <circle cx="20" cy="9" r="13" fill="none" stroke="#FCD34D" strokeWidth="3" />}
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed header */}
      <header className="absolute top-0 left-0 right-0 z-20 border-b border-[#21262D]"
        style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="px-4 pt-10 pb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[#7D8590] text-xs font-semibold">ESPECTADOR — {codigo}</p>
            {grupoAtual && (
              <p className="font-black text-base mt-0.5 flex items-center gap-1.5" style={{ color: grupoAtual.cor }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                {grupoAtual.nome}
              </p>
            )}
          </div>
          {/* Score strip */}
          <div className="flex gap-1.5 flex-wrap justify-end max-w-[55%]">
            {[...grupos].sort((a, b) => b.posicao - a.posicao).map(g => (
              <div key={g.id}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border"
                style={{
                  backgroundColor: g.cor + '18',
                  borderColor: g.id === sala.turno_grupo_id ? g.cor : g.cor + '44',
                  color: g.cor,
                }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block' }} />
                <span>{g.posicao}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Waiting */}
      {sala.status === 'aguardando' && (
        <Overlay>
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-5xl">⏳</span>
            <p className="text-white font-black text-xl">Aguardando início</p>
            <p className="text-[#7D8590] text-sm">O professor vai iniciar o jogo em breve</p>
          </div>
        </Overlay>
      )}

      {/* Dado rolando */}
      {sala.status === 'jogando' && sala.fase === 'dado' && (
        <Overlay>
          <div className="flex flex-col items-center gap-5 py-4 animate-pop-in text-center">
            {grupoAtual && (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2"
                style={{ backgroundColor: grupoAtual.cor + '22', borderColor: grupoAtual.cor }}>
                {grupoAtual.emoji}
              </div>
            )}
            <div>
              <p className="font-black text-2xl" style={{ color: grupoAtual?.cor ?? '#fff' }}>{grupoAtual?.nome}</p>
              <p className="text-sm mt-1 text-[#7D8590]">está rolando o dado...</p>
            </div>
            <RotateCw size={48} color={grupoAtual?.cor ?? '#7D8590'} className="animate-spin" style={{ animationDuration: '1.2s' }} />
          </div>
        </Overlay>
      )}

      {/* Minigame (readonly) */}
      {sala.status === 'jogando' && sala.fase === 'minigame' && sala.pergunta_atual && (
        <Overlay>
          <div className="flex flex-col gap-3 w-full animate-pop-in">
            {configCat && grupoAtual && sala.categoria_atual && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border"
                style={{ backgroundColor: configCat.corBg + '33', color: configCat.cor, borderColor: configCat.cor + '44' }}>
                {(() => { const Icon = CAT_ICONS[sala.categoria_atual]; return <Icon size={14} color={configCat.cor} />; })()}
                <span>{configCat.label}</span>
                <span className="ml-auto font-black flex items-center gap-1" style={{ color: grupoAtual.cor }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: grupoAtual.cor, display: 'inline-block' }} />
                  {grupoAtual.nome}
                </span>
              </div>
            )}
            <MinigameRenderer
              pergunta={sala.pergunta_atual as Pergunta}
              onResponder={() => {}}
              readonly
            />
          </div>
        </Overlay>
      )}

      {/* Resultado */}
      {sala.status === 'jogando' && sala.fase === 'resultado' && sala.resultado_atual && grupoAtual && (
        <Overlay>
          <div className={`rounded-3xl p-6 text-center border flex flex-col items-center gap-3 animate-pop-in ${
            sala.resultado_atual.correto
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : sala.resultado_atual.resposta_dada === '__timeout__'
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            {sala.resultado_atual.correto
              ? <Sparkles size={48} color="#34d399" strokeWidth={1.5} />
              : sala.resultado_atual.resposta_dada === '__timeout__'
                ? <Timer size={48} color="#fbbf24" strokeWidth={1.5} />
                : <Frown size={48} color="#f87171" strokeWidth={1.5} />}
            <p className={`text-xl font-black ${
              sala.resultado_atual.correto ? 'text-emerald-400'
              : sala.resultado_atual.resposta_dada === '__timeout__' ? 'text-amber-400'
              : 'text-red-400'
            }`}>
              {sala.resultado_atual.correto ? 'Acertou!' : sala.resultado_atual.resposta_dada === '__timeout__' ? 'Tempo esgotado!' : 'Errou!'}
              <span className="text-base font-normal opacity-60 ml-2">({grupoAtual.nome})</span>
            </p>
            {sala.resultado_atual.correto && (
              <p className="text-white font-bold text-lg">+{sala.resultado_atual.casas_avancadas} casas 🚀</p>
            )}
            {!sala.resultado_atual.correto && sala.resultado_atual.resposta_correta && (
              <p className="text-sm text-[#7D8590]">
                Certo: <strong className="text-white">{String(sala.resultado_atual.resposta_correta)}</strong>
              </p>
            )}
          </div>
        </Overlay>
      )}

      {/* Fim de jogo */}
      {sala.status === 'finalizado' && (
        <Overlay>
          <div className="rounded-3xl border overflow-hidden animate-pop-in" style={{ backgroundColor: '#161B22', borderColor: '#21262D' }}>
            <div className="px-6 pt-7 pb-5 flex flex-col items-center gap-2 text-center">
              <Trophy size={48} color="#FCD34D" strokeWidth={1.5} className="mb-1" />
              {(() => {
                const winner = [...grupos].sort((a, b) => b.posicao - a.posicao)[0];
                return winner ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#7D8590]">Grande vencedor</p>
                    <p className="font-black text-4xl leading-tight" style={{ color: winner.cor }}>
                      {winner.nome}
                    </p>
                    <p className="text-white text-sm">Casa {winner.posicao}</p>
                  </>
                ) : null;
              })()}
            </div>
            <div className="px-4 pb-5 flex flex-col gap-2 border-t border-[#21262D]">
              {[...grupos].sort((a, b) => b.posicao - a.posicao).map((g, i) => (
                <div key={g.id} className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                  style={{ backgroundColor: '#0D111799', borderColor: '#21262D' }}>
                  <span className="text-sm w-7 text-center font-bold text-[#7D8590]">
                    {i === 0 ? '1º' : i === 1 ? '2º' : i === 2 ? '3º' : `${i + 1}º`}
                  </span>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block', flexShrink: 0 }} />
                  <span className="font-bold flex-1 text-sm" style={{ color: g.cor }}>{g.nome}</span>
                  <span className="text-xs font-bold text-[#7D8590]">Casa {g.posicao}</span>
                </div>
              ))}
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(10px)', background: 'rgba(13,17,23,0.72)' }}>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
