'use client';
import type { CategoriasDado } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

interface Props {
  onEscolher: (categoria: CategoriasDado) => void;
}

const OPCOES: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge'];

export default function WildCard({ onEscolher }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="text-5xl mb-2">🃏</div>
        <h2 className="text-xl font-black text-purple-700">WILD CARD!</h2>
        <p className="text-slate-500 text-sm mt-1">Escolha a categoria que quer responder:</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {OPCOES.map((cat) => {
          const config = DADO_CONFIG.find((d) => d.categoria === cat)!;
          return (
            <button
              key={cat}
              onClick={() => onEscolher(cat)}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-left transition-all active:scale-95 hover:scale-102"
              style={{ backgroundColor: config.corBg, borderColor: config.cor, color: config.cor }}
            >
              <span className="text-2xl">{config.emoji}</span>
              <span className="text-lg">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
