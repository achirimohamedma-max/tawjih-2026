import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';
import { QuestionCard } from '../components/QuestionCard.jsx';
import { Spinner } from '../components/Spinner.jsx';
import { useStartAttempt, useSubmitAttempt } from '../hooks/useAttempts.js';
import { useSessionStore } from '../store/sessionStore.js';
import { useUIStore } from '../store/uiStore.js';
import { useExamStore } from '../store/examStore.js';

export function PsyExamPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { sessionId } = useSessionStore();
  const { lang } = useUIStore();
  const exam = useExamStore();
  const startMut = useStartAttempt();
  const submitMut = useSubmitAttempt();
  const [count, setCount] = useState(10);

  useEffect(() => () => exam.reset(), []);

  async function handleStart() {
    const data = await startMut.mutateAsync({ sessionId, mode: 'psy', count, lang });
    exam.init({ attemptId: data.attemptId, questions: data.questions });
  }
  async function handleFinish() {
    const r = await submitMut.mutateAsync({
      id: exam.attemptId,
      body: { sessionId, answers: exam.answers },
    });
    exam.reset();
    nav(`/exam/${r.attemptId}/result`);
  }

  if (!exam.attemptId) {
    return (
      <Card className="max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">
          {t('exam.config.title')} — {t('nav.exam.psy')}
        </h2>
        <label className="block mb-4">
          <span className="text-sm text-muted">{t('exam.config.count')}</span>
          <input
            type="number"
            min="1"
            max="30"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="block w-full mt-1 rounded-lg border border-bord px-3 py-2"
          />
        </label>
        <Button onClick={handleStart} disabled={startMut.isPending} className="w-full">
          {startMut.isPending ? <Spinner /> : t('btn.start')}
        </Button>
        {startMut.error && (
          <div className="text-red text-sm mt-2">
            {startMut.error.response?.data?.error?.message || t('exam.empty')}
          </div>
        )}
      </Card>
    );
  }

  const q = exam.questions[exam.currentIndex];
  const isLast = exam.currentIndex === exam.questions.length - 1;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="h-2 rounded-full bg-surf overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-gold to-green transition-all"
          style={{ width: `${((exam.currentIndex + 1) / exam.questions.length) * 100}%` }}
        />
      </div>
      <QuestionCard
        q={q}
        index={exam.currentIndex}
        total={exam.questions.length}
        value={exam.answers[exam.currentIndex]}
        onChange={(v) => exam.setAnswer(exam.currentIndex, v)}
        lang={lang}
      />
      <div className="flex justify-between mt-4">
        <Button variant="ghost" onClick={exam.prev} disabled={exam.currentIndex === 0}>
          {t('btn.prev')}
        </Button>
        {isLast ? (
          <Button onClick={handleFinish} disabled={submitMut.isPending}>
            {submitMut.isPending ? <Spinner /> : t('btn.submit')}
          </Button>
        ) : (
          <Button onClick={exam.next}>{t('btn.next')}</Button>
        )}
      </div>
    </div>
  );
}
