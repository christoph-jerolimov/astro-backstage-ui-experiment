export type StatusTone = 'good' | 'warning' | 'critical';

interface StatusPillProps {
  tone: StatusTone;
  label: string;
}

/**
 * Status is never carried by colour alone: every tone ships with its own icon
 * shape and a text label, so it survives colour-blindness and grayscale print.
 */
export function StatusPill({ tone, label }: StatusPillProps) {
  return (
    <span className={`status-cell status-${tone}`}>
      {tone === 'good' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M2.5 7.5l3 3 6-7" />
        </svg>
      )}
      {tone === 'warning' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M7 1.5l6 11H1z" />
          <path d="M7 6v3M7 10.8v.2" strokeWidth="1.8" />
        </svg>
      )}
      {tone === 'critical' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      )}
      {label}
    </span>
  );
}
