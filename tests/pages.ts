/** The five routed pages, shared by the page and navigation specs. */
export const PAGES = [
  {
    name: 'overview',
    path: '/',
    navLabel: 'Overview',
    heading: 'Platform overview',
    expects: ['Deployments (7d)', 'Deploy success rate', 'catalog-api'],
  },
  {
    name: 'deployments',
    path: '/deployments',
    navLabel: 'Deployments',
    heading: 'Deployments',
    expects: ['Production deploys (7d)', 'dep-8842', 'Rolled back'],
  },
  {
    name: 'services',
    path: '/services',
    navLabel: 'Services',
    heading: 'Services',
    expects: ['Catalog', 'metrics-collector', '24 of 24 services'],
  },
  {
    name: 'catalog',
    path: '/catalog',
    navLabel: 'Catalog',
    heading: 'Catalog',
    expects: ['24 of 24 services', 'catalog-api'],
  },
  {
    name: 'incidents',
    path: '/incidents',
    navLabel: 'Incidents',
    heading: 'Incidents',
    expects: ['Mean time to resolve', 'INC-241', 'Incident log'],
  },
  {
    name: 'settings',
    path: '/settings',
    navLabel: 'Settings',
    heading: 'Settings',
    expects: ['Workspace name', 'Rollout strategy', 'Notify on failed deploys'],
  },
] as const;
