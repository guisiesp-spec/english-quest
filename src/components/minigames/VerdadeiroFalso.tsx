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
          onResponder('__timeout__', false);
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
  const respondido = !!(selecionada || expirado);

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
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

      <div style={{ background: '#fff', borderRadius: 20, padding: '20px 18px', textAlign: 'center', border: '2px solid #e5e5e5' }}>
        <p style={{ fontSize: 12, color: '#afafaf', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          VERDADEIRO ou FALSO?
        </p>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#3c3c3c', lineHeight: 1.4, margin: 0 }}>
          {pergunta.enunciado}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(['verdadeiro', 'falso'] as const).map((opcao) => {
          const correto = opcao === pergunta.resposta;
          const estaErrado = respondido && opcao === selecionada && !correto;
          const estaCerto  = respondido && correto;
          const opaque     = respondido && !correto && opcao !== selecionada;

          let bg         = opcao === 'verdadeiro' ? '#22c55e' : '#ef4444';
          let shadow     = opcao === 'verdadeiro' ? '#16a34a' : '#dc2626';
          let textColor  = '#ffffff';

          if (estaCerto)  { bg = '#16a34a'; shadow = '#166534'; }
          if (estaErrado) { bg = '#dc2626'; shadow = '#991b1b'; }
          if (opaque)     { bg = '#d1d5db'; shadow = '#9ca3af'; textColor = '#6b7280'; }

          const icon = estaCerto ? '✓' : estaErrado ? '✗' : opcao === 'verdadeiro' ? '✅' : '❌';

          return (
            <button
              key={opcao}
              onClick={() => escolher(opcao)}
              disabled={respondido || !!readonly}
              style={{
                padding: '18px 8px',
                borderRadius: 16,
                border: 'none',
                borderBottom: `4px solid ${shadow}`,
                backgroundColor: bg,
                color: textColor,
                cursor: respondido || readonly ? 'default' : 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: opaque ? 0.55 : 1,
              }}
            >
              <span style={{ fontSize: 30, lineHeight: 1 }}>{icon}</span>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: 0.5 }}>
                {opcao === 'verdadeiro' ? 'VERDADEIRO' : 'FALSO'}
              </span>
            </button>
          );
        })}
      </div>

      {respondido && pergunta.explicacao && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', fontSize: 14, color: '#1e40af' }}>
          💡 {pergunta.explicacao}
        </div>
      )}
    </div>
  );
}
