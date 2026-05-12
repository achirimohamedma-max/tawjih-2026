import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUM_STRUCTURE } from '../data/summary-structure.js';
import theoryAr from '../locales/ar/theory.json';
import theoryFr from '../locales/fr/theory.json';
import theoryEn from '../locales/en/theory.json';
import { useUIStore } from '../store/uiStore.js';
import { TheoryCard } from '../components/TheoryCard.jsx';
import { Card } from '../components/Card.jsx';

const THEORY = { ar: theoryAr, fr: theoryFr, en: theoryEn };

export function SummaryPage() {
  const { t } = useTranslation();
  const { lang } = useUIStore();
  const [axIdx, setAxIdx] = useState(null);
  const [subId, setSubId] = useState(null);
  const cards = THEORY[lang] || THEORY.ar;

  if (axIdx === null) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold mb-4">{t('summary.title')}</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUM_STRUCTURE.map((ax, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:border-gold hover:-translate-y-1 transition"
              onClick={() => setAxIdx(i)}
            >
              <div className="text-3xl mb-2">📚</div>
              <div className="font-extrabold text-lg">{ax.title}</div>
              <div className="text-xs text-muted mt-2">
                {ax.subs?.length || 0} {ax.subs?.length === 1 ? 'sub-thème' : 'sub-thèmes'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const ax = SUM_STRUCTURE[axIdx];
  if (!subId) {
    return (
      <div>
        <button onClick={() => setAxIdx(null)} className="text-sm text-muted mb-3 hover:text-red">
          ‹ {t('summary.title')}
        </button>
        <h2 className="text-xl font-extrabold mb-4">{ax.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ax.subs?.map((s) => (
            <Card
              key={s.id}
              className="cursor-pointer hover:border-gold hover:-translate-y-1 transition"
              onClick={() => setSubId(s.id)}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-extrabold text-sm">{s.title}</div>
              <div className="text-xs text-muted mt-1">{s.sub}</div>
              <div className="text-xs text-gold font-bold mt-2">{s.badge}</div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const sub = ax.subs.find((s) => s.id === subId);
  return (
    <div>
      <button onClick={() => setSubId(null)} className="text-sm text-muted mb-3 hover:text-red">
        ‹ {ax.title}
      </button>
      <h2 className="text-xl font-extrabold mb-4">{sub.title}</h2>
      <div>
        {sub.cards?.map((cid) => {
          const html = cards[cid] || THEORY.ar[cid];
          return html ? (
            <TheoryCard key={cid} html={html} />
          ) : (
            <div key={cid} className="text-xs text-muted">
              {cid}
            </div>
          );
        })}
      </div>
    </div>
  );
}
