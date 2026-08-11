// Deterministic demo data for the dashboard. A tiny seeded generator keeps
// every build (and therefore the committed screenshots) identical.

export interface DayPoint {
  date: string;
  label: string;
  production: number;
  staging: number;
  buildMinutes: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;
// Fixed "today" so the data and screenshots never drift.
const TODAY = new Date('2026-08-11T00:00:00Z').getTime();

const rand = mulberry32(20260811);

export const DAYS: DayPoint[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(TODAY - (89 - i) * DAY_MS);
  const weekday = date.getUTCDay();
  const weekend = weekday === 0 || weekday === 6;
  const wave = Math.sin(i / 9) * 4;
  const production = Math.max(
    0,
    Math.round((weekend ? 4 : 14) + wave + rand() * 6),
  );
  const staging = Math.max(
    0,
    Math.round((weekend ? 2 : 9) + wave * 0.6 + rand() * 5),
  );
  return {
    date: date.toISOString().slice(0, 10),
    label: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    production,
    staging,
    buildMinutes: Math.round((production + staging) * (2.2 + rand() * 1.2)),
  };
});

export type RangeKey = '7d' | '30d' | '90d';

export const RANGE_OPTIONS: { id: RangeKey; label: string; days: number }[] = [
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
];

export const LANGUAGES = [
  { name: 'TypeScript', services: 11 },
  { name: 'Go', services: 8 },
  { name: 'Python', services: 5 },
] as const;

export type ServiceStatus = 'healthy' | 'degraded' | 'down';

export interface Service {
  name: string;
  owner: string;
  language: string;
  uptime: string;
  deploysPerWeek: number;
  status: ServiceStatus;
}

export const SERVICES: Service[] = [
  { name: 'catalog-api', owner: 'team-atlas', language: 'TypeScript', uptime: '99.99%', deploysPerWeek: 14, status: 'healthy' },
  { name: 'search-indexer', owner: 'team-atlas', language: 'Go', uptime: '99.95%', deploysPerWeek: 9, status: 'healthy' },
  { name: 'auth-gateway', owner: 'team-vault', language: 'Go', uptime: '99.90%', deploysPerWeek: 6, status: 'degraded' },
  { name: 'billing-worker', owner: 'team-ledger', language: 'Python', uptime: '99.97%', deploysPerWeek: 4, status: 'healthy' },
  { name: 'notification-hub', owner: 'team-signal', language: 'TypeScript', uptime: '98.71%', deploysPerWeek: 11, status: 'down' },
  { name: 'metrics-collector', owner: 'team-signal', language: 'Go', uptime: '99.99%', deploysPerWeek: 8, status: 'healthy' },
];
