import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminQuestions, useAdminMutations } from '../../hooks/useAdmin.js';
import { Button } from '../../components/Button.jsx';
import { Spinner } from '../../components/Spinner.jsx';

export function QuestionListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminQuestions({ search, page, limit: 25 });
  const { remove } = useAdminMutations();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-xl font-extrabold">Questions ({data?.total || 0})</h1>
        <Link to="/admin/questions/new">
          <Button>+ New</Button>
        </Link>
      </div>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search…"
        className="w-full mb-4 rounded-lg border border-bord px-3 py-2"
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-xl border border-bord overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surf text-xs uppercase">
              <tr>
                <th className="p-3 text-start">#</th>
                <th className="p-3 text-start">Text (ar)</th>
                <th className="p-3">ax/sub</th>
                <th className="p-3">FR</th>
                <th className="p-3">EN</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((q) => (
                <tr key={q._id} className="border-t border-bord">
                  <td className="p-3 text-muted">{q.legacyId}</td>
                  <td className="p-3 max-w-md truncate">{q.text?.ar}</td>
                  <td className="p-3 text-center">
                    {q.ax}.{q.sub}
                  </td>
                  <td className="p-3 text-center">{q.text?.fr ? '✓' : '—'}</td>
                  <td className="p-3 text-center">{q.text?.en ? '✓' : '—'}</td>
                  <td className="p-3 flex gap-2 justify-end">
                    <Link to={`/admin/questions/${q._id}`}>
                      <Button variant="ghost">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (confirm('Delete?')) remove.mutate(q._id);
                      }}
                    >
                      Del
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && data.total > 25 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Prev
          </Button>
          <span className="px-3 py-2 text-sm">Page {page}</span>
          <Button
            variant="ghost"
            disabled={page * 25 >= data.total}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
