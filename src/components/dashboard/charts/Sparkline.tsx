interface SparklineProps {
  values: number[];
}

const W = 96;
const H = 28;

/** 12-point stat-tile sparkline: history in the muted hue, current point accented. */
export function Sparkline({ values }: SparklineProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const x = (i: number) => (i / (values.length - 1)) * (W - 8) + 2;
  const y = (v: number) => H - 5 - ((v - min) / span) * (H - 10);
  const d = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`)
    .join('');
  const last = values[values.length - 1]!;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d={d}
        fill="none"
        stroke="var(--chart-muted)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={x(values.length - 1)}
        cy={y(last)}
        r={5}
        fill="var(--chart-surface)"
      />
      <circle
        cx={x(values.length - 1)}
        cy={y(last)}
        r={3.5}
        fill="var(--chart-series-1)"
      />
    </svg>
  );
}
