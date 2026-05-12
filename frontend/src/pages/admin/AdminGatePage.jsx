import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { setAdminKey, clearAdminKey } from '../../api/client.js';
import { adminStats } from '../../api/admin.api.js';

export function AdminGatePage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [key, setKey] = useState('');
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    setAdminKey(key);
    try {
      await adminStats.overview();
      nav('/admin/questions');
    } catch {
      clearAdminKey();
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-cream">
      <Card className="w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">🔐 {t('admin.gate.title')}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={t('admin.gate.placeholder')}
            className="w-full rounded-lg border border-bord px-3 py-2"
          />
          {err && <div className="text-red text-sm">{t('admin.gate.invalid')}</div>}
          <Button type="submit" disabled={busy || !key} className="w-full">
            {t('btn.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
