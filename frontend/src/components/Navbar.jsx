import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';

export function Navbar() {
  const { t } = useTranslation();
  const item = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm font-bold whitespace-nowrap ${
      isActive ? 'bg-red text-white' : 'text-muted hover:bg-surf'
    }`;
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-bord shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red to-red-dark grid place-items-center text-white text-lg">
            🎓
          </div>
          <div className="hidden md:block text-sm font-extrabold text-ink leading-tight">
            {t('app.title')}
          </div>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          <NavLink to="/dashboard" className={item}>
            {t('nav.dashboard')}
          </NavLink>
          <NavLink to="/summary" className={item}>
            {t('nav.summary')}
          </NavLink>
          <NavLink to="/exam/qcm" className={item}>
            {t('nav.exam.qcm')}
          </NavLink>
          <NavLink to="/exam/psy" className={item}>
            {t('nav.exam.psy')}
          </NavLink>
          <NavLink to="/history" className={item}>
            {t('nav.history')}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
