// Everywhere the command palette can take you. The nav is a subset of this:
// the palette also reaches the account pages, the wizard and every service,
// which is the point of having one.
import { SERVICES } from './data';

export interface Destination {
  id: string;
  label: string;
  href: string;
  /** Extra words the search should match, e.g. synonyms for the label. */
  keywords?: string;
}

export const PAGES: Destination[] = [
  { id: 'overview', label: 'Overview', href: '/', keywords: 'home dashboard start' },
  { id: 'search', label: 'Search', href: '/search', keywords: 'find lookup' },
  { id: 'deployments', label: 'Deployments', href: '/deployments', keywords: 'releases ship rollout' },
  { id: 'services', label: 'Services', href: '/services', keywords: 'apps components' },
  { id: 'catalog', label: 'Catalog', href: '/catalog', keywords: 'inventory table' },
  { id: 'incidents', label: 'Incidents', href: '/incidents', keywords: 'outage sev on-call' },
  { id: 'notifications', label: 'Notifications', href: '/notifications', keywords: 'inbox alerts' },
  { id: 'docs', label: 'Docs', href: '/docs', keywords: 'documentation guides handbook' },
  { id: 'team', label: 'Team', href: '/team', keywords: 'people members invite roles' },
  { id: 'settings', label: 'Settings', href: '/settings', keywords: 'preferences workspace' },
];

export const ACCOUNT: Destination[] = [
  { id: 'help', label: 'Help centre', href: '/help', keywords: 'faq support questions answers' },
  { id: 'changelog', label: 'Changelog', href: '/changelog', keywords: 'releases what is new versions' },
  { id: 'blog', label: 'Blog', href: '/blog', keywords: 'writing posts articles news' },
  { id: 'home', label: 'Marketing home', href: '/home', keywords: 'landing website public' },
  { id: 'profile', label: 'Profile', href: '/profile', keywords: 'account me ada' },
  { id: 'api-keys', label: 'API keys', href: '/api-keys', keywords: 'tokens secrets credentials' },
  { id: 'billing', label: 'Billing', href: '/billing', keywords: 'plan seats usage payment' },
  { id: 'invoices', label: 'Invoices', href: '/billing/invoices', keywords: 'receipts bills history' },
  { id: 'audit', label: 'Audit log', href: '/audit', keywords: 'history activity who did what' },
  { id: 'organizations', label: 'Organizations', href: '/organizations', keywords: 'workspaces switch tenant' },
  { id: 'roles', label: 'Roles', href: '/roles', keywords: 'permissions access grants' },
  { id: 'pricing', label: 'Pricing', href: '/pricing', keywords: 'plans billing cost' },
  { id: 'signin', label: 'Sign out', href: '/signin', keywords: 'log out sign in' },
];

export const ACTIONS: Destination[] = [
  {
    id: 'create-service',
    label: 'Create a service',
    href: '/services/new',
    keywords: 'new add scaffold template wizard',
  },
];

export const SERVICE_DESTINATIONS: Destination[] = SERVICES.map((service) => ({
  id: `service-${service.name}`,
  label: service.name,
  href: `/services/${service.name}`,
  keywords: `${service.owner} ${service.language}`,
}));
