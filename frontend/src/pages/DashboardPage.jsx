import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card.jsx';

export function DashboardPage() {
  const { t } = useTranslation();
  const tiles = [
    { to: '/exam/qcm', label: t('nav.exam.qcm'), icon: '📝' },
    { to: '/exam/psy', label: t('nav.exam.psy'), icon: '🧠' },
    { to: '/summary', label: t('nav.summary'), icon: '📚' },
    { to: '/history', label: t('nav.history'), icon: '🕒' },
  ];
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">{t('nav.dashboard')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tiles.map((tl) => (
          <Link key={tl.to} to={tl.to}>
            <Card className="text-center hover:border-gold hover:-translate-y-1 transition cursor-pointer">
              <div className="text-4xl mb-3">{tl.icon}</div>
              <div className="font-bold">{tl.label}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
