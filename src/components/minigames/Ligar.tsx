'use client';
import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import type { PerguntaLigar } from '@/lib/tipos';
import { TIMER_LIGAR } from '@/lib/constantes';

interface Props {
  pergunta: PerguntaLigar;
  onResponder: (resposta: string, correto: boolean) => void;
  readonly?: boolean;
}

// Each right-side slot is tracked by index so duplicate values don't block each other
interface DirSlot { valor: string; slotIdx: number; }

export default function Ligar({ pergunta, onResponder, readonly }: Props) {
  const [esqSel, setEsqSel] = useState<string | null>(null);
  // conexoes: esquerda → valor conectado
  const [conexoes, setConexoes] = useState<Record<string, string>>({});
  // usedSlots: which right-side slot indices are correctly connected
  const [usedSlots, setUsedSlots] = useState<Set<number>>(new Set());
  const [erradas, setErradas] = useState<string[]>([]);
  const [numErros, setNumErros] = useState(0);
  const [tempo, setTempo] = useState(TIMER_LIGAR);
  const [finalizado, setFinalizado] = useState(false);

  const [direitas] = useState<DirSlot[]>(() =>
    pergunta.pares
      .map((p, i) => ({ valor: p.direita, slotIdx: i }))
      .sort(() => Math.random() - 0.5),
  );

  const verificar = useCallback((cons: Record<string, string>) => {
    const corretas = pergunta.pares.every((p) => cons[p.esquerda] === p.direita);
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
          setFinalizado(true);
          onResponder('__timeout__', false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [readonly, finalizado, onResponder]);

  function selecionarEsq(item: string) {
    if (finalizado || readonly) return;
    setEsqSel(item === esqSel ? null : item);
  }

  function selecionarDir(valor: string, slotIdx: number) {
    if (finalizado || readonly || !esqSel) return;

    const novas = { ...conexoes, [esqSel]: valor };
    const correto = pergunta.pares.find((p) => p.esquerda === esqSel)?.direita === valor;

    if (!correto) {
      const esqAtual = esqSel;
      const novosErros = numErros + 1;
      setNumErros(novosErros);
      setErradas((e) => [...e, esqAtual]);
      setTimeout(() => {
        setErradas((e) => e.filter((x) => x !== esqAtual));
        const sem = { ...novas };
        delete sem[esqAtual];
        setConexoes(sem);
        if (novosErros >= 3) {
          setFinalizado(true);
          onResponder('__max_erros__', false);
        }
      }, 700);
    } else {
      setUsedSlots((s) => new Set(s).add(slotIdx));
    }

    setConexoes(novas);
    setEsqSel(null);

    if (correto) {
      const newUsed = new Set(usedSlots).add(slotIdx);
      if (newUsed.size === pergunta.pares.length) {
        const todasCertas = pergunta.pares.every((p) => novas[p.esquerda] === p.direita);
        if (todasCertas) {
          setFinalizado(true);
          const resumo = pergunta.pares.map((p) => `${p.esquerda}=${novas[p.esquerda]}`).join(';');
          onResponder(resumo, true);
        }
      }
    }
  }

  const pct = (tempo / TIMER_LIGAR) * 100;
  const corTimer = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      {pergunta.unidade && (
        <div className="text-xs text-slate-400 font-medium text-center">
          {pergunta.unidade} da apostila
        </div>
      )}

      {!readonly && (
        <div className="w-full rounded-full h-2" style={{ background: '#e5e5e5' }}>
          <div
            className="h-2 rounded-full"
            style={{ width: `${pct}%`, backgroundColor: corTimer, transition: 'width 1s linear, background-color 0.3s' }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
        <p className="font-bold text-slate-700">{pergunta.enunciado}</p>
        {!finalizado && !readonly && (
          <div className="flex items-center justify-center gap-3 mt-1">
            <p className="text-xs text-slate-400">Toque na esquerda, depois na direita para conectar</p>
            <span className="text-xs font-bold" style={{ color: numErros === 0 ? '#6b7280' : numErros === 1 ? '#f59e0b' : '#ef4444' }}>
              ❌ {numErros}/2
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
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
                disabled={finalizado || readonly || (!!conectado && !errado)}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-slate-700 transition-all duration-100 active:scale-95 text-left ${bg}`}
              >
                {esquerda}
                {conectado && !errado && <span className="text-green-600 ml-1">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Right column — each slot tracked by index so duplicates are independent */}
        <div className="flex flex-col gap-2">
          {direitas.map(({ valor, slotIdx }) => {
            const jaUsado = usedSlots.has(slotIdx);
            let bg = 'bg-white border-slate-200';
            if (jaUsado) bg = 'bg-green-100 border-green-400 opacity-60';
            if (esqSel && !jaUsado) bg = 'bg-white border-blue-300 hover:bg-blue-50';

            return (
              <button
                key={slotIdx}
                onClick={() => selecionarDir(valor, slotIdx)}
                disabled={finalizado || readonly || jaUsado}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-slate-700 transition-all duration-100 active:scale-95 text-left ${bg}`}
              >
                {valor}
              </button>
            );
          })}
        </div>
      </div>

      {finalizado && tempo > 0 && (
        <div className="text-center font-bold text-green-600 text-lg flex items-center justify-center gap-2"><Sparkles size={18} /> Todas conectadas!</div>
      )}
    </div>
  );
}
