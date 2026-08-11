import {
  Cell,
  CellText,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
} from '@backstage/ui';
import { SERVICES, type ServiceStatus } from './data';

const STATUS_LABEL: Record<ServiceStatus, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
};

function StatusCell({ status }: { status: ServiceStatus }) {
  return (
    <span className={`status-cell status-${status}`}>
      {status === 'healthy' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M2.5 7.5l3 3 6-7" />
        </svg>
      )}
      {status === 'degraded' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M7 1.5l6 11H1z" />
          <path d="M7 6v3M7 10.8v.2" strokeWidth="1.8" />
        </svg>
      )}
      {status === 'down' && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      )}
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ServicesTable() {
  return (
    <TableRoot aria-label="Services">
      <TableHeader>
        <Column isRowHeader>Service</Column>
        <Column>Owner</Column>
        <Column>Language</Column>
        <Column>Uptime (30d)</Column>
        <Column>Deploys / week</Column>
        <Column>Status</Column>
      </TableHeader>
      <TableBody>
        {SERVICES.map((service) => (
          <Row key={service.name}>
            <CellText title={service.name} />
            <CellText title={service.owner} />
            <CellText title={service.language} />
            <CellText title={service.uptime} />
            <CellText title={String(service.deploysPerWeek)} />
            <Cell>
              <StatusCell status={service.status} />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </TableRoot>
  );
}
