import { useState } from 'react';
import {
  Cell,
  CellText,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
} from '@backstage/ui';
import { DetailDrawer } from './DetailDrawer';
import { serviceDetail } from './detail';
import { StatusPill, type StatusTone } from './StatusPill';
import { withBase } from './base';
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
  // The row whose details are open in the drawer; null when it is closed.
  const [detail, setDetail] = useState<Service | null>(null);

  return (
    <div className="table-scroll" data-row-action="true">
      <TableRoot
        aria-label="Services"
        onRowAction={(key) =>
          setDetail(services.find((service) => service.name === key) ?? null)
        }
      >
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
            <Row key={service.name} id={service.name}>
              <CellText
                title={service.name}
                href={withBase(`/services/${service.name}`)}
              />
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

      {detail && (
        <DetailDrawer
          isOpen
          onOpenChange={(open) => !open && setDetail(null)}
          {...serviceDetail(detail)}
        />
      )}
    </div>
  );
}
