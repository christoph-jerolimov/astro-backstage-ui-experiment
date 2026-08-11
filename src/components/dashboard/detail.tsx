// What each kind of row puts inside the shared DetailDrawer. Kept next to the
// drawer rather than in each page so a service opened from the catalog and a
// service opened from the overview say exactly the same things.
import { StatusPill, type StatusTone } from './StatusPill';
import { withBase } from './base';
import {
  DEPLOYMENTS,
  INCIDENTS,
  type Deployment,
  type Incident,
  type Service,
} from './data';
import type { DetailField } from './DetailDrawer';

const SERVICE_STATUS: Record<Service['status'], { tone: StatusTone; label: string }> = {
  healthy: { tone: 'good', label: 'Healthy' },
  degraded: { tone: 'warning', label: 'Degraded' },
  down: { tone: 'critical', label: 'Down' },
};

const DEPLOY_STATUS: Record<Deployment['status'], { tone: StatusTone; label: string }> = {
  succeeded: { tone: 'good', label: 'Succeeded' },
  failed: { tone: 'critical', label: 'Failed' },
  'rolled-back': { tone: 'warning', label: 'Rolled back' },
};

const INCIDENT_STATUS: Record<Incident['status'], { tone: StatusTone; label: string }> = {
  open: { tone: 'critical', label: 'Open' },
  mitigated: { tone: 'warning', label: 'Mitigated' },
  resolved: { tone: 'good', label: 'Resolved' },
};

export function serviceDetail(service: Service) {
  const openIncidents = INCIDENTS.filter(
    (incident) => incident.service === service.name && incident.status !== 'resolved',
  ).length;
  const lastDeploy = DEPLOYMENTS.find((d) => d.service === service.name);

  const fields: DetailField[] = [
    { label: 'Owner', value: service.owner },
    { label: 'Language', value: service.language },
    { label: 'Uptime (30d)', value: service.uptime },
    { label: 'Deploys / week', value: String(service.deploysPerWeek) },
    {
      label: 'Last deploy',
      value: lastDeploy
        ? `${lastDeploy.version} to ${lastDeploy.environment}, ${lastDeploy.when}`
        : 'No deploys in this window',
    },
    {
      label: 'Open incidents',
      value: openIncidents === 0 ? 'None' : String(openIncidents),
    },
  ];

  return {
    kind: 'Service',
    title: service.name,
    status: <StatusPill {...SERVICE_STATUS[service.status]} />,
    fields,
    link: {
      href: withBase(`/services/${service.name}`),
      label: 'Open service page',
    },
  };
}

export function deploymentDetail(deployment: Deployment) {
  const fields: DetailField[] = [
    { label: 'Service', value: deployment.service },
    { label: 'Environment', value: deployment.environment },
    { label: 'Version', value: deployment.version },
    { label: 'Duration', value: deployment.duration },
    { label: 'Finished', value: deployment.when },
    {
      label: 'Triggered by',
      value: deployment.environment === 'production' ? 'Release approval' : 'Merge to main',
    },
  ];

  return {
    kind: 'Deployment',
    title: deployment.id,
    status: <StatusPill {...DEPLOY_STATUS[deployment.status]} />,
    fields,
    link: {
      href: withBase(`/services/${deployment.service}`),
      label: `Open ${deployment.service}`,
    },
  };
}

export function incidentDetail(incident: Incident) {
  const fields: DetailField[] = [
    { label: 'Service', value: incident.service },
    { label: 'Severity', value: incident.severity.toUpperCase() },
    { label: 'Opened', value: incident.opened },
    {
      label: 'Commander',
      value: incident.severity === 'sev1' ? 'Ada Lovelace' : 'Owning team',
    },
    {
      label: 'Paging',
      value:
        incident.severity === 'sev3' ? 'Ticket only' : 'Paged the owning team',
    },
  ];

  return {
    kind: 'Incident',
    title: `${incident.id} · ${incident.title}`,
    status: <StatusPill {...INCIDENT_STATUS[incident.status]} />,
    fields,
    link: {
      href: withBase(`/services/${incident.service}`),
      label: `Open ${incident.service}`,
    },
  };
}
