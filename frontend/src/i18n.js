import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LangDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar/common.json';
import fr from './locales/fr/common.json';
import en from './locales/en/common.json';
import { useUIStore } from './store/uiStore.js';

i18n
  .use(LangDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { common: ar },
      fr: { common: fr },
      en: { common: en },
    },
    fallbackLng: 'ar',
    defaultNS: 'common',
    detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'tawjih_lang' },
    interpolation: { escapeValue: false },
  });

const lang = useUIStore.getState().lang;
i18n.changeLanguage(lang);
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

useUIStore.subscribe((s) => {
  i18n.changeLanguage(s.lang);
});

export default i18n;
