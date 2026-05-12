import { ExerciseRenderer } from './ExerciseRenderer.jsx';

const LETTERS = ['أ', 'ب', 'ج', 'د'];
const LETTERS_LTR = ['A', 'B', 'C', 'D'];

export function QuestionCard({ q, index, total, value, onChange, lang = 'ar' }) {
  const L = lang === 'ar' ? LETTERS : LETTERS_LTR;
  return (
    <div className="bg-white rounded-2xl shadow-md border border-bord p-6">
      <div className="flex items-center justify-between text-xs text-muted mb-3">
        <span>
          {index + 1} / {total}
        </span>
        <span>
          {q.diff} · {q.src}
        </span>
      </div>
      <div className="text-lg font-bold text-ink mb-4 leading-relaxed">{q.text}</div>
      <ExerciseRenderer q={q} />
      <div className="grid gap-2">
        {q.ch?.map((choice, i) => {
          const selected = value === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i)}
              className={`text-start rounded-xl border-2 p-3 transition flex gap-3 items-center ${
                selected ? 'border-red bg-red/5' : 'border-bord hover:border-gold'
              }`}
            >
              <span
                className={`w-8 h-8 grid place-items-center rounded-lg font-bold flex-shrink-0 ${
                  selected ? 'bg-red text-white' : 'bg-surf text-ink'
                }`}
              >
                {L[i]}
              </span>
              <span className="flex-1">{choice}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
