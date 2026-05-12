import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <div className="text-xl font-bold mb-2">404</div>
      <div className="text-muted mb-6">Not found</div>
      <Link to="/" className="text-red font-bold hover:underline">
        ← {t('nav.home')}
      </Link>
    </div>
  );
}
