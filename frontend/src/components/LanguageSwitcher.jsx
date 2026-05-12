import { useUIStore } from '../store/uiStore.js';

const LANGS = [
  { code: 'ar', label: 'AR', flag: '🇲🇦' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useUIStore();
  return (
    <div className="flex gap-1 rounded-lg border border-bord p-1 bg-white">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 text-xs font-bold rounded-md transition ${
            l.code === lang ? 'bg-gold text-ink' : 'text-muted hover:bg-surf'
          }`}
        >
          <span className="ltr:mr-1 rtl:ml-1">{l.flag}</span>
          {l.label}
        </button>
      ))}
    </div>
  );
}
