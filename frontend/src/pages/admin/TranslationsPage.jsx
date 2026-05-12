import { useState } from 'react';
import { useAdminQuestions, useAdminMutations } from '../../hooks/useAdmin.js';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';

export function TranslationsPage() {
  const [lang, setLang] = useState('fr');
  const { data } = useAdminQuestions({ missingLang: lang, limit: 50 });
  const { translate } = useAdminMutations();
  const [drafts, setDrafts] = useState({});

  function setField(id, field, val) {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] || {}), [field]: val } }));
  }
  async function save(q) {
    const draft = drafts[q._id] || {};
    const body = { lang, ...draft };
    await translate.mutateAsync({ id: q._id, body });
    setDrafts((d) => {
      const c = { ...d };
      delete c[q._id];
      return c;
    });
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold mb-4">Translations</h1>
      <div className="flex gap-2 mb-4">
        {['fr', 'en', 'ar'].map((L) => (
          <button
            key={L}
            onClick={() => setLang(L)}
            className={`px-3 py-2 text-sm font-bold rounded ${
              lang === L ? 'bg-red text-white' : 'bg-surf'
            }`}
          >
            Missing {L.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {data?.items?.length === 0 && (
          <p className="text-muted">All translations complete for {lang.toUpperCase()}.</p>
        )}
        {data?.items?.map((q) => {
          const d = drafts[q._id] || {};
          return (
            <Card key={q._id}>
              <div className="text-xs text-muted mb-1">
                #{q.legacyId} · ax {q.ax} · {q.sub}
              </div>
              <div className="font-bold mb-3" dir="rtl">
                {q.text?.ar}
              </div>
              <input
                placeholder="text"
                value={d.text ?? ''}
                onChange={(e) => setField(q._id, 'text', e.target.value)}
                className="w-full rounded border border-bord p-2 mb-2"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    placeholder={`ch[${i}] · ${q.ch?.ar?.[i] || ''}`}
                    value={d.ch?.[i] ?? ''}
                    onChange={(e) => {
                      const arr = [...(d.ch || ['', '', '', ''])];
                      arr[i] = e.target.value;
                      setField(q._id, 'ch', arr);
                    }}
                    className="rounded border border-bord p-2 text-sm"
                  />
                ))}
              </div>
              <input
                placeholder="subN"
                value={d.subN ?? ''}
                onChange={(e) => setField(q._id, 'subN', e.target.value)}
                className="w-full rounded border border-bord p-2 mb-2"
              />
              <textarea
                placeholder="exp"
                rows={2}
                value={d.exp ?? ''}
                onChange={(e) => setField(q._id, 'exp', e.target.value)}
                className="w-full rounded border border-bord p-2 mb-2"
              />
              <Button onClick={() => save(q)} disabled={!drafts[q._id]}>
                Save {lang.toUpperCase()}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
