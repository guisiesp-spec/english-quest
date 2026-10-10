'use client';
import type { Grupo } from '@/lib/tipos';
import { TOTAL_CASAS } from '@/lib/constantes';

// ── Layout — 6 columns, 300 squares ──────────────────────────────────────────
export const MAPA_W  = 320;
const COLS    = 6;
const COL_XS  = [24, 78, 133, 187, 242, 296];
const ROW_H   = 80;
const ROWS    = Math.ceil(TOTAL_CASAS / COLS);
const PAD_TOP = 72;
const PAD_BOT = 52;
export const MAPA_H  = ROWS * ROW_H + PAD_TOP + PAD_BOT;

const NODE_R = 16;

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
    const t  = 0.35;
    const c1x = (p1.x + (p2.x - p0.x) * t).toFixed(1);
    const c1y = (p1.y + (p2.y - p0.y) * t).toFixed(1);
    const c2x = (p2.x - (p3.x - p1.x) * t).toFixed(1);
    const c2y = (p2.y - (p3.y - p1.y) * t).toFixed(1);
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

const PATH_D = makePath();

// Procedurally distributed stars across the full board height
const STAR_COUNT = 120;
const starField = Array.from({ length: STAR_COUNT }, (_, i) => ({
  cx: ((i * 137.508) % (MAPA_W - 10)) + 5,
  cy: ((i * 97.3 + 41) % (MAPA_H - 10)) + 5,
  r: i % 4 === 0 ? 2 : 1.2,
  op: 0.06 + (i % 6) * 0.025,
}));

export default function MapaPath({
  grupos,
  grupoAtual,
}: {
  grupos: Grupo[];
  grupoAtual?: string | null;
  meuGrupoId?: string | null;
}) {
  const metaPos  = { x: nodePos(TOTAL_CASAS).x, y: PAD_TOP - 30 };
  const startPos = nodePos(1);

  return (
    <svg
      viewBox={`0 0 ${MAPA_W} ${MAPA_H}`}
      width="100%"
      style={{ display: 'block', maxWidth: MAPA_W, margin: '0 auto' }}
    >
      {/* Background */}
      <rect width={MAPA_W} height={MAPA_H} fill="#0D1117" />

      {/* Star field */}
      {starField.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
      ))}

      {/* Road layers */}
      <path d={PATH_D} fill="none" stroke="#000"    strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
      <path d={PATH_D} fill="none" stroke="#1E1B4B" strokeWidth={21} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#3730A3" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#6366F1" strokeWidth={7}  strokeLinecap="round" strokeLinejoin="round" />
      <path d={PATH_D} fill="none" stroke="#A5B4FC" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />

      {/* META */}
      <circle cx={metaPos.x} cy={metaPos.y} r={22} fill="#1C1917" stroke="#FCD34D" strokeWidth={3} />
      <text x={metaPos.x} y={metaPos.y} textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="#FCD34D" fontWeight="bold">FIM</text>
      <text x={metaPos.x} y={PAD_TOP - 4} textAnchor="middle" fontSize={9} fill="#FCD34D" fontWeight="bold" letterSpacing={2}>META</text>

      {/* Nodes */}
      {Array.from({ length: TOTAL_CASAS }, (_, i) => i + 1).map(num => {
        const { x, y } = nodePos(num);
        const hasActive = grupos.some(g => g.posicao === num && g.id === grupoAtual);
        const fontSize  = num >= 100 ? 7 : num >= 10 ? 9 : 10;

        return (
          <g key={num}>
            {hasActive && <circle cx={x} cy={y} r={NODE_R + 14} fill="#FCD34D" opacity={0.12} />}
            <circle cx={x} cy={y + 4} r={NODE_R} fill="#000" opacity={0.4} />
            <circle
              cx={x} cy={y} r={NODE_R}
              fill="#1E1B4B"
              stroke={hasActive ? '#FCD34D' : '#4338CA'}
              strokeWidth={hasActive ? 2.5 : 2}
            />
            <circle cx={x} cy={y - NODE_R * 0.33} r={NODE_R * 0.42} fill="white" opacity={0.07} />
            <text
              x={x} y={y + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize} fontWeight="bold"
              fill={hasActive ? '#FCD34D' : '#818CF8'}
            >
              {num}
            </text>
          </g>
        );
      })}

      {/* START */}
      <text x={startPos.x} y={MAPA_H - 12} textAnchor="middle" fontSize={10} fill="#4338CA" fontWeight="bold">START</text>
    </svg>
  );
}
