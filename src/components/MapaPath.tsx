'use client';
import { useRef, useEffect } from 'react';
import type { Grupo } from '@/lib/tipos';
import { CASAS_ESPECIAIS, TOTAL_CASAS } from '@/lib/constantes';

// ── Layout ──────────────────────────────────────────────────────────────────
export const MAPA_W  = 320;
const COLS    = 3;
const COL_XS  = [58, 160, 262];
const ROW_H   = 100;
const ROWS    = Math.ceil(TOTAL_CASAS / COLS);
const PAD_TOP = 72;
const PAD_BOT = 52;
export const MAPA_H  = ROWS * ROW_H + PAD_TOP + PAD_BOT;

export function nodePos(n: number): { x: number; y: number } {
  const idx      = Math.max(0, n - 1);
  const row      = Math.floor(idx / COLS);
  const posInRow = idx % COLS;
  const col      = row % 2 === 0 ? posInRow : (COLS - 1 - posInRow);
  return {
    x: COL_XS[col],
    y: MAPA_H - PAD_BOT - row * ROW_H,
  };
}

function makePath(): string {
  const pts = Array.from({ length: TOTAL_CASAS }, (_, i) => nodePos(i + 1));
  let d     = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t  = 0.38;
    const c1x = (p1.x + (p2.x - p0.x) * t).toFixed(1);
    const c1y = (p1.y + (p2.y - p0.y) * t).toFixed(1);
    const c2x = (p2.x - (p3.x - p1.x) * t).toFixed(1);
    const c2y = (p2.y - (p3.y - p1.y) * t).toFixed(1);
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

const PATH_D = makePath();

const NODE: Record<string, { fill: string; stroke: string; icon: string }> = {
  checkpoint: { fill: '#78350F', stroke: '#F59E0B', icon: '⭐' },
  presente:   { fill: '#064E3B', stroke: '#10B981', icon: '🎁' },
  caveira:    { fill: '#7F1D1D', stroke: '#EF4444', icon: '💀' },
  duplo:      { fill: '#1E3A8A', stroke: '#60A5FA', icon: '🎯' },
  troca:      { fill: '#4C1D95', stroke: '#A78BFA', icon: '🔄' },
};

const STARS = [
  [18,35],[298,52],[14,145],[310,190],[22,280],[305,330],[16,425],[314,470],
  [20,560],[308,605],[18,700],[312,750],[24,840],[306,892],[19,980],[316,1025],
  [22,1110],[302,1160],[20,1250],[310,1295],[15,1380],[298,1430],
];

// ── Token position helper ───────────────────────────────────────────────────
function tokenCoords(grupo: Grupo, allGrupos: Grupo[]): { tx: number; ty: number } {
  const pos    = Math.max(1, grupo.posicao);
  const { x, y } = nodePos(pos);
  const especial = CASAS_ESPECIAIS[pos];
  const r      = especial ? 30 : 22;
  const aqui   = allGrupos.filter(g => g.posicao === pos);
  const myIdx  = aqui.findIndex(g => g.id === grupo.id);
  const cols2  = aqui.length === 1 ? 1 : 2;
  const tx     = aqui.length === 1 ? x : (myIdx % cols2 === 0 ? x - 18 : x + 18);
  const ty     = y - r - 20 - Math.floor(myIdx / cols2) * 34;
  return { tx, ty };
}

export default function MapaPath({
  grupos,
  grupoAtual,
  meuGrupoId,
}: {
  grupos: Grupo[];
  grupoAtual?: string | null;
  meuGrupoId?: string | null;
}) {
  const metaPos  = { x: nodePos(TOTAL_CASAS).x, y: PAD_TOP - 30 };
  const startPos = nodePos(1);

  // Track previous token positions for smooth animation
  const prevCoordsRef = useRef<Map<string, { tx: number; ty: number }>>(new Map());

  useEffect(() => {
    grupos.forEach(g => {
      const coords = tokenCoords(g, grupos);
      prevCoordsRef.current.set(g.id, coords);
    });
  });

  return (
    <svg
      viewBox={`0 0 ${MAPA_W} ${MAPA_H}`}
      width="100%"
      style={{ display: 'block', maxWidth: MAPA_W, margin: '0 auto' }}
    >
      {/* Background */}
      <rect width={MAPA_W} height={MAPA_H} fill="#0D1117" />

      {/* Star field */}
      {STARS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.2}
          fill="#fff" opacity={0.08 + (i % 5) * 0.04} />
      ))}

      {/* Road layers */}
      <path d={PATH_D} fill="none" stroke="#000"    strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d={PATH_D} fill="none" stroke="#1E1B4B" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#3730A3" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#6366F1" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#A5B4FC" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />

      {/* META */}
      <circle cx={metaPos.x} cy={metaPos.y} r={26} fill="#1C1917" stroke="#FCD34D" strokeWidth={3} />
      <text x={metaPos.x} y={metaPos.y} textAnchor="middle" dominantBaseline="middle" fontSize={22}>🏁</text>
      <text x={metaPos.x} y={PAD_TOP - 4} textAnchor="middle" fontSize={10} fill="#FCD34D" fontWeight="bold" letterSpacing={2}>META</text>

      {/* Nodes */}
      {Array.from({ length: TOTAL_CASAS }, (_, i) => i + 1).map(num => {
        const { x, y } = nodePos(num);
        const especial  = CASAS_ESPECIAIS[num];
        const nd        = especial ? NODE[especial.tipo] : null;
        const r         = nd ? 30 : 22;
        const hasActive = grupos.some(g => g.posicao === num && g.id === grupoAtual);

        return (
          <g key={num}>
            {hasActive && <circle cx={x} cy={y} r={r + 18} fill="#FCD34D" opacity={0.12} />}
            {nd && <circle cx={x} cy={y} r={r + 14} fill={nd.stroke} opacity={0.18} />}
            <circle cx={x} cy={y + 5} r={r} fill="#000" opacity={0.4} />
            <circle cx={x} cy={y} r={r}
              fill={nd ? nd.fill : '#1E1B4B'}
              stroke={nd ? nd.stroke : (hasActive ? '#FCD34D' : '#4338CA')}
              strokeWidth={nd ? 3.5 : (hasActive ? 3 : 2.5)}
            />
            {!nd && <circle cx={x} cy={y - r * 0.33} r={r * 0.42} fill="white" opacity={0.07} />}
            {nd ? (
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={24}>{nd.icon}</text>
            ) : (
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight="bold" fill={hasActive ? '#FCD34D' : '#818CF8'}>{num}</text>
            )}
          </g>
        );
      })}

      {/* Group tokens — rendered separately so CSS transition works across position changes */}
      {grupos.map(g => {
        const { tx, ty } = tokenCoords(g, grupos);
        const isActive = g.id === grupoAtual;
        const isMine   = g.id === meuGrupoId;
        const r        = isMine ? 17 : 15;

        return (
          <g
            key={g.id}
            style={{
              transform: `translate(${tx}px, ${ty}px)`,
              transition: 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Shadow */}
            <circle cx={0} cy={4} r={r} fill="#000" opacity={0.45} />
            {/* Active glow */}
            {isActive && <circle cx={0} cy={0} r={r + 8} fill="#FCD34D" opacity={0.2} />}
            {/* My piece glow */}
            {isMine && !isActive && <circle cx={0} cy={0} r={r + 6} fill={g.cor} opacity={0.25} />}
            {/* Body */}
            <circle
              cx={0} cy={0} r={r}
              fill={g.cor}
              stroke={isActive ? '#FCD34D' : isMine ? '#ffffff' : '#ffffff99'}
              strokeWidth={isActive ? 3.5 : isMine ? 3 : 2}
            />
            {/* Dashed ring for active team */}
            {isActive && (
              <circle cx={0} cy={0} r={r + 4} fill="none" stroke="#FCD34D"
                strokeWidth={2} opacity={0.6} strokeDasharray="4 3" />
            )}
            {/* Emoji */}
            <text x={0} y={1} textAnchor="middle" dominantBaseline="middle"
              fontSize={isMine ? 18 : 16}>{g.emoji}</text>
          </g>
        );
      })}

      {/* START */}
      <text x={startPos.x} y={MAPA_H - 12} textAnchor="middle" fontSize={10} fill="#4338CA" fontWeight="bold">🚀 START</text>
    </svg>
  );
}
