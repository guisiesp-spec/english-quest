'use client';
import { useRef, useEffect } from 'react';
import type { Grupo } from '@/lib/tipos';
import MapaPath from './MapaPath';

interface Props {
  grupos: Grupo[];
  grupoAtual: string | null | undefined;
  meuGrupoId: string | null;
  onFechar: () => void;
}

const LEGENDA = [
  { icon: '⭐', label: 'Checkpoint',    color: '#F59E0B', desc: 'Guarda sua posição' },
  { icon: '🎁', label: '+2 casas',      color: '#10B981', desc: 'Avança de bônus'    },
  { icon: '💀', label: '−3 casas',      color: '#EF4444', desc: 'Volta para trás'    },
  { icon: '🎯', label: 'Turno duplo',   color: '#60A5FA', desc: 'Joga de novo'       },
  { icon: '🔄', label: 'Troca posição', color: '#A78BFA', desc: 'Troca com alguém'   },
];

export default function MapaModal({ grupos, grupoAtual, meuGrupoId, onFechar }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sorted    = [...grupos].sort((a, b) => b.posicao - a.posicao);
  const MEDALS    = ['🥇', '🥈', '🥉'];

  // Scroll to bottom (START) on open, so players see their position first
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#0D1117' }}>

      {/* ── HEADER ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 pt-12 pb-4 border-b border-[#21262D]">
        <div>
          <h2 className="text-white font-black text-xl">Mapa do Jogo</h2>
          <p className="text-[#7D8590] text-xs mt-0.5">Role para cima → chegue à meta</p>
        </div>
        <button
          onClick={onFechar}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#7D8590] hover:text-white transition-all"
          style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}
        >
          ✕
        </button>
      </div>

      {/* ── LEADERBOARD ── */}
      {grupos.length > 0 && (
        <div className="flex-shrink-0 flex gap-2 px-4 py-3 overflow-x-auto border-b border-[#21262D]"
          style={{ scrollbarWidth: 'none' }}>
          {sorted.map((g, i) => {
            const isMe   = g.id === meuGrupoId;
            const isTurn = g.id === grupoAtual;
            return (
              <div
                key={g.id}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[72px] py-3 rounded-2xl border transition-all"
                style={{
                  backgroundColor: isMe ? g.cor + '1A' : '#161B22',
                  borderColor:     isMe ? g.cor + 'AA' : (isTurn ? g.cor + '55' : '#21262D'),
                }}
              >
                <span className="text-[10px] font-semibold" style={{ color: isMe ? g.cor : '#7D8590' }}>
                  {MEDALS[i] ?? `${i + 1}º`}
                </span>
                <span className="text-2xl leading-none">{g.emoji}</span>
                <span className="text-[11px] font-black text-white">
                  {g.posicao}<span className="text-[#30363D] font-normal">/50</span>
                </span>
                {isMe && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: g.cor + '33', color: g.cor }}>
                    você
                  </span>
                )}
                {isTurn && !isMe && (
                  <span className="text-[9px] font-bold animate-pulse" style={{ color: g.cor }}>▶ vez</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── MAP (scrollable, starts at bottom) ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4">

        {/* Direction hint at top */}
        <div className="flex items-center justify-center gap-2 mb-2 opacity-40">
          <span className="text-xs text-[#7D8590]">🏁 meta</span>
        </div>

        <MapaPath grupos={grupos} grupoAtual={grupoAtual} />

        {/* Direction hint at bottom */}
        <div className="flex items-center justify-center gap-2 mt-2 mb-4 opacity-40">
          <span className="text-xs text-[#7D8590]">🚀 início</span>
        </div>

        {/* ── LEGENDA ── */}
        <div className="mx-3 mb-6">
          <p className="text-[#7D8590] text-[10px] font-semibold uppercase tracking-widest mb-3 text-center">
            Casas especiais
          </p>
          <div className="grid grid-cols-1 gap-2">
            {LEGENDA.map(({ icon, label, color, desc }) => (
              <div key={label}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 border"
                style={{ backgroundColor: '#161B22', borderColor: '#21262D' }}>
                <span className="text-lg w-6 text-center flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold" style={{ color }}>{label}</span>
                  <span className="text-[#7D8590] text-xs ml-2">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
