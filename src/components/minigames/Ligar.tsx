'use client';
import { useState, useEffect, useCallback } from 'react';
import type { PerguntaLigar } from '@/lib/tipos';
import { TIMER_LIGAR } from '@/lib/constantes';

interface Props {
  pergunta: PerguntaLigar;
  onResponder: (resposta: string, correto: boolean) => void;
  readonly?: boolean;
}

export default function Ligar({ pergunta, onResponder, readonly }: Props) {
  const [esqSel, setEsqSel] = useState<string | null>(null);
  const [conexoes, setConexoes] = useState<Record<string, string>>({});
  const [erradas, setErradas] = useState<string[]>([]);
  const [tempo, setTempo] = useState(TIMER_LIGAR);
  const [finalizado, setFinalizado] = useState(false);

  const [direitas] = useState(() =>
    [...pergunta.pares.map((p) => p.direita)].sort(() => Math.random() - 0.5),
  );

  const verificar = useCallback((cons: Record<string, string>) => {
    const corretas = pergunta.pares.every(
      (p) => cons[p.esquerda] === p.direita,
    );
    setFinalizado(true);
    const resumo = pergunta.pares.map((p) => `${p.esquerda}=${cons[p.esquerda] ?? ''}`).join(';');
    onResponder(resumo, corretas);
  }, [pergunta.pares, onResponder]);

  useEffect(() => {
    if (readonly || finalizado) return;
    const id = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          clearInterval(id);
          verificar(conexoes);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [readonly, finalizado, conexoes, verificar]);

  function selecionarEsq(item: string) {
    if (finalizado || readonly) return;
    setEsqSel(item === esqSel ? null : item);
  }

  function selecionarDir(item: string) {
    if (finalizado || readonly || !esqSel) return;

    const novas = { ...conexoes, [esqSel]: item };
    const correto = pergunta.pares.find((p) => p.esquerda === esqSel)?.direita === item;
    if (!correto) {
      setErradas((e) => [...e, esqSel]);
      setTimeout(() => {
        setErradas((e) => e.filter((x) => x !== esqSel));
        const sem = { ...novas };
        delete sem[esqSel];
        setConexoes(sem);
      }, 600);
    }
    setConexoes(novas);
    setEsqSel(null);

    if (correto && Object.keys(novas).length === pergunta.pares.length) {
      const todasCertas = pergunta.pares.every((p) => novas[p.esquerda] === p.direita);
      if (todasCertas) {
        setFinalizado(true);
        const resumo = pergunta.pares.map((p) => `${p.esquerda}=${novas[p.esquerda]}`).join(';');
        onResponder(resumo, true);
      }
    }
  }

  const pct = (tempo / TIMER_LIGAR) * 100;
  const corTimer = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      <div className="text-xs text-slate-400 font-medium text-center">{pergunta.unidade}</div>

      {!readonly && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: corTimer }} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
        <p className="font-bold text-slate-700">{pergunta.enunciado}</p>
        {!finalizado && !readonly && <p className="text-xs text-slate-400 mt-1">Toque na esquerda, depois na direita para conectar</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-2">
          {pergunta.pares.map(({ esquerda }) => {
            const conectado = conexoes[esquerda];
            const selecionado = esqSel === esquerda;
            const errado = erradas.includes(esquerda);
            let bg = 'bg-white border-slate-200';
            if (selecionado) bg = 'bg-blue-100 border-blue-400 ring-2 ring-blue-300';
            if (conectado && !errado) bg = 'bg-green-100 border-green-400';
            if (errado) bg = 'bg-red-100 border-red-400 animate-pulse';

            return (
              <button
                key={esquerda}
                onClick={() => selecionarEsq(esquerda)}
                disabled={finalizado || readonly || !!conectado}
                className={`
                  p-3 rounded-xl border-2 font-bold text-sm text-slate-700
                  transition-all duration-100 active:scale-95 text-left
                  ${bg}
                `}
              >
                {esquerda}
                {conectado && !errado && <span className="text-green-600 ml-1">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-2">
          {direitas.map((direita) => {
            const jaUsado = Object.values(conexoes).includes(direita) &&
              !erradas.some((e) => conexoes[e] === direita);
            let bg = 'bg-white border-slate-200';
            if (jaUsado) bg = 'bg-green-100 border-green-400 opacity-60';
            if (esqSel && !jaUsado) bg = 'bg-white border-blue-300 hover:bg-blue-50';

            return (
              <button
                key={direita}
                onClick={() => selecionarDir(direita)}
                disabled={finalizado || readonly || jaUsado}
                className={`
                  p-3 rounded-xl border-2 font-bold text-sm text-slate-700
                  transition-all duration-100 active:scale-95 text-left
                  ${bg}
                `}
              >
                {direita}
              </button>
            );
          })}
        </div>
      </div>

      {finalizado && (
        <div className="text-center font-bold text-green-600 text-lg">🎉 Todas conectadas!</div>
      )}
    </div>
  );
}
