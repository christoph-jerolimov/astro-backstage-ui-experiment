import { useEffect, useRef, useState } from 'react';

/**
 * Measures the chart container so the SVG viewBox can be expressed in real CSS
 * pixels. A fixed viewBox would scale the type down with the container, which
 * is how axis labels end up at 8px; keeping 1 viewBox unit = 1 pixel means text
 * and mark specs stay at the sizes they were designed at.
 */
export function useChartWidth<T extends HTMLElement = HTMLDivElement>(
  fallback = 640,
) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () =>
      setWidth(Math.max(320, Math.round(element.getBoundingClientRect().width)));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
