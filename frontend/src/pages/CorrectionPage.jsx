import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { CorrectionItem } from '../components/CorrectionItem.jsx';
import { ProgressRing } from '../components/ProgressRing.jsx';
import { Button } from '../components/Button.jsx';
import { useAttempt } from '../hooks/useAttempts.js';
import { useSessionStore } from '../store/sessionStore.js';
import { useUIStore } from '../store/uiStore.js';

export function CorrectionPage() {
  const { t } = useTranslation();
  const { attemptId } = useParams();
  const { sessionId } = useSessionStore();
  const { lang } = useUIStore();
  const { data, isLoading, error } = useAttempt(attemptId, sessionId);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Spinner />
      </div>
    );
  }
  if (error || !data) {
    return <div className="text-red text-center py-10">{t('error.generic')}</div>;
  }

  return (
    <div className="space-y-5">
      <Card className="flex items-center justify-between flex-wrap gap-6">
        <ProgressRing value={data.score} max={20} label={t('result.score')} />
        <div className="grid grid-cols-4 gap-4 text-center flex-1 min-w-[280px]">
          <div>
            <div className="text-2xl font-extrabold text-green">{data.correct}</div>
            <div className="text-xs text-muted">{t('result.correct')}</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red">{data.wrong}</div>
            <div className="text-xs text-muted">{t('result.wrong')}</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-muted">{data.empty}</div>
            <div className="text-xs text-muted">{t('result.empty')}</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{data.durationMin}m</div>
            <div className="text-xs text-muted">{t('result.duration')}</div>
          </div>
        </div>
      </Card>

      {data.axisBreakdown?.length > 0 && (
        <Card>
          <h3 className="text-sm font-extrabold mb-3">{t('result.byAxis')}</h3>
          <div className="space-y-2">
            {data.axisBreakdown.map((b, i) => {
              const pct = b.total ? Math.round((b.correct / b.total) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-32 md:w-48 truncate font-bold">
                    {b.sub} — {b.subN}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-surf overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-green"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-14 text-end">
                    {b.correct}/{b.total}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <h2 className="text-lg font-extrabold mt-6">{t('result.correction')}</h2>
      <div className="space-y-3">
        {data.questions?.map((q, i) => (
          <CorrectionItem key={i} q={q} index={i} lang={lang} />
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link to="/dashboard">
          <Button variant="ghost">{t('btn.back')}</Button>
        </Link>
      </div>
    </div>
  );
}
