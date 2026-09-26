/**
 * Server-side in-memory game store.
 * Uses a global singleton so Next.js hot-reload doesn't reset state.
 * Works perfectly over local WiFi (teacher runs `npm run start`).
 */
import type { Sala, Grupo } from './tipos';

type Listener = (payload: { sala: Sala; grupos: Grupo[] }) => void;

class GameStore {
  private salas = new Map<string, Sala>();
  private grupos = new Map<string, Grupo[]>();   // key = salaId
  private listeners = new Map<string, Set<Listener>>(); // key = sala.codigo

  getSala(codigo: string): Sala | undefined {
    return this.salas.get(codigo.toUpperCase());
  }

  getSalaById(id: string): Sala | undefined {
    for (const s of this.salas.values()) if (s.id === id) return s;
    return undefined;
  }

  setSala(sala: Sala): void {
    this.salas.set(sala.codigo, sala);
    this._emit(sala.codigo, sala);
  }

  getGrupos(salaId: string): Grupo[] {
    return this.grupos.get(salaId) ?? [];
  }

  setGrupos(salaId: string, grupos: Grupo[]): void {
    this.grupos.set(salaId, grupos);
    const sala = this.getSalaById(salaId);
    if (sala) this._emit(sala.codigo, sala);
  }

  addGrupo(grupo: Grupo): void {
    const gs = this.getGrupos(grupo.sala_id);
    this.setGrupos(grupo.sala_id, [...gs, grupo]);
  }

  updateGrupo(grupoId: string, updates: Partial<Grupo>): void {
    for (const [salaId, gs] of this.grupos.entries()) {
      const idx = gs.findIndex((g) => g.id === grupoId);
      if (idx !== -1) {
        const updated = [...gs];
        updated[idx] = { ...updated[idx], ...updates };
        this.setGrupos(salaId, updated);
        return;
      }
    }
  }

  removeGrupo(grupoId: string): void {
    for (const [salaId, gs] of this.grupos.entries()) {
      if (gs.some((g) => g.id === grupoId)) {
        this.setGrupos(salaId, gs.filter((g) => g.id !== grupoId));
        return;
      }
    }
  }

  subscribe(codigo: string, cb: Listener): () => void {
    if (!this.listeners.has(codigo)) this.listeners.set(codigo, new Set());
    this.listeners.get(codigo)!.add(cb);
    return () => this.listeners.get(codigo)?.delete(cb);
  }

  private _emit(codigo: string, sala: Sala): void {
    const grupos = this.getGrupos(sala.id);
    this.listeners.get(codigo)?.forEach((cb) => cb({ sala, grupos }));
  }

  snapshot(codigo: string): { sala: Sala; grupos: Grupo[] } | null {
    const sala = this.getSala(codigo);
    if (!sala) return null;
    return { sala, grupos: this.getGrupos(sala.id) };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __gameStore: GameStore | undefined;
}

export const gameStore: GameStore =
  global.__gameStore ?? (global.__gameStore = new GameStore());
