'use client';
import { useState } from 'react';
import type { CategoriasDado } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

interface Props {
  onRolar: (categoria: CategoriasDado) => void;
  disabled?: boolean;
  categoriaForçada?: CategoriasDado | null;
}

export default function Dado({ onRolar, disabled, categoriaForçada }: Props) {
  const [rolando, setRolando] = useState(false);
  const [faceAtual, setFaceAtual] = useState<CategoriasDado | null>(null);
  const [animCount, setAnimCount] = useState(0);

  async function rolar() {
    if (disabled || rolando) return;
    setRolando(true);
    setFaceAtual(null);

    let sorteada: CategoriasDado;
    if (categoriaForçada) {
      sorteada = categoriaForçada;
    } else {
      const faces: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge', 'wild', 'mystery'];
      sorteada = faces[Math.floor(Math.random() * faces.length)];
    }

    // Animação: mostra faces aleatórias por 1.5s
    let ticks = 0;
    const interval = setInterval(() => {
      const faces: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge', 'wild', 'mystery'];
      setFaceAtual(faces[Math.floor(Math.random() * faces.length)]);
      setAnimCount((c) => c + 1);
      ticks++;
      if (ticks >= 10) {
        clearInterval(interval);
        setFaceAtual(sorteada);
        setRolando(false);
        setTimeout(() => onRolar(sorteada), 400);
      }
    }, 140);
  }

  const config = faceAtual ? DADO_CONFIG.find((d) => d.categoria === faceAtual) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={rolar}
        disabled={disabled || rolando}
        className={`
          relative w-36 h-36 rounded-2xl border-4 shadow-xl
          flex flex-col items-center justify-center gap-1
          text-5xl font-black select-none transition-all duration-150
          ${rolando ? 'scale-95 animate-bounce' : 'hover:scale-105 active:scale-95'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          backgroundColor: config ? config.corBg : '#f1f5f9',
          borderColor: config ? config.cor : '#94a3b8',
        }}
      >
        <span style={{ filter: rolando ? 'blur(1px)' : 'none', transition: 'filter 0.1s' }}>
          {config ? config.emoji : '🎲'}
        </span>
        {config && (
          <span
            className="text-xs font-bold tracking-wide"
            style={{ color: config.cor, fontSize: '11px' }}
          >
            {config.label}
          </span>
        )}
        {!config && !rolando && (
          <span className="text-sm font-bold text-slate-400">ROLAR</span>
        )}
      </button>

      {!disabled && !rolando && !faceAtual && (
        <p className="text-slate-500 text-sm animate-pulse">Toque no dado para rolar!</p>
      )}
      {rolando && (
        <p className="text-slate-500 text-sm">Rolando...</p>
      )}
    </div>
  );
}
