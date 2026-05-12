export function ProgressRing({ value = 0, max = 20, size = 110, stroke = 8, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(value / max, 1));
  const dash = c * pct;
  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,.08)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#C8A84B"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-2xl font-extrabold text-ink">
          {value}
        </div>
      </div>
      {label && <div className="text-xs text-muted mt-2">{label}</div>}
    </div>
  );
}
