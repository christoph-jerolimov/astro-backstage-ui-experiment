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

export type DeployStatus = 'succeeded' | 'failed' | 'rolled-back';

export interface Deployment {
  id: string;
  service: string;
  environment: 'production' | 'staging';
  version: string;
  duration: string;
  when: string;
  status: DeployStatus;
}

export const DEPLOYMENTS: Deployment[] = [
  { id: 'dep-8842', service: 'catalog-api', environment: 'production', version: 'v2.14.0', duration: '3m 12s', when: '12 minutes ago', status: 'succeeded' },
  { id: 'dep-8841', service: 'search-indexer', environment: 'production', version: 'v1.8.3', duration: '5m 41s', when: '48 minutes ago', status: 'succeeded' },
  { id: 'dep-8840', service: 'notification-hub', environment: 'production', version: 'v0.9.7', duration: '2m 05s', when: '1 hour ago', status: 'rolled-back' },
  { id: 'dep-8839', service: 'auth-gateway', environment: 'staging', version: 'v3.2.0-rc1', duration: '4m 18s', when: '2 hours ago', status: 'succeeded' },
  { id: 'dep-8838', service: 'billing-worker', environment: 'production', version: 'v1.4.2', duration: '6m 02s', when: '3 hours ago', status: 'failed' },
  { id: 'dep-8837', service: 'metrics-collector', environment: 'staging', version: 'v2.0.1', duration: '1m 55s', when: '4 hours ago', status: 'succeeded' },
  { id: 'dep-8836', service: 'catalog-api', environment: 'staging', version: 'v2.14.0-rc3', duration: '3m 07s', when: '5 hours ago', status: 'succeeded' },
];

export type Severity = 'sev1' | 'sev2' | 'sev3';

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  opened: string;
  status: 'open' | 'mitigated' | 'resolved';
}

export const INCIDENTS: Incident[] = [
  { id: 'INC-241', title: 'Elevated 5xx on delivery', service: 'notification-hub', severity: 'sev1', opened: 'Aug 11, 09:14', status: 'open' },
  { id: 'INC-240', title: 'Token refresh latency', service: 'auth-gateway', severity: 'sev2', opened: 'Aug 11, 06:02', status: 'open' },
  { id: 'INC-238', title: 'Search index lag', service: 'search-indexer', severity: 'sev2', opened: 'Aug 10, 22:47', status: 'mitigated' },
  { id: 'INC-235', title: 'Billing export timeout', service: 'billing-worker', severity: 'sev3', opened: 'Aug 9, 14:20', status: 'resolved' },
  { id: 'INC-231', title: 'Cold-start regression', service: 'catalog-api', severity: 'sev3', opened: 'Aug 7, 11:05', status: 'resolved' },
];

/** Incidents opened per calendar week, oldest first. */
export const INCIDENTS_PER_WEEK = [
  { label: 'Jun 15', value: 6 },
  { label: 'Jun 22', value: 4 },
  { label: 'Jun 29', value: 7 },
  { label: 'Jul 6', value: 3 },
  { label: 'Jul 13', value: 5 },
  { label: 'Jul 20', value: 2 },
  { label: 'Jul 27', value: 4 },
  { label: 'Aug 3', value: 3 },
  { label: 'Aug 10', value: 2 },
];

export const SERVICES: Service[] = [
  { name: 'catalog-api', owner: 'team-atlas', language: 'TypeScript', uptime: '99.99%', deploysPerWeek: 14, status: 'healthy' },
  { name: 'search-indexer', owner: 'team-atlas', language: 'Go', uptime: '99.95%', deploysPerWeek: 9, status: 'healthy' },
  { name: 'auth-gateway', owner: 'team-vault', language: 'Go', uptime: '99.90%', deploysPerWeek: 6, status: 'degraded' },
  { name: 'billing-worker', owner: 'team-ledger', language: 'Python', uptime: '99.97%', deploysPerWeek: 4, status: 'healthy' },
  { name: 'notification-hub', owner: 'team-signal', language: 'TypeScript', uptime: '98.71%', deploysPerWeek: 11, status: 'down' },
  { name: 'metrics-collector', owner: 'team-signal', language: 'Go', uptime: '99.99%', deploysPerWeek: 8, status: 'healthy' },
];
