import { useId, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useChartWidth } from './useChartWidth';

export interface LineSeries {
  name: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  labels: string[];
  series: LineSeries[];
  title: string;
}

const VB_H = 240;
const PAD = { top: 12, right: 104, bottom: 24, left: 36 };

function niceTicks(max: number): number[] {
  const step = max > 40 ? 20 : max > 20 ? 10 : 5;
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return ticks;
}

export function LineChart({ labels, series, title }: LineChartProps) {
  const titleId = useId();
  const { ref: wrapRef, width: VB_W } = useChartWidth();
  const [active, setActive] = useState<number | null>(null);

  const n = labels.length;
  const max = Math.max(...series.flatMap((s) => s.values));
  const ticks = niceTicks(max);
  const yMax = ticks[ticks.length - 1]!;
  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = VB_H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (n === 1 ? 0 : (i / (n - 1)) * plotW);
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  const pathFor = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join('');

  const indexFromPointer = (e: PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * VB_W;
    const t = Math.min(1, Math.max(0, (vx - PAD.left) / plotW));
    return Math.round(t * (n - 1));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      setActive((prev) => {
        const next = (prev ?? (delta === 1 ? -1 : n)) + delta;
        return Math.min(n - 1, Math.max(0, next));
      });
    } else if (e.key === 'Escape') {
      setActive(null);
    }
  };

  const xLabelEvery = Math.max(1, Math.ceil(n / 6));
  const tooltipLeftPct = active === null ? 0 : (x(active) / VB_W) * 100;
  const flip = active !== null && x(active) > VB_W * 0.62;

  // End labels: spread apart when line ends converge so they never collide.
  const MIN_LABEL_GAP = 15;
  const endLabelY = (() => {
    const ys = series.map((s) => y(s.values[n - 1]!));
    const order = ys.map((_, i) => i).sort((a, b) => ys[a]! - ys[b]!);
    const placed = [...ys];
    for (let k = 1; k < order.length; k++) {
      const prev = placed[order[k - 1]!]!;
      const cur = placed[order[k]!]!;
      if (cur - prev < MIN_LABEL_GAP) placed[order[k]!] = prev + MIN_LABEL_GAP;
    }
    return placed;
  })();

  return (
    <figure className="chart-figure">
      <div
        ref={wrapRef}
        tabIndex={0}
        role="application"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        onPointerMove={(e) => setActive(indexFromPointer(e))}
        onPointerLeave={() => setActive(null)}
        style={{ position: 'relative', outline: 'none' }}
      >
        <svg
          className="chart-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width={VB_W}
          height={VB_H}
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>{title}</title>
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={VB_W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? 'var(--chart-baseline)' : 'var(--chart-grid)'}
                strokeWidth={1}
              />
              <text x={PAD.left - 8} y={y(t) + 3} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {labels.map((label, i) =>
            i % xLabelEvery === 0 ? (
              <text key={label} x={x(i)} y={VB_H - 6} textAnchor="middle">
                {label}
              </text>
            ) : null,
          )}
          {active !== null && (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--chart-baseline)"
              strokeWidth={1}
            />
          )}
          {series.map((s, si) => (
            <g key={s.name}>
              <path
                d={pathFor(s.values)}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* end marker: >=8px dot with a 2px surface ring */}
              <circle
                cx={x(n - 1)}
                cy={y(s.values[n - 1]!)}
                r={6}
                fill="var(--chart-surface)"
              />
              <circle
                cx={x(n - 1)}
                cy={y(s.values[n - 1]!)}
                r={4}
                fill={s.color}
              />
              <text
                className="chart-end-label"
                x={x(n - 1) + 10}
                y={endLabelY[si]! + 4}
              >
                {s.name} {s.values[n - 1]}
              </text>
              {active !== null && (
                <>
                  <circle
                    cx={x(active)}
                    cy={y(s.values[active]!)}
                    r={6}
                    fill="var(--chart-surface)"
                  />
                  <circle
                    cx={x(active)}
                    cy={y(s.values[active]!)}
                    r={4}
                    fill={s.color}
                  />
                </>
              )}
            </g>
          ))}
        </svg>
        {active !== null && (
          <div
            className="chart-tooltip"
            role="status"
            style={{
              left: `${tooltipLeftPct}%`,
              top: 8,
              transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
            }}
          >
            <div className="chart-tooltip-title">{labels[active]}</div>
            {series.map((s) => (
              <div className="chart-tooltip-row" key={s.name}>
                <span
                  className="legend-line"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                <span className="name">{s.name}</span>
                <span className="value">{s.values[active]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <ul className="chart-legend" aria-hidden="true">
        {series.map((s) => (
          <li key={s.name}>
            <span className="legend-line" style={{ background: s.color }} />
            {s.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}
