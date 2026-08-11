import { useId, useState } from 'react';
import { useChartWidth } from './useChartWidth';

interface ColumnChartProps {
  labels: string[];
  values: number[];
  title: string;
  /** Name of the measure, shown in the tooltip and per-column aria labels. */
  seriesName: string;
  color?: string;
}

const VB_H = 240;
const PAD = { top: 12, right: 12, bottom: 24, left: 40 };

/**
 * Picks a step that lands on 4-5 ticks for the given maximum. Small series
 * (a handful of incidents) need small steps, or the bars collapse against a
 * baseline while most of the plot sits empty.
 */
function niceTicks(max: number): number[] {
  const rough = Math.max(max, 1) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  // every measure on this dashboard is a whole count, so never step in fractions
  const step = Math.max(
    1,
    [1, 2, 5, 10].find((m) => m * magnitude >= rough)! * magnitude,
  );
  const top = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return ticks;
}

export function ColumnChart({
  labels,
  values,
  title,
  seriesName,
  color = 'var(--chart-series-1)',
}: ColumnChartProps) {
  const titleId = useId();
  const { ref: wrapRef, width: VB_W } = useChartWidth<HTMLElement>();
  const [active, setActive] = useState<number | null>(null);

  const n = values.length;
  const ticks = niceTicks(Math.max(...values));
  const yMax = ticks[ticks.length - 1]!;
  const plotW = VB_W - PAD.left - PAD.right;
  const plotH = VB_H - PAD.top - PAD.bottom;
  const band = plotW / n;
  // thin marks: cap the column width, let the band's leftover be air
  const barW = Math.min(24, band * 0.7);
  const x = (i: number) => PAD.left + i * band + (band - barW) / 2;
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;
  const r = 4; // rounded data-end; square at the baseline

  const xLabelEvery = Math.max(1, Math.ceil(n / 7));
  const tooltipLeftPct =
    active === null ? 0 : ((x(active) + barW / 2) / VB_W) * 100;
  const flip = active !== null && x(active) > VB_W * 0.62;

  return (
    <figure className="chart-figure" style={{ position: 'relative' }} ref={wrapRef}>
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
        {values.map((v, i) => {
          const h = Math.max(0, y(0) - y(v));
          const capped = Math.min(r, h);
          return (
            <g
              key={labels[i]}
              className="column-hit"
              tabIndex={0}
              role="img"
              aria-label={`${labels[i]}: ${v} ${seriesName}`}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              {/* transparent hit area wider than the mark */}
              <rect
                x={PAD.left + i * band}
                y={PAD.top}
                width={band}
                height={plotH}
                fill="transparent"
              />
              <path
                className="column-mark"
                d={`M${x(i)},${y(0)} L${x(i)},${y(v) + capped} Q${x(i)},${y(v)} ${x(i) + capped},${y(v)} L${x(i) + barW - capped},${y(v)} Q${x(i) + barW},${y(v)} ${x(i) + barW},${y(v) + capped} L${x(i) + barW},${y(0)} Z`}
                fill={color}
              />
            </g>
          );
        })}
        {labels.map((label, i) =>
          i % xLabelEvery === 0 ? (
            <text
              key={label}
              x={PAD.left + i * band + band / 2}
              y={VB_H - 6}
              textAnchor="middle"
            >
              {label}
            </text>
          ) : null,
        )}
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
          <div className="chart-tooltip-row">
            <span
              className="legend-swatch"
              style={{ background: color }}
              aria-hidden="true"
            />
            <span className="name">{seriesName}</span>
            <span className="value">{values[active]}</span>
          </div>
        </div>
      )}
    </figure>
  );
}
