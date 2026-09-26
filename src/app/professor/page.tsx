'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLocal } from '@/lib/modoJogo';

export default function ProfessorNovaSala() {
  const router = useRouter();
  const [numGrupos, setNumGrupos] = useState(4);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState('');
  const [local, setLocal] = useState(false);

  useEffect(() => { setLocal(isLocal()); }, []);

  async function criar() {
    setCriando(true);
    setErro('');
    if (local) {
      const r = await fetch('/api/sala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numGrupos }),
      }).catch(() => null);
      if (!r?.ok) { setErro('Erro ao criar sala.'); setCriando(false); return; }
      router.push(`/sala/${(await r.json()).sala.codigo}/professor`);
      return;
    }
    const { criarSala } = await import('@/lib/jogo');
    const { sala, erro: e } = await criarSala(numGrupos);
    if (e || !sala) { setErro(e ?? 'Erro ao criar sala.'); setCriando(false); return; }
    router.push(`/sala/${sala.codigo}/professor`);
  }

  return (
    <main className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-5 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-20 h-20 rounded-3xl bg-[#161B22] border border-[#30363D] flex items-center justify-center text-4xl shadow-2xl">
          🎓
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Painel do Professor</h1>
        <p className="text-[#7D8590] text-sm">English Quest</p>
        {local && (
          <span className="text-[11px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full">
            📡 Modo WiFi Local
          </span>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* Criar sala */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
          <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-4">Nova sala</p>

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white text-sm font-bold">Número de grupos</p>
              <p className="text-[#7D8590] text-xs mt-0.5">De 2 a 6 equipes</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNumGrupos(n => Math.max(2, n - 1))}
                className="w-9 h-9 rounded-xl bg-[#21262D] text-white font-black text-lg hover:bg-[#30363D] active:scale-95 transition-all"
              >
                −
              </button>
              <span className="text-white font-black text-2xl w-7 text-center">{numGrupos}</span>
              <button
                onClick={() => setNumGrupos(n => Math.min(6, n + 1))}
                className="w-9 h-9 rounded-xl bg-[#21262D] text-white font-black text-lg hover:bg-[#30363D] active:scale-95 transition-all"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={criar}
            disabled={criando}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#21262D] disabled:text-[#7D8590] text-white font-black py-3.5 rounded-xl text-sm transition-all active:scale-[.98]"
          >
            {criando ? 'Criando sala...' : '✦ Criar sala'}
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        {local && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-xs text-violet-300/70 leading-relaxed">
            <p className="font-semibold text-violet-300 mb-1">Como funciona</p>
            <p>1. Crie a sala e mostre o QR code no painel</p>
            <p>2. Grupos abrem no celular (mesmo WiFi)</p>
            <p>3. Tudo funciona sem internet</p>
          </div>
        )}

        <a
          href="/"
          className="text-center text-xs text-[#7D8590] hover:text-white transition-colors mt-2"
        >
          ← Voltar
        </a>
      </div>
    </main>
  );
}
