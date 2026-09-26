'use client';
import { useState, useEffect } from 'react';
import type { PerguntaVF } from '@/lib/tipos';
import { TIMER_VF } from '@/lib/constantes';

interface Props {
  pergunta: PerguntaVF;
  onResponder: (resposta: string, correto: boolean) => void;
  readonly?: boolean;
}

export default function VerdadeiroFalso({ pergunta, onResponder, readonly }: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [tempo, setTempo] = useState(TIMER_VF);
  const [expirado, setExpirado] = useState(false);

  useEffect(() => {
    if (readonly || selecionada || expirado) return;
    const id = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          clearInterval(id);
          setExpirado(true);
          onResponder('', false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [readonly, selecionada, expirado, onResponder]);

  function escolher(opcao: 'verdadeiro' | 'falso') {
    if (selecionada || expirado || readonly) return;
    setSelecionada(opcao);
    onResponder(opcao, opcao === pergunta.resposta);
  }

  const pct = (tempo / TIMER_VF) * 100;
  const corTimer = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div className="text-xs text-slate-400 font-medium text-center">{pergunta.unidade}</div>

      {!readonly && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: corTimer }} />
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 text-center">
        <p className="text-sm text-slate-500 mb-2 font-medium">VERDADEIRO ou FALSO?</p>
        <p className="text-xl font-bold text-slate-800 leading-snug">{pergunta.enunciado}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(['verdadeiro', 'falso'] as const).map((opcao) => {
          const correto = opcao === pergunta.resposta;
          let bg = opcao === 'verdadeiro'
            ? 'bg-green-50 hover:bg-green-100 border-green-300'
            : 'bg-red-50 hover:bg-red-100 border-red-300';

          if (selecionada || expirado) {
            if (correto) bg = 'bg-green-200 border-green-500';
            else if (opcao === selecionada) bg = 'bg-red-200 border-red-500';
            else bg = 'bg-slate-50 border-slate-200 opacity-40';
          }

          return (
            <button
              key={opcao}
              onClick={() => escolher(opcao)}
              disabled={!!selecionada || expirado || readonly}
              className={`
                p-6 rounded-2xl border-2 font-black text-2xl
                transition-all duration-150 active:scale-95
                ${bg}
                ${!selecionada && !expirado && !readonly ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              {opcao === 'verdadeiro' ? '✅ VERDADEIRO' : '❌ FALSO'}
            </button>
          );
        })}
      </div>

      {(selecionada || expirado) && pergunta.explicacao && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          💡 {pergunta.explicacao}
        </div>
      )}
      {expirado && <p className="text-center text-red-500 font-bold">⏰ Tempo esgotado!</p>}
    </div>
  );
}
