import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface StackedSegment {
  name: string;
  value: number;
  color: string;
}

interface StackedBarProps {
  segments: StackedSegment[];
  title: string;
  unit: string;
}

// Built with HTML rather than SVG: a scaling viewBox would blow the inline
// labels up with the container. Flex keeps type at its real size and the 2px
// surface gaps exact at any width.
export function StackedBar({ segments, title, unit }: StackedBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fits, setFits] = useState<boolean[]>(() => segments.map(() => false));
  const [active, setActive] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // Measure before painting a label: a label that would not fit with padding
  // on both sides is dropped, never clipped. The legend still carries it.
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackWidth = track.getBoundingClientRect().width;
    setFits(
      segments.map((s, i) => {
        const label = labelRefs.current[i];
        if (!label) return false;
        const segmentWidth = (s.value / total) * trackWidth;
        return label.scrollWidth + 20 <= segmentWidth;
      }),
    );
  };

  useLayoutEffect(measure, [segments, total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  });

  return (
    <figure className="chart-figure">
      <div
        className="stack-track"
        ref={trackRef}
        role="img"
        aria-label={`${title}: ${segments
          .map((s) => `${s.name} ${s.value} ${unit}`)
          .join(', ')}`}
      >
        {segments.map((s, i) => (
          <div
            key={s.name}
            className="stack-segment"
            style={{ flexGrow: s.value, background: s.color }}
            tabIndex={0}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span
              className="stack-label"
              ref={(node) => {
                labelRefs.current[i] = node;
              }}
              style={{ visibility: fits[i] ? 'visible' : 'hidden' }}
            >
              {s.name} {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
        {active !== null && (
          <div
            className="chart-tooltip"
            role="status"
            style={{ left: 0, top: 'calc(100% + 6px)' }}
          >
            <div className="chart-tooltip-row">
              <span
                className="legend-swatch"
                style={{ background: segments[active]!.color }}
                aria-hidden="true"
              />
              <span className="name">{segments[active]!.name}</span>
              <span className="value">
                {segments[active]!.value} {unit}
              </span>
            </div>
          </div>
        )}
      </div>
      <ul className="chart-legend">
        {segments.map((s) => (
          <li key={s.name}>
            <span className="legend-swatch" style={{ background: s.color }} />
            {s.name} · {s.value} {unit}
          </li>
        ))}
      </ul>
    </figure>
  );
}
