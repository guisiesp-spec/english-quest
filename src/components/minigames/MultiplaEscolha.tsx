'use client';
import { useState, useEffect } from 'react';
import type { PerguntaMultiplaEscolha } from '@/lib/tipos';
import { TIMER_MULTIPLA_ESCOLHA } from '@/lib/constantes';

interface Props {
  pergunta: PerguntaMultiplaEscolha;
  onResponder: (resposta: string, correto: boolean) => void;
  readonly?: boolean;
}

export default function MultiplaEscolha({ pergunta, onResponder, readonly }: Props) {
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [tempo, setTempo] = useState(TIMER_MULTIPLA_ESCOLHA);
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

  function escolher(opcao: string) {
    if (selecionada || expirado || readonly) return;
    setSelecionada(opcao);
    onResponder(opcao, opcao === pergunta.resposta);
  }

  const pct = (tempo / TIMER_MULTIPLA_ESCOLHA) * 100;
  const corTimer = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Unidade */}
      <div className="text-xs text-slate-400 font-medium text-center">{pergunta.unidade}</div>

      {/* Timer */}
      {!readonly && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, backgroundColor: corTimer }}
          />
        </div>
      )}

      {/* Enunciado */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 text-center">
        <p className="text-xl font-bold text-slate-800 leading-snug">{pergunta.enunciado}</p>
      </div>

      {/* Opções */}
      <div className="grid grid-cols-2 gap-3">
        {pergunta.opcoes.map((opcao) => {
          const correto = opcao === pergunta.resposta;
          let bg = 'bg-white hover:bg-slate-50 border-slate-200';
          if (selecionada || expirado) {
            if (correto) bg = 'bg-green-100 border-green-400';
            else if (opcao === selecionada) bg = 'bg-red-100 border-red-400';
            else bg = 'bg-slate-50 border-slate-200 opacity-50';
          }

          return (
            <button
              key={opcao}
              onClick={() => escolher(opcao)}
              disabled={!!selecionada || expirado || readonly}
              className={`
                p-4 rounded-xl border-2 font-bold text-slate-700 text-center
                transition-all duration-150 active:scale-95
                ${bg}
                ${!selecionada && !expirado && !readonly ? 'cursor-pointer shadow-sm' : 'cursor-default'}
              `}
            >
              {opcao}
              {(selecionada || expirado) && correto && ' ✅'}
              {selecionada === opcao && !correto && ' ❌'}
            </button>
          );
        })}
      </div>

      {expirado && (
        <p className="text-center text-red-500 font-bold">⏰ Tempo esgotado!</p>
      )}
    </div>
  );
}
