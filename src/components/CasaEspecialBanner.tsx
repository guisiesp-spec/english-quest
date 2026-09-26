'use client';
import type { CasaEspecial } from '@/lib/tipos';

interface Props {
  casa: CasaEspecial;
  grupos?: { id: string; nome: string; cor: string; emoji: string }[];
  onTrocar?: (grupoId: string) => void;
  onContinuar: () => void;
}

export default function CasaEspecialBanner({ casa, grupos, onTrocar, onContinuar }: Props) {
  const cores: Record<string, string> = {
    checkpoint: 'bg-yellow-50 border-yellow-300',
    presente:   'bg-green-50 border-green-300',
    caveira:    'bg-red-50 border-red-300',
    duplo:      'bg-blue-50 border-blue-300',
    troca:      'bg-purple-50 border-purple-300',
  };

  return (
    <div className={`rounded-2xl border-2 p-6 text-center ${cores[casa.tipo] ?? 'bg-slate-50 border-slate-200'}`}>
      <div className="text-5xl mb-2">{casa.emoji}</div>
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
              {g.emoji} {g.nome}
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
