import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar.jsx';

export function PublicLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-muted py-6 border-t border-bord bg-white">
        Tawjih 2026 — {t('app.author')}
      </footer>
    </div>
  );
}
