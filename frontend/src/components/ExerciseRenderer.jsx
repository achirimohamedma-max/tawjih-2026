export function ExerciseRenderer({ q }) {
  if (q.series && Array.isArray(q.series)) {
    return (
      <div className="flex gap-2 flex-wrap mb-4">
        {q.series.map((v, i) => (
          <div
            key={i}
            className={`w-12 h-12 grid place-items-center rounded-lg border-2 font-bold ${
              v === '؟' || v === '?'
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-bord bg-white'
            }`}
          >
            {v}
          </div>
        ))}
      </div>
    );
  }
  if (q.grid && Array.isArray(q.grid)) {
    return (
      <div
        className="inline-grid gap-1 mb-4"
        style={{ gridTemplateColumns: `repeat(${q.grid[0].length}, minmax(0,3rem))` }}
      >
        {q.grid.flatMap((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-12 h-12 grid place-items-center rounded-md border ${
                cell === '؟' || cell === '?'
                  ? 'border-gold bg-gold/10 text-gold font-bold'
                  : 'border-bord bg-white'
              }`}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    );
  }
  return null;
}
