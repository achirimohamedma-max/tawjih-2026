import { create } from 'zustand';

const STORAGE_KEY = 'tawjih_lang';
const initial = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

export const useUIStore = create((set) => ({
  lang: ['ar', 'fr', 'en'].includes(initial) ? initial : 'ar',
  setLang: (lang) => {
    if (!['ar', 'fr', 'en'].includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    set({ lang });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  },
}));
