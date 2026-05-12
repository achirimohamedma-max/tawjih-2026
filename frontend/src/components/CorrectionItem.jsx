import { useTranslation } from 'react-i18next';
import { ExerciseRenderer } from './ExerciseRenderer.jsx';

const LETTERS = ['أ', 'ب', 'ج', 'د'];
const LETTERS_LTR = ['A', 'B', 'C', 'D'];

export function CorrectionItem({ q, index, lang = 'ar' }) {
  const { t } = useTranslation();
  const L = lang === 'ar' ? LETTERS : LETTERS_LTR;
  const isOk = q.userAnswer !== null && q.userAnswer !== undefined && q.userAnswer === q.cor;
  const isEmpty = q.userAnswer === null || q.userAnswer === undefined;
  return (
    <div
      className={`rounded-2xl border-2 p-5 bg-white ${
        isOk ? 'border-green/40' : isEmpty ? 'border-bord' : 'border-red/40'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 grid place-items-center rounded-full bg-surf font-bold text-sm flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="font-bold leading-relaxed">{q.text}</div>
          <div className="text-xs text-muted mt-1">
            {q.src} · {q.sub} — {q.subN} · {q.diff}
          </div>
        </div>
        <div className="text-2xl">{isOk ? '✅' : isEmpty ? '⬜' : '❌'}</div>
      </div>
      <ExerciseRenderer q={q} />
      <div className="grid gap-2 mb-3">
        {q.ch?.map((c, j) => {
          const isAns = j === q.cor;
          const isUser = j === q.userAnswer && !isOk;
          return (
            <div
              key={j}
              className={`rounded-lg border-2 p-2 flex gap-3 items-center ${
                isAns
                  ? 'border-green bg-green/5'
                  : isUser
                  ? 'border-red bg-red/5'
                  : 'border-bord'
              }`}
            >
              <span className="w-7 h-7 grid place-items-center rounded-md bg-surf text-sm font-bold flex-shrink-0">
                {L[j]}
              </span>
              <span className="flex-1 text-sm">{c}</span>
              {isAns && (
                <span className="text-xs text-green font-bold">{t('result.correctAnswer')}</span>
              )}
              {isUser && (
                <span className="text-xs text-red font-bold">{t('result.yourAnswer')}</span>
              )}
            </div>
          );
        })}
      </div>
      {q.exp && (
        <div className="rounded-lg bg-surf p-3 text-sm">
          <div className="font-bold mb-1 text-ink">💡 {t('result.explanation')}</div>
          <div className="text-muted leading-relaxed">{q.exp}</div>
        </div>
      )}
    </div>
  );
}
