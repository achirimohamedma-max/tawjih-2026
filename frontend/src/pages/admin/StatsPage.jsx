import { useAdminStats } from '../../hooks/useAdmin.js';
import { Card } from '../../components/Card.jsx';
import { Spinner } from '../../components/Spinner.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export function StatsPage() {
  const { overview, questions, axes, activity } = useAdminStats();
  if (overview.isLoading) return <Spinner />;
  const o = overview.data || {};
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold">Stats</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <div className="text-xs text-muted">Attempts</div>
          <div className="text-2xl font-extrabold">{o.attemptsCount}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted">Avg score</div>
          <div className="text-2xl font-extrabold text-gold">{o.avgScore}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted">Today</div>
          <div className="text-2xl font-extrabold">{o.todayAttempts}</div>
        </Card>
        <Card>
          <div className="text-xs text-muted">Questions</div>
          <div className="text-2xl font-extrabold">{o.totalQuestions}</div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-extrabold mb-2">Lang coverage</h3>
        <div className="flex gap-4 text-sm">
          <span>
            AR: <strong>{o.langCoverage?.ar || 0}</strong>
          </span>
          <span>
            FR: <strong>{o.langCoverage?.fr || 0}</strong>
          </span>
          <span>
            EN: <strong>{o.langCoverage?.en || 0}</strong>
          </span>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-extrabold mb-3">Activity (30d)</h3>
        {activity.data?.items?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={activity.data.items}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#C1272D" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-sm">No activity yet.</p>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-extrabold mb-3">Performance per axis</h3>
        {axes.data?.items?.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={(axes.data.items || []).map((a) => ({
                name: a.sub,
                value: Math.round(a.successRate * 100),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="value" fill="#C8A84B" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-sm">No data yet.</p>
        )}
      </Card>

      <Card>
        <h3 className="text-sm font-extrabold mb-3">Hardest questions (lowest success rate)</h3>
        <ul className="text-sm space-y-1">
          {(questions.data?.items || []).slice(0, 10).map((q) => (
            <li key={q._id} className="flex justify-between gap-3 border-b border-bord py-2">
              <span className="truncate flex-1">{q.text}</span>
              <span className="text-muted font-bold">{Math.round(q.successRate * 100)}%</span>
            </li>
          ))}
          {(!questions.data?.items || questions.data.items.length === 0) && (
            <li className="text-muted">No data yet.</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
