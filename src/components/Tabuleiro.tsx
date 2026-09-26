'use client';
import type { Grupo } from '@/lib/tipos';
import { CASAS_ESPECIAIS, TOTAL_CASAS } from '@/lib/constantes';

interface Props {
  grupos: Grupo[];
  grupoAtual?: string | null;
  compact?: boolean; // professor panel usa compact
}

const CASAS_POR_LINHA = 5; // 5×10 = 50, casas muito maiores

function buildLinhas(): number[][] {
  const linhas: number[][] = [];
  for (let l = 0; l < TOTAL_CASAS / CASAS_POR_LINHA; l++) {
    const inicio = l * CASAS_POR_LINHA + 1;
    const linha = Array.from({ length: CASAS_POR_LINHA }, (_, i) => inicio + i);
    if (l % 2 === 1) linha.reverse();
    linhas.push(linha);
  }
  return linhas.reverse();
}

const linhas = buildLinhas();

const TIPO_ESTILOS: Record<string, { bg: string; border: string; text: string }> = {
  checkpoint: { bg: '#fef9c3', border: '#eab308', text: '#713f12' },
  presente:   { bg: '#dcfce7', border: '#22c55e', text: '#14532d' },
  caveira:    { bg: '#fee2e2', border: '#ef4444', text: '#7f1d1d' },
  duplo:      { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' },
  troca:      { bg: '#f3e8ff', border: '#a855f7', text: '#581c87' },
};

export default function Tabuleiro({ grupos, grupoAtual, compact = false }: Props) {
  const gruposNaCasa = (casa: number) => grupos.filter(g => g.posicao === casa);

  const casaSize = compact ? 'min-h-[42px]' : 'min-h-[58px]';
  const numSize  = compact ? 'text-[9px]' : 'text-[11px] font-bold';
  const emojiSize = compact ? 'text-base' : 'text-xl';
  const tokenSize = compact ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-sm';

  return (
    <div className="w-full select-none">
      {/* META */}
      <div className="flex justify-center mb-3">
        <div className="bg-yellow-400 text-yellow-900 font-black px-5 py-2 rounded-full text-sm shadow-lg tracking-wide">
          🏁 META — CASA 50
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {linhas.map((linha, li) => (
          <div key={li} className="flex gap-1.5">
            {linha.map(num => {
              const especial = CASAS_ESPECIAIS[num];
              const aqui = gruposNaCasa(num);
              const estilos = especial ? TIPO_ESTILOS[especial.tipo] : null;

              return (
                <div
                  key={num}
                  className={`flex-1 ${casaSize} rounded-xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all`}
                  style={estilos
                    ? { backgroundColor: estilos.bg, borderColor: estilos.border }
                    : { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }
                  }
                >
                  {/* Número */}
                  <span className={`${numSize} leading-none`}
                    style={{ color: estilos ? estilos.text : '#94a3b8' }}>
                    {num}
                  </span>

                  {/* Ícone da casa especial */}
                  {especial && !aqui.length && (
                    <span className={`${emojiSize} leading-none mt-0.5`}>{especial.emoji}</span>
                  )}

                  {/* Tokens dos grupos */}
                  {aqui.length > 0 && (
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-1">
                      {aqui.map(g => (
                        <div
                          key={g.id}
                          className={`${tokenSize} rounded-full flex items-center justify-center shadow-md border-2 border-white font-bold leading-none`}
                          style={{ backgroundColor: g.cor }}
                          title={g.nome}
                        >
                          {g.emoji}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* INÍCIO */}
      <div className="flex justify-center mt-3">
        <div className="bg-slate-200 text-slate-600 font-bold px-4 py-1.5 rounded-full text-xs">
          🚀 INÍCIO
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
        {[
          { emoji: '⭐', label: 'Checkpoint', cor: '#713f12' },
          { emoji: '🎁', label: '+2 casas',  cor: '#14532d' },
          { emoji: '💀', label: '-3 casas',  cor: '#7f1d1d' },
          { emoji: '🎯', label: 'Double',     cor: '#1e3a8a' },
          { emoji: '🔄', label: 'Troca',      cor: '#581c87' },
        ].map(({ emoji, label, cor }) => (
          <span key={label} className="flex items-center gap-1 text-xs font-semibold" style={{ color: cor }}>
            {emoji} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
