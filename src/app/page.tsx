'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLocal } from '@/lib/modoJogo';

export default function Home() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState('');
  const [local, setLocal] = useState(false);

  useEffect(() => { setLocal(isLocal()); }, []);

  async function entrar() {
    if (!codigo.trim()) return;
    setEntrando(true);
    setErro('');
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

        {/* Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            {erro}
          </div>
        )}

      </div>

      {/* Link discreto para professor */}
      <a
        href="/professor"
        className="absolute bottom-6 text-[#30363D] hover:text-[#7D8590] text-xs transition-colors"
      >
        Professor
      </a>
    </main>
  );
}
