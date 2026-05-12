import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button.jsx';

export function LandingPage() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink to-red-dark text-white py-16 md:py-24 px-6 text-center shadow-2xl">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-xs mb-6 backdrop-blur">
          🎓 {t('app.author')}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
          {t('app.title')}
        </h1>
        <p className="text-white/70 text-sm md:text-base mb-8">{t('app.subtitle')}</p>
        <Link to="/dashboard">
          <Button variant="gold" className="text-lg">
            {t('btn.start')} →
          </Button>
        </Link>
      </div>
    </section>
  );
}
