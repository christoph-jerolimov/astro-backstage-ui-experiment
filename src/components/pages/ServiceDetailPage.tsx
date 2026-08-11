import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Cell,
  CellText,
  Column,
  Flex,
  Link,
  Row,
  Tab,
  TabList,
  TabPanel,
  TableBody,
  TableHeader,
  TableRoot,
  Tabs,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@backstage/ui';
import { PageHeader } from '../dashboard/PageHeader';
import { StatTile } from '../dashboard/StatTile';
import { StatusPill } from '../dashboard/StatusPill';
import { LineChart } from '../dashboard/charts/LineChart';
import { withBase } from '../dashboard/base';
import {
  DAYS,
  DEPLOYMENTS,
  INCIDENTS,
  type Service,
  type ServiceStatus,
} from '../dashboard/data';

const STATUS: Record<ServiceStatus, { tone: 'good' | 'warning' | 'critical'; label: string }> = {
  healthy: { tone: 'good', label: 'Healthy' },
  degraded: { tone: 'warning', label: 'Degraded' },
  down: { tone: 'critical', label: 'Down' },
};

interface ServiceDetailPageProps {
  service: Service;
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const deployments = DEPLOYMENTS.filter((d) => d.service === service.name);
  const incidents = INCIDENTS.filter((i) => i.service === service.name);
  const days = DAYS.slice(-30);

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href={withBase('/services')}>Services</Link>
        <span aria-hidden="true">/</span>
        <Text variant="body-small" as="span">
          {service.name}
        </Text>
      </nav>

      <PageHeader
        title={service.name}
        description={`Owned by ${service.owner}. Written in ${service.language}.`}
        tags={[{ label: service.language }, { label: service.owner }]}
        metadata={[
          { label: 'Uptime (30d)', value: service.uptime },
          { label: 'Deploys / week', value: String(service.deploysPerWeek) },
        ]}
        actions={<Badge>{STATUS[service.status].label}</Badge>}
      />

      <Flex direction="column" gap="4" mt="4">
        <Tabs>
          <TabList aria-label={`${service.name} sections`}>
            <Tab id="overview">Overview</Tab>
            <Tab id="deployments">Deployments</Tab>
            <Tab id="incidents">Incidents</Tab>
          </TabList>

          <TabPanel id="overview">
            <Flex direction="column" gap="4" mt="4">
              <div className="kpi-row">
                <StatTile label="Status" value={STATUS[service.status].label} />
                <StatTile label="Uptime (30d)" value={service.uptime} />
                <StatTile
                  label="Deploys / week"
                  value={String(service.deploysPerWeek)}
                />
                <StatTile label="Open incidents" value={String(incidents.filter((i) => i.status === 'open').length)} />
              </div>

              <Card>
                <CardHeader>
                  <Flex align="center" justify="between">
                    <Text variant="title-x-small" as="h2">
                      Deployments per day
                    </Text>
                    <TooltipTrigger>
                      <span className="hint" tabIndex={0}>
                        Last 30 days
                      </span>
                      <Tooltip>
                        Fleet-wide series; per-service history is not wired up in
                        this demo.
                      </Tooltip>
                    </TooltipTrigger>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <LineChart
                    title={`Deployments per day for ${service.name}`}
                    labels={days.map((d) => d.label)}
                    series={[
                      {
                        name: 'Production',
                        color: 'var(--chart-series-1)',
                        values: days.map((d) => d.production),
                      },
                      {
                        name: 'Staging',
                        color: 'var(--chart-series-2)',
                        values: days.map((d) => d.staging),
                      },
                    ]}
                  />
                </CardBody>
              </Card>
            </Flex>
          </TabPanel>

          <TabPanel id="deployments">
            <Card>
              <CardHeader>
                <Text variant="title-x-small" as="h2">
                  Recent deployments
                </Text>
              </CardHeader>
              <CardBody>
                {deployments.length > 0 ? (
                  <div className="table-scroll">
                    <TableRoot aria-label={`${service.name} deployments`}>
                      <TableHeader>
                        <Column isRowHeader>Deployment</Column>
                        <Column>Environment</Column>
                        <Column>Version</Column>
                        <Column>Duration</Column>
                        <Column>When</Column>
                      </TableHeader>
                      <TableBody>
                        {deployments.map((deployment) => (
                          <Row key={deployment.id}>
                            <CellText title={deployment.id} />
                            <CellText title={deployment.environment} />
                            <CellText title={deployment.version} />
                            <CellText title={deployment.duration} />
                            <CellText title={deployment.when} />
                          </Row>
                        ))}
                      </TableBody>
                    </TableRoot>
                  </div>
                ) : (
                  <Text color="secondary">
                    No deployments recorded for this service.
                  </Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel id="incidents">
            <Card>
              <CardHeader>
                <Text variant="title-x-small" as="h2">
                  Incidents
                </Text>
              </CardHeader>
              <CardBody>
                {incidents.length > 0 ? (
                  <div className="table-scroll">
                    <TableRoot aria-label={`${service.name} incidents`}>
                      <TableHeader>
                        <Column isRowHeader>Incident</Column>
                        <Column>Title</Column>
                        <Column>Opened</Column>
                        <Column>Status</Column>
                      </TableHeader>
                      <TableBody>
                        {incidents.map((incident) => (
                          <Row key={incident.id}>
                            <CellText title={incident.id} />
                            <CellText title={incident.title} />
                            <CellText title={incident.opened} />
                            <Cell>
                              <StatusPill
                                tone={
                                  incident.status === 'resolved'
                                    ? 'good'
                                    : incident.status === 'mitigated'
                                      ? 'warning'
                                      : 'critical'
                                }
                                label={
                                  incident.status.charAt(0).toUpperCase() +
                                  incident.status.slice(1)
                                }
                              />
                            </Cell>
                          </Row>
                        ))}
                      </TableBody>
                    </TableRoot>
                  </div>
                ) : (
                  <Text color="secondary">
                    No incidents have been raised for this service.
                  </Text>
                )}
              </CardBody>
            </Card>
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
}
