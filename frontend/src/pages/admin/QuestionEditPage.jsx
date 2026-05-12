import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminListQuestions } from '../../api/admin.api.js';
import { useAdminMutations } from '../../hooks/useAdmin.js';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';

const EMPTY = {
  ax: 0,
  sub: '1.1',
  diff: 'سهل',
  cor: 0,
  src: '',
  text: { ar: '', fr: '', en: '' },
  ch: { ar: ['', '', '', ''], fr: ['', '', '', ''], en: ['', '', '', ''] },
  exp: { ar: '', fr: '', en: '' },
  subN: { ar: '', fr: '', en: '' },
};

export function QuestionEditPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const nav = useNavigate();
  const { create, update } = useAdminMutations();
  const [doc, setDoc] = useState(EMPTY);
  const [tab, setTab] = useState('ar');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminListQuestions({ limit: 200 }).then((r) => {
      const found = r.items.find((x) => x._id === id);
      if (found) {
        setDoc({
          ...EMPTY,
          ...found,
          text: { ar: '', fr: '', en: '', ...(found.text || {}) },
          exp: { ar: '', fr: '', en: '', ...(found.exp || {}) },
          subN: { ar: '', fr: '', en: '', ...(found.subN || {}) },
          ch: {
            ar: found.ch?.ar || ['', '', '', ''],
            fr: found.ch?.fr || ['', '', '', ''],
            en: found.ch?.en || ['', '', '', ''],
          },
        });
      }
    });
  }, [id, isNew]);

  function patch(path, val) {
    setDoc((d) => {
      const next = structuredClone(d);
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys.at(-1)] = val;
      return next;
    });
  }

  async function save() {
    setBusy(true);
    try {
      if (isNew) await create.mutateAsync(doc);
      else await update.mutateAsync({ id, body: doc });
      nav('/admin/questions');
    } finally {
      setBusy(false);
    }
  }

  const T = tab;
  return (
    <div>
      <button onClick={() => nav('/admin/questions')} className="text-sm text-muted mb-3 hover:text-red">
        ‹ Questions
      </button>
      <h1 className="text-xl font-extrabold mb-4">
        {isNew ? '+ New question' : `Edit #${doc.legacyId || '?'}`}
      </h1>
      <Card className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="text-sm">
            ax
            <input
              type="number"
              value={doc.ax}
              onChange={(e) => patch('ax', Number(e.target.value))}
              className="block w-full rounded border border-bord p-2"
            />
          </label>
          <label className="text-sm">
            sub
            <input
              value={doc.sub}
              onChange={(e) => patch('sub', e.target.value)}
              className="block w-full rounded border border-bord p-2"
            />
          </label>
          <label className="text-sm">
            diff
            <select
              value={doc.diff}
              onChange={(e) => patch('diff', e.target.value)}
              className="block w-full rounded border border-bord p-2"
            >
              <option>سهل</option>
              <option>متوسط</option>
              <option>صعب</option>
            </select>
          </label>
          <label className="text-sm">
            cor (0-3)
            <input
              type="number"
              min="0"
              max="3"
              value={doc.cor}
              onChange={(e) => patch('cor', Number(e.target.value))}
              className="block w-full rounded border border-bord p-2"
            />
          </label>
        </div>
        <label className="block text-sm">
          src
          <input
            value={doc.src || ''}
            onChange={(e) => patch('src', e.target.value)}
            className="block w-full rounded border border-bord p-2"
          />
        </label>

        <div className="flex gap-2 border-b border-bord">
          {['ar', 'fr', 'en'].map((L) => (
            <button
              key={L}
              onClick={() => setTab(L)}
              className={`px-3 py-2 text-sm font-bold ${
                tab === L ? 'border-b-2 border-red text-red' : 'text-muted'
              }`}
            >
              {L.toUpperCase()}
            </button>
          ))}
        </div>

        <label className="block text-sm">
          text ({T})
          <textarea
            rows={3}
            value={doc.text?.[T] ?? ''}
            onChange={(e) => patch(`text.${T}`, e.target.value)}
            className="block w-full rounded border border-bord p-2"
          />
        </label>
        <label className="block text-sm">
          subN ({T})
          <input
            value={doc.subN?.[T] ?? ''}
            onChange={(e) => patch(`subN.${T}`, e.target.value)}
            className="block w-full rounded border border-bord p-2"
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <label key={i} className="text-sm">
              ch[{i}] ({T})
              <input
                value={doc.ch?.[T]?.[i] ?? ''}
                onChange={(e) => {
                  const arr = [...(doc.ch?.[T] || ['', '', '', ''])];
                  arr[i] = e.target.value;
                  patch(`ch.${T}`, arr);
                }}
                className="block w-full rounded border border-bord p-2"
              />
            </label>
          ))}
        </div>
        <label className="block text-sm">
          exp ({T})
          <textarea
            rows={4}
            value={doc.exp?.[T] ?? ''}
            onChange={(e) => patch(`exp.${T}`, e.target.value)}
            className="block w-full rounded border border-bord p-2"
          />
        </label>
        <div className="flex gap-3">
          <Button onClick={save} disabled={busy}>
            Save
          </Button>
          <Button variant="ghost" onClick={() => nav('/admin/questions')}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
