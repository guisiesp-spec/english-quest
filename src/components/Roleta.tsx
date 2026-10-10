'use client';
import { useState, useRef } from 'react';
import { BookOpen, MessageSquare, Clock, Zap, Shuffle, HelpCircle } from 'lucide-react';
import type { CategoriasDado } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

interface Props {
  onRolar: (categoria: CategoriasDado) => void;
  disabled?: boolean;
  categoriaForçada?: CategoriasDado | null;
}

const FACES: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge', 'wild', 'mystery'];
const N = FACES.length;
const SEG = 360 / N;

// Each category's Lucide icon
const CAT_ICONS = {
  grammar:    BookOpen,
  vocabulary: MessageSquare,
  time_place: Clock,
  challenge:  Zap,
  wild:       Shuffle,
  mystery:    HelpCircle,
} as const;

const CX = 120, CY = 120, R = 102;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function polarXY(r: number, deg: number) {
  return { x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) };
}
function wedgePath(startDeg: number, endDeg: number) {
  const s = polarXY(R, startDeg);
  const e = polarXY(R, endDeg);
  return `M ${CX} ${CY} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
}

// Landing angle so that wedge i is under the top pointer.
// Wedge i center (no rotation): -90 + i*SEG + SEG/2
// We need: (-90 + i*SEG + SEG/2 + θ) ≡ -90 (mod 360)  →  θ ≡ -(i*SEG + SEG/2) (mod 360)
function landingOffset(i: number) {
  return (-(i * SEG + SEG / 2) % 360 + 360) % 360;
}

export default function Roleta({ onRolar, disabled, categoriaForçada }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning]   = useState(false);
  const [settling, setSettling]   = useState(false);
  const [result, setResult]       = useState<CategoriasDado | null>(null);
  const rotRef = useRef(0);

  function spin() {
    if (spinning || disabled) return;
    const sorteada: CategoriasDado = categoriaForçada ?? FACES[Math.floor(Math.random() * N)];
    const i = FACES.indexOf(sorteada);

    setSpinning(true);
    setSettling(false);
    setResult(null);

    let angle = rotRef.current;
    let ticks = 0;

    const interval = setInterval(() => {
      angle += 28 + Math.random() * 18;
      setRotation(angle);
      ticks++;
      if (ticks >= 22) {
        clearInterval(interval);
        // Snap to exact landing position with CSS ease-out
        const base = Math.ceil(angle / 360) * 360;
        const finalAngle = base + landingOffset(i);
        rotRef.current = finalAngle;
        setSettling(true);
        setRotation(finalAngle);
        setTimeout(() => {
          setSpinning(false);
          setResult(sorteada);
          setTimeout(() => onRolar(sorteada), 500);
        }, 1200);
      }
    }, 75);
  }

  const cfg = result ? DADO_CONFIG.find(d => d.categoria === result) : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={spin}
        disabled={disabled || spinning}
        aria-label="Girar roleta"
        style={{ background: 'none', border: 'none', padding: 0, cursor: disabled || spinning ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 }}
      >
        <svg width={240} height={248} viewBox="0 0 240 248" style={{ display: 'block', overflow: 'visible' }}>
          {/* Outer ring shadow */}
          <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke="#0D1117" strokeWidth={12} />

          {/* Rotating group */}
          <g
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              transform: `rotate(${rotation}deg)`,
              transition: settling ? 'transform 1.15s cubic-bezier(0.22, 0.61, 0.36, 1)' : 'none',
            }}
          >
            {FACES.map((cat, i) => {
              const c    = DADO_CONFIG.find(d => d.categoria === cat)!;
              const s    = -90 + i * SEG;
              const e    = s + SEG;
              const mid  = s + SEG / 2;
              const icon = polarXY(R * 0.57, mid);
              const Icon = CAT_ICONS[cat];
              return (
                <g key={cat}>
                  <path d={wedgePath(s, e)} fill={c.cor} stroke="#0D1117" strokeWidth={2.5} />
                  {/* Lucide icon inside wedge via foreignObject */}
                  <foreignObject x={icon.x - 14} y={icon.y - 14} width={28} height={28} style={{ overflow: 'visible' }}>
                    {/* @ts-expect-error foreignObject body uses HTML namespace */}
                    <div xmlns="http://www.w3.org/1999/xhtml"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <Icon size={20} color="#fff" strokeWidth={2.5} />
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Center cap */}
            <circle cx={CX} cy={CY} r={20} fill="#161B22" stroke="#30363D" strokeWidth={2} />
            <circle cx={CX} cy={CY} r={6} fill="#30363D" />
          </g>

          {/* Outer border ring (non-rotating) */}
          <circle cx={CX} cy={CY} r={R + 3} fill="none" stroke="#30363D" strokeWidth={6} />

          {/* Pointer triangle at top */}
          <polygon
            points={`${CX - 11},${CY - R - 8} ${CX + 11},${CY - R - 8} ${CX},${CY - R + 6}`}
            fill="#FCD34D"
          />
          <polygon
            points={`${CX - 11},${CY - R - 8} ${CX + 11},${CY - R - 8} ${CX},${CY - R + 6}`}
            fill="none" stroke="#B45309" strokeWidth={1.5}
          />

          {/* Result label */}
          {cfg && (
            <text x={CX} y={CY + R + 30} textAnchor="middle" fontSize={13} fontWeight="bold" fill={cfg.cor}>
              {cfg.label}!
            </text>
          )}
        </svg>
      </button>

      <div style={{ height: 20, textAlign: 'center' }}>
        {spinning && !settling && (
          <p className="text-sm animate-pulse" style={{ color: '#7D8590' }}>Girando…</p>
        )}
        {!spinning && !result && (
          <p className="text-sm animate-pulse" style={{ color: '#7D8590' }}>Toque para girar!</p>
        )}
      </div>
    </div>
  );
}
