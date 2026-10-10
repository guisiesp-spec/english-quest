'use client';
import { useState, useRef } from 'react';
import type { CategoriasDado } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

interface Props {
  onRolar: (categoria: CategoriasDado) => void;
  disabled?: boolean;
  categoriaForçada?: CategoriasDado | null;
}

const FACES: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge', 'wild', 'mystery'];

// Cube rotation to bring each face to the front
const FACE_SHOW: Record<CategoriasDado, { x: number; y: number }> = {
  grammar:    { x: 0,   y: 0   },
  vocabulary: { x: 0,   y: 180 },
  time_place: { x: 0,   y: -90 },
  challenge:  { x: 0,   y: 90  },
  wild:       { x: 90,  y: 0   },
  mystery:    { x: -90, y: 0   },
};

// Face CSS transform (builds the cube geometry, 55 = half of 110px)
const FACE_TRANSFORMS: Record<CategoriasDado, string> = {
  grammar:    'translateZ(55px)',
  vocabulary: 'rotateY(180deg) translateZ(55px)',
  time_place: 'rotateY(90deg) translateZ(55px)',
  challenge:  'rotateY(-90deg) translateZ(55px)',
  wild:       'rotateX(-90deg) translateZ(55px)',
  mystery:    'rotateX(90deg) translateZ(55px)',
};

export default function Dado({ onRolar, disabled, categoriaForçada }: Props) {
  const [rot, setRot] = useState({ x: -20, y: 20 });
  const [settling, setSettling] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [resultado, setResultado] = useState<CategoriasDado | null>(null);
  const rotRef = useRef({ x: -20, y: 20 });

  async function rolar() {
    if (disabled || rolling) return;
    setRolling(true);
    setSettling(false);
    setResultado(null);

    const sorteada: CategoriasDado = categoriaForçada ?? FACES[Math.floor(Math.random() * FACES.length)];

    let currX = rotRef.current.x;
    let currY = rotRef.current.y;
    let ticks = 0;

    const interval = setInterval(() => {
      currX += 60 + Math.floor(Math.random() * 120);
      currY += 40 + Math.floor(Math.random() * 120);
      setRot({ x: currX, y: currY });
      ticks++;

      if (ticks >= 12) {
        clearInterval(interval);
        setSettling(true);

        const target = FACE_SHOW[sorteada];
        const finalX = Math.ceil(currX / 360) * 360 + target.x;
        const finalY = Math.ceil(currY / 360) * 360 + target.y;
        rotRef.current = { x: finalX, y: finalY };
        setRot({ x: finalX, y: finalY });
        setResultado(sorteada);

        setTimeout(() => {
          setRolling(false);
          setTimeout(() => onRolar(sorteada), 400);
        }, 750);
      }
    }, 150);
  }

  const config = resultado ? DADO_CONFIG.find(d => d.categoria === resultado) : null;

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={rolar}
        disabled={disabled || rolling}
        className={`cursor-pointer select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        style={{ background: 'none', border: 'none', padding: '0 0 24px 0' }}
        aria-label="Rolar dado"
      >
        <div
          className={`dice-scene${rolling && !settling ? ' dice-rolling' : ''}`}
          style={{ filter: config ? `drop-shadow(0 0 20px ${config.cor}88)` : 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))' }}
        >
          <div
            className="dice-cube"
            style={{
              transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
              transition: settling
                ? 'transform 0.75s cubic-bezier(0.25, 0.1, 0.25, 1)'
                : rolling
                  ? 'transform 0.09s linear'
                  : 'none',
            }}
          >
            {FACES.map(cat => {
              const cfg = DADO_CONFIG.find(d => d.categoria === cat)!;
              return (
                <div
                  key={cat}
                  className="dice-face"
                  style={{
                    transform: FACE_TRANSFORMS[cat],
                    backgroundColor: cfg.corBg,
                  }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1, fontWeight: 700, color: cfg.cor }}>{cfg.label.slice(0, 4)}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: cfg.cor, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </button>

      <div style={{ height: 22, textAlign: 'center' }}>
        {rolling && !settling && (
          <p className="text-slate-400 text-sm animate-pulse">Rolando…</p>
        )}
        {!rolling && !resultado && (
          <p className="text-slate-400 text-sm animate-pulse">Toque no dado!</p>
        )}
        {resultado && config && (
          <p className="text-sm font-bold animate-pop-in" style={{ color: config.cor }}>
            {config.label}!
          </p>
        )}
      </div>
    </div>
  );
}
