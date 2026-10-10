'use client';
import { BookOpen, MessageSquare, Clock, Zap, Shuffle } from 'lucide-react';
import type { CategoriasDado } from '@/lib/tipos';
import { DADO_CONFIG } from '@/lib/constantes';

interface Props {
  onEscolher: (categoria: CategoriasDado) => void;
}

const OPCOES: CategoriasDado[] = ['grammar', 'vocabulary', 'time_place', 'challenge'];

const CAT_ICONS = {
  grammar:    BookOpen,
  vocabulary: MessageSquare,
  time_place: Clock,
  challenge:  Zap,
  wild:       Shuffle,
} as const;

export default function WildCard({ onEscolher }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <Shuffle size={44} color="#a855f7" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-black" style={{ color: '#a855f7' }}>CARTA CURINGA!</h2>
        <p className="text-sm mt-1" style={{ color: '#7D8590' }}>Escolha a categoria que quer responder:</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {OPCOES.map((cat) => {
          const config = DADO_CONFIG.find((d) => d.categoria === cat)!;
          const Icon   = CAT_ICONS[cat as keyof typeof CAT_ICONS];
          return (
            <button
              key={cat}
              onClick={() => onEscolher(cat)}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-left transition-all active:scale-95"
              style={{ backgroundColor: config.corBg + '33', borderColor: config.cor, color: config.cor }}
            >
              {Icon && <Icon size={22} color={config.cor} strokeWidth={2} />}
              <span className="text-base">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
