import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAdminKey, clearAdminKey } from '../api/client.js';
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx';

export function AdminLayout() {
  const { t } = useTranslation();
  if (!getAdminKey()) return <Navigate to="/admin/login" replace />;
  const item = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-bold ${
      isActive ? 'bg-red text-white' : 'text-muted hover:bg-surf'
    }`;
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-e border-bord p-4 space-y-2">
        <div className="text-xs uppercase text-muted mb-2">{t('nav.admin')}</div>
        <NavLink to="/admin/questions" className={item}>
          {t('admin.questions.title')}
        </NavLink>
        <NavLink to="/admin/translations" className={item}>
          {t('admin.translations.title')}
        </NavLink>
        <NavLink to="/admin/stats" className={item}>
          {t('admin.stats.title')}
        </NavLink>
        <div className="pt-4">
          <LanguageSwitcher />
        </div>
        <button
          onClick={() => {
            clearAdminKey();
            window.location.href = '/admin/login';
          }}
          className="block text-xs text-muted mt-6 hover:text-red"
        >
          ↩ Logout
        </button>
        <NavLink to="/" className="block text-xs text-muted">
          ‹ {t('nav.home')}
        </NavLink>
      </aside>
      <main className="flex-1 p-6 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
