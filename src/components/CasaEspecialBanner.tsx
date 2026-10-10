'use client';
import { Star, Gift, Skull, Target, ArrowLeftRight } from 'lucide-react';
import type { CasaEspecial } from '@/lib/tipos';

interface Props {
  casa: CasaEspecial;
  grupos?: { id: string; nome: string; cor: string; emoji: string }[];
  onTrocar?: (grupoId: string) => void;
  onContinuar: () => void;
}

const TIPO_ICONS: Record<string, React.ElementType> = {
  checkpoint: Star,
  presente:   Gift,
  caveira:    Skull,
  duplo:      Target,
  troca:      ArrowLeftRight,
};

const TIPO_CORES: Record<string, string> = {
  checkpoint: '#eab308',
  presente:   '#22c55e',
  caveira:    '#ef4444',
  duplo:      '#3b82f6',
  troca:      '#a855f7',
};

export default function CasaEspecialBanner({ casa, grupos, onTrocar, onContinuar }: Props) {
  const cores: Record<string, string> = {
    checkpoint: 'bg-yellow-50 border-yellow-300',
    presente:   'bg-green-50 border-green-300',
    caveira:    'bg-red-50 border-red-300',
    duplo:      'bg-blue-50 border-blue-300',
    troca:      'bg-purple-50 border-purple-300',
  };

  const Icon = TIPO_ICONS[casa.tipo];
  const iconColor = TIPO_CORES[casa.tipo] ?? '#64748b';

  return (
    <div className={`rounded-2xl border-2 p-6 text-center ${cores[casa.tipo] ?? 'bg-slate-50 border-slate-200'}`}>
      <div className="flex justify-center mb-2">
        {Icon && <Icon size={48} color={iconColor} strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl font-black text-slate-800">{casa.descricao}</h3>

      {casa.tipo === 'troca' && grupos && grupos.length > 1 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-slate-500 font-medium">Escolha um grupo para trocar de posição:</p>
          {grupos.map((g) => (
            <button
              key={g.id}
              onClick={() => onTrocar?.(g.id)}
              className="flex items-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all active:scale-95"
              style={{ borderColor: g.cor, color: g.cor, backgroundColor: g.cor + '15' }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: g.cor, display: 'inline-block', flexShrink: 0 }} />
              {g.nome}
            </button>
          ))}
        </div>
      )}

      {casa.tipo !== 'troca' && (
        <button
          onClick={onContinuar}
          className="mt-4 bg-slate-700 text-white font-bold px-6 py-2 rounded-xl hover:bg-slate-600 active:scale-95"
        >
          Continuar →
        </button>
      )}
    </div>
  );
}
