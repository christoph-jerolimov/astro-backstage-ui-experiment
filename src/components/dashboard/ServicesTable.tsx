import {
  Cell,
  CellText,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
} from '@backstage/ui';
import { StatusPill, type StatusTone } from './StatusPill';
import { SERVICES, type Service, type ServiceStatus } from './data';

const STATUS: Record<ServiceStatus, { tone: StatusTone; label: string }> = {
  healthy: { tone: 'good', label: 'Healthy' },
  degraded: { tone: 'warning', label: 'Degraded' },
  down: { tone: 'critical', label: 'Down' },
};

interface ServicesTableProps {
  services?: Service[];
}

export function ServicesTable({ services = SERVICES }: ServicesTableProps) {
  return (
    <div className="table-scroll">
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
          {services.map((service) => (
            <Row key={service.name}>
              <CellText title={service.name} />
              <CellText title={service.owner} />
              <CellText title={service.language} />
              <CellText title={service.uptime} />
              <CellText title={String(service.deploysPerWeek)} />
              <Cell>
                <StatusPill {...STATUS[service.status]} />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableRoot>
    </div>
  );
}
