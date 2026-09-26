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
      setTempo(t => {
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
  const corTimer = pct > 50 ? '#58cc02' : pct > 25 ? '#ffc800' : '#ff4b4b';
  const respondido = !!(selecionada || expirado);

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Timer bar */}
      {!readonly && (
        <div style={{ width: '100%', height: 8, background: '#e5e5e5', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              backgroundColor: corTimer,
              borderRadius: 99,
              transition: 'width 1s linear, background-color 0.3s',
            }}
          />
        </div>
      )}

      {/* Question */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '20px 18px',
        textAlign: 'center',
        boxShadow: '0 2px 0 #e5e5e5',
        border: '2px solid #e5e5e5',
      }}>
        {pergunta.unidade && (
          <p style={{ fontSize: 11, color: '#afafaf', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            {pergunta.unidade}
          </p>
        )}
        <p style={{ fontSize: 18, fontWeight: 800, color: '#3c3c3c', lineHeight: 1.4, margin: 0 }}>
          {pergunta.enunciado}
        </p>
      </div>

      {/* Options — Duolingo style: single column, 3D border effect */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pergunta.opcoes.map(opcao => {
          const correto = opcao === pergunta.resposta;
          const estaErrado = respondido && opcao === selecionada && !correto;
          const estaCerto  = respondido && correto;
          const opaque     = respondido && !correto && opcao !== selecionada;

          let bg            = '#ffffff';
          let borderColor   = '#e5e5e5';
          let shadowColor   = '#e5e5e5';
          let textColor     = '#3c3c3c';
          let icon          = '';

          if (estaCerto) {
            bg = '#d7ffb8'; borderColor = '#58cc02'; shadowColor = '#58a700'; textColor = '#3c3c3c'; icon = ' ✓';
          } else if (estaErrado) {
            bg = '#ffd9d9'; borderColor = '#ff4b4b'; shadowColor = '#ea2b2b'; textColor = '#3c3c3c'; icon = ' ✗';
          } else if (opaque) {
            bg = '#f7f7f7'; borderColor = '#e5e5e5'; shadowColor = '#e5e5e5'; textColor = '#afafaf';
          }

          return (
            <button
              key={opcao}
              onClick={() => escolher(opcao)}
              disabled={respondido || !!readonly}
              style={{
                background: bg,
                border: `2px solid ${borderColor}`,
                borderBottom: `4px solid ${shadowColor}`,
                borderRadius: 14,
                padding: '14px 18px',
                fontSize: 15,
                fontWeight: 700,
                color: textColor,
                textAlign: 'center',
                cursor: respondido || readonly ? 'default' : 'pointer',
                transition: 'background 0.15s, border-color 0.15s, opacity 0.15s, transform 0.1s',
                transform: 'none',
                opacity: opaque ? 0.5 : 1,
                width: '100%',
              }}
              onMouseDown={e => { if (!respondido && !readonly) (e.currentTarget.style.transform = 'translateY(2px)'); }}
              onMouseUp={e => { (e.currentTarget.style.transform = 'none'); }}
              onMouseLeave={e => { (e.currentTarget.style.transform = 'none'); }}
            >
              {opcao}{icon}
            </button>
          );
        })}
      </div>

      {expirado && (
        <p style={{ textAlign: 'center', color: '#ff4b4b', fontWeight: 700, fontSize: 13 }}>
          ⏰ Tempo esgotado!
        </p>
      )}
    </div>
  );
}
