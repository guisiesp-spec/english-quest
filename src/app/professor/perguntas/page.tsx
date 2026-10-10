import { todasPerguntas } from '@/lib/perguntas/index';
import type { Pergunta, PerguntaMultiplaEscolha, PerguntaVF, PerguntaLigar } from '@/lib/tipos';
import Link from 'next/link';

const CAT_LABEL: Record<string, string> = {
  grammar:    'Gramática',
  vocabulary: 'Vocabulário',
  time_place: 'Tempo & Lugar',
  challenge:  'Desafio',
};
const CAT_COLOR: Record<string, string> = {
  grammar:    '#3b82f6',
  vocabulary: '#22c55e',
  time_place: '#f97316',
  challenge:  '#ef4444',
};
const TIPO_LABEL: Record<string, string> = {
  multipla_escolha: 'Múltipla Escolha',
  verdadeiro_falso: 'V / F',
  ligar:            'Ligar',
};

// Group questions by unidade
function agruparPorUnidade(perguntas: Pergunta[]) {
  const map = new Map<string, Pergunta[]>();
  for (const p of perguntas) {
    if (!map.has(p.unidade)) map.set(p.unidade, []);
    map.get(p.unidade)!.push(p);
  }
  return map;
}

function CardMultipla({ p }: { p: PerguntaMultiplaEscolha }) {
  return (
    <div>
      <p style={{ fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>{p.enunciado}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {p.opcoes.map(op => (
          <div
            key={op}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 14,
              background: op === p.resposta ? '#16a34a22' : '#21262D',
              border: `1px solid ${op === p.resposta ? '#16a34a' : '#30363D'}`,
              color: op === p.resposta ? '#4ade80' : '#8b949e',
              fontWeight: op === p.resposta ? 700 : 400,
            }}
          >
            {op === p.resposta ? '✓ ' : ''}{op}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardVF({ p }: { p: PerguntaVF }) {
  return (
    <div>
      <p style={{ fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>{p.enunciado}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['verdadeiro', 'falso'] as const).map(op => (
          <div
            key={op}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 14,
              background: op === p.resposta ? '#16a34a22' : '#21262D',
              border: `1px solid ${op === p.resposta ? '#16a34a' : '#30363D'}`,
              color: op === p.resposta ? '#4ade80' : '#8b949e',
              fontWeight: op === p.resposta ? 700 : 400,
              textTransform: 'uppercase',
            }}
          >
            {op === p.resposta ? '✓ ' : ''}{op}
          </div>
        ))}
      </div>
      {p.explicacao && (
        <p style={{ marginTop: 6, fontSize: 12, color: '#60a5fa' }}>💡 {p.explicacao}</p>
      )}
    </div>
  );
}

function CardLigar({ p }: { p: PerguntaLigar }) {
  return (
    <div>
      <p style={{ fontWeight: 700, color: '#e6edf3', marginBottom: 8 }}>{p.enunciado}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {p.pares.map((par, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ padding: '4px 10px', borderRadius: 6, background: '#21262D', border: '1px solid #30363D', color: '#e6edf3', fontSize: 13, minWidth: 80 }}>
              {par.esquerda}
            </span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>→</span>
            <span style={{ padding: '4px 10px', borderRadius: 6, background: '#16a34a22', border: '1px solid #16a34a', color: '#4ade80', fontSize: 13 }}>
              {par.direita}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardPergunta({ p }: { p: Pergunta }) {
  const catColor = CAT_COLOR[p.categoria] ?? '#6366f1';
  return (
    <div style={{
      background: '#161B22',
      border: '1px solid #21262D',
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: catColor + '22', color: catColor, border: `1px solid ${catColor}55` }}>
          {CAT_LABEL[p.categoria] ?? p.categoria}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#21262D', color: '#8b949e', border: '1px solid #30363D' }}>
          {TIPO_LABEL[p.tipo] ?? p.tipo}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#21262D', color: '#fbbf24', border: '1px solid #30363D' }}>
          {'★'.repeat(p.nivel)} nível {p.nivel}
        </span>
        <span style={{ fontSize: 10, color: '#484f58', marginLeft: 'auto', fontFamily: 'monospace' }}>{p.id}</span>
      </div>

      {/* Question body */}
      {p.tipo === 'multipla_escolha' && <CardMultipla p={p} />}
      {p.tipo === 'verdadeiro_falso'  && <CardVF p={p} />}
      {p.tipo === 'ligar'             && <CardLigar p={p} />}
    </div>
  );
}

export default function PerguntasPage() {
  const grupos = agruparPorUnidade(todasPerguntas);
  const total  = todasPerguntas.length;

  return (
    <div style={{ background: '#0D1117', minHeight: '100vh', padding: '20px 16px 60px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link href="/professor" style={{ color: '#6366f1', fontSize: 13, textDecoration: 'none' }}>
            ← Voltar
          </Link>
          <h1 style={{ color: '#e6edf3', fontSize: 24, fontWeight: 900, margin: '12px 0 4px' }}>
            📚 Banco de Perguntas
          </h1>
          <p style={{ color: '#8b949e', fontSize: 14, margin: 0 }}>
            {total} perguntas no total — revise e edite em{' '}
            <code style={{ background: '#21262D', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>
              src/lib/perguntas/
            </code>
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(CAT_COLOR).map(([cat, cor]) => (
            <span key={cat} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: cor + '22', color: cor, border: `1px solid ${cor}44` }}>
              {CAT_LABEL[cat]}
            </span>
          ))}
        </div>

        {/* Questions grouped by unidade */}
        {Array.from(grupos.entries()).map(([unidade, perguntas]) => (
          <section key={unidade} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, borderBottom: '1px solid #21262D', paddingBottom: 10 }}>
              <h2 style={{ color: '#e6edf3', fontSize: 17, fontWeight: 800, margin: 0 }}>
                {unidade}
              </h2>
              <span style={{ fontSize: 12, color: '#8b949e', background: '#21262D', padding: '2px 8px', borderRadius: 99 }}>
                {perguntas.length} pergunta{perguntas.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {perguntas.map(p => <CardPergunta key={p.id} p={p} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
