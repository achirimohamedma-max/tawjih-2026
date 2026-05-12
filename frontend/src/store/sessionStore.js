import { create } from 'zustand';

const KEY = 'tawjih_session';

function ensureId() {
  if (typeof localStorage === 'undefined') return 'ssr';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export const useSessionStore = create(() => ({ sessionId: ensureId() }));
