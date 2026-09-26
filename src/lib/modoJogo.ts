/**
 * Detects which backend mode is active.
 * LOCAL: no Supabase configured → uses Next.js API routes over local WiFi
 * ONLINE: Supabase configured → uses Supabase real-time
 */

export type ModoJogo = 'local' | 'online';

export function getModo(): ModoJogo {
  if (typeof window === 'undefined') return 'local';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!url || url.includes('placeholder')) return 'local';
  return 'online';
}

export function isLocal(): boolean {
  return getModo() === 'local';
}
