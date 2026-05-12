import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAttemptHistory } from '../hooks/useAttempts.js';
import { useSessionStore } from '../store/sessionStore.js';
import { Card } from '../components/Card.jsx';
import { Spinner } from '../components/Spinner.jsx';

export function HistoryPage() {
  const { t } = useTranslation();
  const { sessionId } = useSessionStore();
  const { data, isLoading } = useAttemptHistory(sessionId);

  if (isLoading) return <Spinner />;
  if (!data?.items?.length) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3">🕒</div>
        <p className="text-muted">{t('history.empty')}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4">{t('history.title')}</h1>
      <div className="space-y-3">
        {data.items.map((a) => (
          <Link key={a._id} to={`/exam/${a._id}/result`}>
            <Card className="flex items-center justify-between hover:border-gold cursor-pointer">
              <div>
                <div className="font-bold">
                  {a.mode.toUpperCase()} ·{' '}
                  <span className="text-muted text-sm">
                    {new Date(a.finishedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted mt-1">
                  {a.correct}/{a.questionIds.length} · {a.durationMin}m · {a.lang.toUpperCase()}
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gold">{a.score}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
