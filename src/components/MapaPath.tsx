'use client';
import type { Grupo } from '@/lib/tipos';
import { CASAS_ESPECIAIS, TOTAL_CASAS } from '@/lib/constantes';

// ── Layout ──────────────────────────────────────────────────────────────────
// 3 columns creates the dramatic zigzag snake seen in Duolingo / Candy Crush
const W       = 320;
const COLS    = 3;
const COL_XS  = [58, 160, 262];
const ROW_H   = 100;
const ROWS    = Math.ceil(TOTAL_CASAS / COLS); // 17 rows for 50 nodes
const PAD_TOP = 72;
const PAD_BOT = 52;
const H       = ROWS * ROW_H + PAD_TOP + PAD_BOT;

function nodePos(n: number): { x: number; y: number } {
  const idx      = n - 1;
  const row      = Math.floor(idx / COLS);
  const posInRow = idx % COLS;
  // Even rows go left→right, odd rows go right→left (snake)
  const col      = row % 2 === 0 ? posInRow : (COLS - 1 - posInRow);
  return {
    x: COL_XS[col],
    y: H - PAD_BOT - row * ROW_H,
  };
}

// ── Smooth Catmull-Rom curve through every node ───────────────────────────
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

// ── Special node styles ───────────────────────────────────────────────────
const NODE: Record<string, { fill: string; stroke: string; icon: string }> = {
  checkpoint: { fill: '#78350F', stroke: '#F59E0B', icon: '⭐' },
  presente:   { fill: '#064E3B', stroke: '#10B981', icon: '🎁' },
  caveira:    { fill: '#7F1D1D', stroke: '#EF4444', icon: '💀' },
  duplo:      { fill: '#1E3A8A', stroke: '#60A5FA', icon: '🎯' },
  troca:      { fill: '#4C1D95', stroke: '#A78BFA', icon: '🔄' },
};

// Scattered star positions for background
const STARS = [
  [18,35],[298,52],[14,145],[310,190],[22,280],[305,330],[16,425],[314,470],
  [20,560],[308,605],[18,700],[312,750],[24,840],[306,892],[19,980],[316,1025],
  [22,1110],[302,1160],[20,1250],[310,1295],[15,1380],[298,1430],
];

export default function MapaPath({
  grupos, grupoAtual,
}: {
  grupos: Grupo[];
  grupoAtual?: string | null;
}) {
  const metaPos  = nodePos(TOTAL_CASAS);
  const startPos = nodePos(1);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', maxWidth: W, margin: '0 auto' }}
    >
      {/* Background */}
      <rect width={W} height={H} fill="#0D1117" />

      {/* Star field */}
      {STARS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.2}
          fill="#fff" opacity={0.08 + (i % 5) * 0.04} />
      ))}

      {/* ── Road layers (shadow → base → center → shimmer) ── */}
      <path d={PATH_D} fill="none" stroke="#000"    strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d={PATH_D} fill="none" stroke="#1E1B4B" strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#3730A3" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#6366F1" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#A5B4FC" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />

      {/* ── META (goal) ── */}
      <circle cx={metaPos.x} cy={PAD_TOP - 30} r={26} fill="#1C1917" stroke="#FCD34D" strokeWidth={3} />
      <text x={metaPos.x} y={PAD_TOP - 30} textAnchor="middle" dominantBaseline="middle" fontSize={22}>🏁</text>
      <text x={metaPos.x} y={PAD_TOP - 4}  textAnchor="middle" fontSize={10} fill="#FCD34D" fontWeight="bold" letterSpacing={2}>META</text>

      {/* ── Nodes ── */}
      {Array.from({ length: TOTAL_CASAS }, (_, i) => i + 1).map(num => {
        const { x, y } = nodePos(num);
        const especial  = CASAS_ESPECIAIS[num];
        const nd        = especial ? NODE[especial.tipo] : null;
        const r         = nd ? 30 : 22;
        const aqui      = grupos.filter(g => g.posicao === num);
        const hasActive = aqui.some(g => g.id === grupoAtual);

        return (
          <g key={num}>
            {/* Glow for active-turn group */}
            {hasActive && (
              <circle cx={x} cy={y} r={r + 18} fill="#FCD34D" opacity={0.12} />
            )}
            {/* Glow for special square */}
            {nd && (
              <circle cx={x} cy={y} r={r + 14} fill={nd.stroke} opacity={0.18} />
            )}

            {/* Drop shadow */}
            <circle cx={x} cy={y + 5} r={r} fill="#000" opacity={0.4} />

            {/* Node body */}
            <circle cx={x} cy={y} r={r}
              fill={nd ? nd.fill : '#1E1B4B'}
              stroke={nd ? nd.stroke : (hasActive ? '#FCD34D' : '#4338CA')}
              strokeWidth={nd ? 3.5 : (hasActive ? 3 : 2.5)}
            />

            {/* Highlight shine */}
            {!nd && <circle cx={x} cy={y - r * 0.33} r={r * 0.42} fill="white" opacity={0.07} />}

            {/* Content */}
            {nd ? (
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={24}>{nd.icon}</text>
            ) : (
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight="bold" fill={hasActive ? '#FCD34D' : '#818CF8'}>{num}</text>
            )}

            {/* Group tokens above the node */}
            {aqui.map((g, gi) => {
              const cols2 = aqui.length === 1 ? 1 : 2;
              const tx = aqui.length === 1 ? x : (gi % cols2 === 0 ? x - 18 : x + 18);
              const ty = y - r - 20 - Math.floor(gi / cols2) * 34;
              const isActive = g.id === grupoAtual;
              return (
                <g key={g.id}>
                  <circle cx={tx} cy={ty + 4} r={15} fill="#000" opacity={0.45} />
                  <circle cx={tx} cy={ty} r={15}
                    fill={g.cor}
                    stroke={isActive ? '#FCD34D' : '#fff'}
                    strokeWidth={isActive ? 3.5 : 2}
                  />
                  {isActive && (
                    <circle cx={tx} cy={ty} r={19} fill="none" stroke="#FCD34D" strokeWidth={2} opacity={0.5} strokeDasharray="4 3" />
                  )}
                  <text x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="middle" fontSize={16}>{g.emoji}</text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* ── START label ── */}
      <text x={startPos.x} y={H - 12} textAnchor="middle" fontSize={10} fill="#4338CA" fontWeight="bold">🚀 START</text>
    </svg>
  );
}
