'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLocal } from '@/lib/modoJogo';

export default function Home() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [numGrupos, setNumGrupos] = useState(4);
  const [criando, setCriando] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');
  const [local, setLocal] = useState(false);

  useEffect(() => { setLocal(isLocal()); }, []);

  async function criar() {
    setCriando(true); setErro('');
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

  async function entrar() {
    if (!codigo.trim()) return;
    setEntrando(true); setErro('');
    const upper = codigo.trim().toUpperCase();
    if (local) {
      const r = await fetch(`/api/sala?codigo=${upper}`).catch(() => null);
      if (!r?.ok) { setErro('Sala não encontrada.'); setEntrando(false); return; }
      router.push(`/sala/${upper}`);
      return;
    }
    const { buscarSalaPorCodigo } = await import('@/lib/jogo');
    const sala = await buscarSalaPorCodigo(upper);
    if (!sala) { setErro('Sala não encontrada.'); setEntrando(false); return; }
    router.push(`/sala/${sala.codigo}`);
  }

  return (
    <main className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-5 py-10">

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-20 h-20 rounded-3xl bg-[#161B22] border border-[#30363D] flex items-center justify-center text-4xl shadow-2xl">
          🎮
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">English Quest</h1>
        <p className="text-[#7D8590] text-sm">Jogo educacional multiplayer</p>
        {local && (
          <span className="text-[11px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-full">
            📡 Modo WiFi Local
          </span>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">

        {/* Entrar */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
          <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-3">Entrar na sala</p>
          <input
            type="text"
            maxLength={4}
            placeholder="Código — ex: XKPW"
            value={codigo}
            onChange={e => setCodigo(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && entrar()}
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-xl font-black text-center tracking-[.25em] text-white uppercase placeholder-[#30363D] focus:outline-none focus:border-violet-500 transition-colors mb-3"
          />
          <button
            onClick={entrar}
            disabled={entrando || !codigo.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-[#21262D] disabled:text-[#7D8590] text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[.98]"
          >
            {entrando ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-px bg-[#21262D]" />
          <span className="text-[#30363D] text-xs font-medium">ou</span>
          <div className="flex-1 h-px bg-[#21262D]" />
        </div>

        {/* Criar */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
          <p className="text-[#7D8590] text-xs font-semibold uppercase tracking-widest mb-3">Sou o professor</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#7D8590] text-sm">Nº de grupos</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setNumGrupos(n => Math.max(2, n - 1))}
                className="w-8 h-8 rounded-lg bg-[#21262D] text-white font-bold hover:bg-[#30363D] active:scale-95">−</button>
              <span className="text-white font-black w-6 text-center">{numGrupos}</span>
              <button onClick={() => setNumGrupos(n => Math.min(6, n + 1))}
                className="w-8 h-8 rounded-lg bg-[#21262D] text-white font-bold hover:bg-[#30363D] active:scale-95">+</button>
            </div>
          </div>
          <button
            onClick={criar}
            disabled={criando}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#21262D] disabled:text-[#7D8590] text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-[.98]"
          >
            {criando ? 'Criando...' : '✦ Criar sala'}
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        {/* Dica WiFi */}
        {local && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3 text-xs text-violet-300/70 leading-relaxed">
            <p className="font-semibold text-violet-300 mb-1">Como funciona</p>
            <p>1. Professor cria a sala e mostra o QR code</p>
            <p>2. Grupos abrem no celular (mesmo WiFi)</p>
            <p>3. Tudo funciona sem internet</p>
          </div>
        )}
      </div>
    </main>
  );
}
